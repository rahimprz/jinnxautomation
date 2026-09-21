import { cookies } from 'next/headers';

// ChatGPT sign-in was dispatch-owned and injected `oai-authenticated-user-*`
// headers. Nothing injects or strips those outside that platform, so trusting
// them here would let any client claim to be the owner. The inbox is a single
// operator surface, so a shared password plus a signed session cookie replaces
// it without adding an identity provider.
const COOKIE = 'jinnx_admin';
const SESSION_TTL = 12 * 60 * 60 * 1000;

function requiredSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'AUTH_SECRET is missing or shorter than 32 characters. Generate one with `openssl rand -hex 32`.'
    );
  }
  return secret;
}

function hex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function sign(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(requiredSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message)));
}

// Compares in constant time so a wrong value cannot be narrowed character by
// character from response timing.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifyPassword(candidate: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 12) {
    throw new Error(
      'ADMIN_PASSWORD is missing or shorter than 12 characters. Set a strong value before exposing /admin.'
    );
  }
  // Hashing both sides first keeps the comparison constant time and hides the
  // real password length.
  return safeEqual(await sign(`pw:${candidate}`), await sign(`pw:${expected}`));
}

export async function startSession(): Promise<void> {
  const expires = Date.now() + SESSION_TTL;
  const store = await cookies();
  store.set(COOKIE, `${expires}.${await sign(`admin:${expires}`)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(SESSION_TTL / 1000),
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function hasSession(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;

  const separator = token.indexOf('.');
  if (separator < 1) return false;

  const expires = Number(token.slice(0, separator));
  if (!Number.isSafeInteger(expires) || expires <= Date.now()) return false;

  return safeEqual(token.slice(separator + 1), await sign(`admin:${expires}`));
}
