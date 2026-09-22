import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';

const nodeRequire = createRequire(import.meta.url);
const origin = 'https://jinnx.test';
process.env.NODE_ENV = 'production';
process.env.ALLOWED_ORIGINS = origin;
process.env.ADMIN_PASSWORD = 'correct-horse-battery-staple';
process.env.AUTH_SECRET = 'a'.repeat(64);

// Real Postgres semantics in-process: ILIKE, ON CONFLICT and RETURNING all
// behave as they will on the deployed database.
const client = new PGlite();
const migration = fs.readFileSync('drizzle/0000_boring_mordo.sql', 'utf8');
for (const statement of migration.split('--> statement-breakpoint')) {
  if (statement.trim()) await client.exec(statement);
}

// A cookie jar standing in for next/headers, so the real HMAC session code runs.
const jar = new Map();
const cookieStore = {
  get: (name) => (jar.has(name) ? { value: jar.get(name) } : undefined),
  set: (name, value) => jar.set(name, value),
  delete: (name) => jar.delete(name),
};

const sandbox = {
  console, process, Response, Request, URL, URLSearchParams, TextEncoder, TextDecoder,
  crypto, Date, JSON, Math, Number, String, Boolean, Array, Object, Set, Map, WeakMap,
  Error, TypeError, RangeError, Promise, RegExp, Symbol, BigInt, Uint8Array, ArrayBuffer,
  isNaN, parseInt, parseFloat, structuredClone, AbortController,
};
sandbox.globalThis = sandbox;
const context = vm.createContext(sandbox);

let db;
const loaded = {};
function load(path) {
  if (loaded[path]) return loaded[path];
  const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const mod = { exports: {} };
  const require = (name) => {
    if (name === '@/db/schema' || name === './schema') return load('db/schema.ts');
    if (name === '@/db') return { getDb: () => db };
    if (name === '@/lib/server/db' || name === './db') return load('lib/server/db.ts');
    if (name === '@/lib/server/auth' || name === './auth') return load('lib/server/auth.ts');
    if (name === '@/lib/inquiries') return load('lib/inquiries.ts');
    if (name === '@/lib/server/security') return load('lib/server/security.ts');
    if (name === 'next/headers') return { cookies: async () => cookieStore };
    return nodeRequire(name);
  };
  // One shared context keeps classes and globals identical across modules, so
  // each module body needs its own function scope to avoid colliding consts.
  const wrapper = vm.runInContext('(function (exports, module, require) {' + code + '\n})', context);
  wrapper(mod.exports, mod, require);
  loaded[path] = mod.exports;
  return mod.exports;
}

const schema = load('db/schema.ts');
db = drizzle(client, { schema });

const auth = load('lib/server/auth.ts');
const intake = load('app/api/inquiries/route.ts');
const admin = load('app/api/admin/inquiries/route.ts');
const edit = load('app/api/admin/inquiries/[id]/route.ts');
const session = load('app/api/admin/session/route.ts');
const core = load('lib/inquiries.ts');

const post = (body, originValue = origin, path = '/api/inquiries') =>
  new Request(origin + path, {
    method: 'POST',
    headers: { origin: originValue, 'Content-Type': 'application/json', 'X-Jinnx-Request': '1' },
    body: JSON.stringify(body),
  });

const password = 'correct-horse-battery-staple';
const data = {
  id: crypto.randomUUID(),
  name: 'Test Founder',
  email: 'test@example.com',
  idea: 'Build a CRM automation workflow for our customer inquiries.',
  addons: [0, 3],
  consent: true,
  website: '',
};
const rows = async (query) => (await client.query(query)).rows;
const signAdmin = async (expires) => {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(process.env.AUTH_SECRET),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode('admin:' + expires));
  return Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, '0')).join('');
};

// --- access control -------------------------------------------------------
assert.equal((await admin.GET(new Request(origin + '/api/admin/inquiries'))).status, 401,
  'admin list must reject an anonymous caller');
assert.equal((await edit.PATCH(post({ status: 'contacted', notes: '', version: 1 }),
  { params: Promise.resolve({ id: data.id }) })).status, 401,
  'admin edit must reject an anonymous caller');

jar.set('jinnx_admin', (Date.now() + 60000) + '.' + 'f'.repeat(64));
assert.equal((await admin.GET(new Request(origin + '/api/admin/inquiries'))).status, 401,
  'a cookie with a bad signature must be rejected');
jar.clear();

// --- login ----------------------------------------------------------------
assert.equal((await session.POST(post({ password: 'wrong-password' }, origin, '/api/admin/session'))).status, 401,
  'a wrong password must not sign in');
assert.equal(jar.size, 0, 'a failed login must not set a cookie');
assert.equal((await session.POST(post({ password }, origin, '/api/admin/session'))).status, 200,
  'the correct password must sign in');
assert.ok(jar.has('jinnx_admin'), 'a successful login sets the session cookie');
assert.equal(await auth.hasSession(), true, 'the issued cookie must verify');

const expired = Date.now() - 1000;
jar.set('jinnx_admin', expired + '.' + (await signAdmin(expired)));
assert.equal(await auth.hasSession(), false, 'a correctly signed but expired session is rejected');
await session.POST(post({ password }, origin, '/api/admin/session'));

// --- intake validation ----------------------------------------------------
assert.equal((await intake.POST(post(data, 'https://attacker.example'))).status, 403, 'cross-origin POST is refused');
assert.equal((await intake.POST(post({ ...data, addons: [99] }))).status, 400, 'unknown add-on index is refused');
assert.equal((await intake.POST(post({ ...data, estimate: 1 }))).status, 400, 'a client-supplied price is refused');
assert.equal((await intake.POST(post({ ...data, consent: false }))).status, 400, 'missing consent is refused');
assert.equal((await intake.POST(post({ ...data, idea: 'x'.repeat(13000) }))).status, 413, 'an oversized body is refused');

// --- intake, idempotency and server-side pricing --------------------------
assert.equal((await intake.POST(post(data))).status, 201, 'a valid inquiry is accepted');
assert.equal((await intake.POST(post(data))).status, 201, 'resubmitting the same reference is idempotent');
assert.equal(Number((await rows('SELECT COUNT(*) n FROM inquiries'))[0].n), 1, 'the duplicate did not create a second row');
assert.equal(Number((await rows('SELECT estimate FROM inquiries'))[0].estimate), 0, 'no price is computed or stored');
assert.equal((await intake.POST(post({ ...data, idea: 'A different project description entirely, rewritten.' }))).status, 409,
  'reusing a reference with new content conflicts');

// --- admin read -----------------------------------------------------------
const listed = await admin.GET(new Request(origin + '/api/admin/inquiries'));
assert.equal(listed.status, 200, 'a signed-in owner can read the inbox');
const body = await listed.json();
assert.equal(body.total, 1);
assert.equal(body.inquiries[0].name, 'Test Founder');
assert.equal(typeof body.inquiries[0].created_at, 'number', 'timestamps stay epoch milliseconds');
assert.equal(body.inquiries[0].consent_at, undefined, 'consent_at is not exposed');

assert.equal((await (await admin.GET(new Request(origin + '/api/admin/inquiries?q=TEST+FOUNDER'))).json()).total, 1,
  'search stays case-insensitive on Postgres');
assert.equal((await (await admin.GET(new Request(origin + '/api/admin/inquiries?q='
  + encodeURIComponent("' OR 1=1 --")))).json()).total, 0, 'search input is parameterised');

// --- optimistic concurrency ----------------------------------------------
const update = { status: 'contacted', notes: 'Follow up tomorrow', version: 1 };
const patched = await edit.PATCH(post(update), { params: Promise.resolve({ id: data.id }) });
assert.equal(patched.status, 200, 'the first edit succeeds');
assert.equal((await patched.json()).inquiry.version, 2, 'the version is incremented');
assert.equal((await edit.PATCH(post(update), { params: Promise.resolve({ id: data.id }) })).status, 409,
  'a stale version is refused');
assert.equal((await rows('SELECT notes FROM inquiries'))[0].notes, 'Follow up tomorrow');

// --- CSV ------------------------------------------------------------------
const csv = await admin.GET(new Request(origin + '/api/admin/inquiries?export=csv'));
assert.equal(csv.status, 200);
assert.match(await csv.text(), /Test Founder/);
assert.equal(core.csvCell('=1+1'), '"\'=1+1"', 'formula injection is neutralised');

// --- rate limiting --------------------------------------------------------
// Three submissions already counted against this identity: the accepted one,
// the idempotent repeat, and the conflicting reuse (all reach the limiter).
for (let i = 0; i < 2; i += 1) {
  assert.equal((await intake.POST(post({ ...data, id: crypto.randomUUID() }))).status, 201,
    'submissions four and five are still allowed');
}
assert.equal((await intake.POST(post({ ...data, id: crypto.randomUUID() }))).status, 429,
  'the sixth submission in the window is throttled');

// --- sign out -------------------------------------------------------------
assert.equal((await session.DELETE(post({}, origin, '/api/admin/session'))).status, 200);
assert.equal(jar.size, 0, 'signing out clears the cookie');
assert.equal((await admin.GET(new Request(origin + '/api/admin/inquiries'))).status, 401,
  'the inbox is closed again after signing out');

await client.close();
console.log('PASS: session auth (forged/expired/wrong-password), access denial, CSRF, validation, body limit, server pricing, idempotency, conflict protection, case-insensitive search, SQL parameterisation, CSV safety, rate limits, sign-out.');
