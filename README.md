# JinnxAutomation — Current Source Package

This package is a clean, runnable React recreation of the current JinnxAutomation site content preserved in the ChatGPT Library site artifact, plus the admin/inquiry functionality requested for the application.

## Current site reference

- Brand: **JinnxAutomation**
- Headline: **Your idea. Months of waiting. We ship it in 100 hours.**
- Base MVP shown on site: **$10,999 / 100 hours**
- Flow: Discovery (12h) → AI-powered development (72h) → Testing & polish (8h) → Launch handoff (8h)
- Current ChatGPT-hosted site artifact slug: `jinnxautomation`
- Preserved live-site record: `https://jinnxautomation.hibestow001.chatgpt.site`

> Important: ChatGPT Library exposes the deployed site's rendered content/metadata but does not expose the original internal generated source tree. This package therefore reconstructs the full runnable source from the preserved current site content and the most recent Jinnx requirements rather than claiming to be a byte-for-byte export of the hidden internal project.

## Included

- Responsive React/Vite website
- Full JinnxAutomation current marketing content
- 100-hour sprint sections and animations
- Interactive package/pricing calculator
- Industry/portfolio section
- FAQ accordion
- Project inquiry form
- `/admin` protected admin screen
- Inquiry status workflow, per-inquiry contact notes, and CSV export
- Supabase (Postgres) inquiry storage
- Rate limiting, secure headers, SameSite session cookies, honeypot field, input limits, and origin checks
- Docker and docker-compose setup, and Vercel-ready (`vercel.json` + `api/index.mjs`)
- `.env.example`

## One-time database setup

This app stores inquiries in Supabase Postgres. Before running it anywhere:

1. Open your Supabase project's **SQL Editor**.
2. Paste the contents of `supabase/schema.sql` and click **Run**.

This creates the `inquiries` table with Row Level Security enabled and no public policies — the app talks to it exclusively through the service role key, which bypasses RLS. It's safe to re-run; every statement is idempotent.

## Local development

```bash
cp .env.example .env
# fill in ADMIN_EMAIL / ADMIN_PASSWORD / SESSION_SECRET / SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY
npm install
npm run dev
```

The Vite dev server proxies `/api` to the backend. In a second terminal run:

```bash
npm run server
```

For a production-style run:

```bash
npm install
npm run build
npm start
```

Open `http://localhost:8080` and `http://localhost:8080/admin`. Requires Node 20.6+ (uses `node --env-file`).

## Required environment variables

```env
PORT=8080
NODE_ENV=production
ADMIN_EMAIL=your-private-admin-email@example.com
ADMIN_PASSWORD=use-a-long-random-password
SESSION_SECRET=use-a-long-random-random-secret-at-least-32-characters
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

Never commit `.env`. `SUPABASE_SERVICE_ROLE_KEY` is server-only — it must never be shipped to the browser bundle (nothing under `src/` imports it).

## Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel (or run `vercel` from this directory).
2. In the Vercel project's Environment Variables, set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`.
3. Deploy. `vercel.json` builds the Vite frontend to `dist/` and routes `/api/*` to the Express app in `api/index.mjs` as a serverless function; everything else falls back to the SPA.

Note: `express-rate-limit`'s default in-memory store resets per serverless instance on Vercel, so rate limiting there is best-effort rather than a hard global cap. For a stricter guarantee, swap in a shared store (e.g. Upstash Redis).

## Docker

```bash
cp .env.example .env
# edit .env first
docker compose up -d --build
```

## Data

Inquiries live in the `inquiries` table in your Supabase project (see `supabase/schema.sql`). Back up your Supabase project as you would any production database.

## Security note

No application can truthfully be called “hack-proof.” This build includes sensible baseline protections, but production deployment should still use HTTPS, a strong unique admin password, a strong session secret, operating-system/container updates, regular backups, and upstream reverse-proxy/WAF controls where appropriate.
