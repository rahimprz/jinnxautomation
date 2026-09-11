import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cookieSession from 'cookie-session'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { supabaseAdmin } from './lib/supabaseAdmin.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProd = process.env.NODE_ENV === 'production'

export const app = express()

app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(helmet({ contentSecurityPolicy: { directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"], styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'], fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'], imgSrc: ["'self'", 'data:'], connectSrc: ["'self'"] } } }))
app.use(express.json({ limit: '50kb' }))
app.use(cookieSession({ name: 'jinnx_admin', keys: [process.env.SESSION_SECRET || 'dev-only-change-this-secret-immediately'], httpOnly: true, sameSite: 'strict', secure: isProd, maxAge: 1000 * 60 * 60 * 8 }))

const inquiryLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: 'draft-8', legacyHeaders: false })
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false })

const clean = (v, max = 500) => String(v ?? '').trim().slice(0, max)
const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
const STATUSES = new Set(['new', 'contacted', 'qualified', 'closed'])

function toApi(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    name: row.name,
    email: row.email,
    company: row.company,
    phone: row.phone,
    projectType: row.project_type,
    budget: row.budget,
    message: row.message,
    status: row.status,
    notes: row.notes,
    contactedAt: row.contacted_at
  }
}

function adminOnly(req, res, next) {
  if (req.session?.admin === true) return next()
  return res.status(401).json({ error: 'unauthorized' })
}
function sameOrigin(req, res, next) {
  const origin = req.get('origin')
  const host = req.get('host')
  if (!origin || new URL(origin).host === host) return next()
  return res.status(403).json({ error: 'origin_mismatch' })
}
function safeEq(a, b) {
  const aa = Buffer.from(String(a))
  const bb = Buffer.from(String(b))
  if (aa.length !== bb.length) return false
  return crypto.timingSafeEqual(aa, bb)
}

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.post('/api/inquiries', inquiryLimiter, sameOrigin, async (req, res) => {
  const b = req.body || {}
  if (clean(b.website, 100)) return res.status(200).json({ ok: true })
  const name = clean(b.name, 120), email = clean(b.email, 200), message = clean(b.message, 4000)
  if (name.length < 2 || !validEmail(email) || message.length < 10) return res.status(400).json({ error: 'invalid_input' })
  const { error } = await supabaseAdmin.from('inquiries').insert({
    name,
    email,
    company: clean(b.company, 160),
    phone: clean(b.phone, 80),
    project_type: clean(b.projectType, 120),
    budget: clean(b.budget, 120),
    message,
    status: 'new'
  })
  if (error) {
    console.error('insert inquiry failed', error)
    return res.status(500).json({ error: 'server_error' })
  }
  res.status(201).json({ ok: true })
})

app.get('/api/admin/session', (req, res) => res.json({ authenticated: req.session?.admin === true }))

app.post('/api/admin/login', loginLimiter, sameOrigin, (req, res) => {
  const email = clean(req.body?.email, 200).toLowerCase(), pass = String(req.body?.password ?? '')
  const expectedEmail = String(process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase()
  const expectedPass = String(process.env.ADMIN_PASSWORD || 'change-me')
  if (safeEq(email, expectedEmail) && safeEq(pass, expectedPass)) {
    req.session.admin = true
    return res.json({ ok: true })
  }
  res.status(401).json({ error: 'invalid_credentials' })
})

app.post('/api/admin/logout', sameOrigin, (req, res) => { req.session = null; res.json({ ok: true }) })

app.get('/api/admin/inquiries', adminOnly, async (req, res) => {
  const { data, error } = await supabaseAdmin.from('inquiries').select('*').order('created_at', { ascending: false })
  if (error) {
    console.error('list inquiries failed', error)
    return res.status(500).json({ error: 'server_error' })
  }
  res.json(data.map(toApi))
})

app.patch('/api/admin/inquiries/:id', adminOnly, sameOrigin, async (req, res) => {
  const patch = {}
  if (req.body?.status !== undefined) {
    const status = clean(req.body.status, 30)
    if (!STATUSES.has(status)) return res.status(400).json({ error: 'invalid_status' })
    patch.status = status
    if (status === 'contacted') patch.contacted_at = new Date().toISOString()
  }
  if (req.body?.notes !== undefined) {
    patch.notes = clean(req.body.notes, 4000)
  }
  if (Object.keys(patch).length === 0) return res.status(400).json({ error: 'no_changes' })
  const { data, error } = await supabaseAdmin.from('inquiries').update(patch).eq('id', req.params.id).select().maybeSingle()
  if (error) {
    console.error('update inquiry failed', error)
    return res.status(500).json({ error: 'server_error' })
  }
  if (!data) return res.status(404).json({ error: 'not_found' })
  res.json(toApi(data))
})

app.delete('/api/admin/inquiries/:id', adminOnly, sameOrigin, async (req, res) => {
  const { data, error } = await supabaseAdmin.from('inquiries').delete().eq('id', req.params.id).select().maybeSingle()
  if (error) {
    console.error('delete inquiry failed', error)
    return res.status(500).json({ error: 'server_error' })
  }
  if (!data) return res.status(404).json({ error: 'not_found' })
  res.json({ ok: true })
})

// Static hosting is only used for local dev / Docker. On Vercel, the built
// dist/ output is served directly by the platform and this branch is unused.
app.use(express.static(path.join(__dirname, 'dist'), { maxAge: isProd ? '1h' : 0, index: false }))
app.use((req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'not_found' })
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})
