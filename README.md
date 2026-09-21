# Jinnx Automation

The Jinnx Automation marketing site and inquiry inbox: a Next.js 16 App Router
application deployed on Vercel, storing inquiries in Postgres through Drizzle.

## Prerequisites

- Node.js `>=22.13.0`
- pnpm `11.25.0` (`corepack enable`)
- A Postgres database (Supabase, Neon, or any Postgres 14+)

## Local setup

```sh
pnpm install
cp .env.example .env.local   # then fill in the values below
pnpm db:migrate              # create the tables
pnpm dev                     # http://localhost:3000
```

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | Postgres connection string. On Supabase use the pooled `:6543` URI. |
| `ADMIN_PASSWORD` | yes | Password for `/admin`. Minimum 12 characters. |
| `AUTH_SECRET` | yes | Signs the admin session cookie. Minimum 32 characters; generate with `openssl rand -hex 32`. |
| `ALLOWED_ORIGINS` | no | Comma-separated extra origins allowed to submit the contact form. |

The contact form and the admin inbox reject any POST whose `Origin` is not
allowed. Vercel's production and per-deployment URLs are trusted automatically
from `VERCEL_PROJECT_PRODUCTION_URL` and `VERCEL_URL`, and `localhost:3000` is
trusted outside production. **Add a custom domain to `ALLOWED_ORIGINS`**, or
submissions from it will be refused. The allowlist fails closed: if nothing
matches, the request is rejected rather than accepted.

## Deploying to Vercel

1. Import the repository in Vercel. The Next.js preset is correct; no build
   settings need changing.
2. Add `DATABASE_URL`, `ADMIN_PASSWORD` and `AUTH_SECRET` under
   Settings → Environment Variables, for every environment you deploy.
3. Run the migration against the production database once:

   ```sh
   DATABASE_URL='postgresql://…' pnpm db:migrate
   ```

4. Deploy. Pushes to the default branch deploy automatically.

After attaching a custom domain, set `ALLOWED_ORIGINS` to it and redeploy.

## Admin inbox

`/admin` lists inquiries with search, status filtering, notes and CSV export.
It is protected by `ADMIN_PASSWORD`; signing in sets an HttpOnly, SameSite=Lax
cookie signed with `AUTH_SECRET` that expires after 12 hours. Login attempts
share the submission rate limiter, so the password cannot be guessed in bulk.

This is single-operator auth by design. Anyone with the password has full
access to every inquiry, so rotate `ADMIN_PASSWORD` when someone leaves, and
rotate `AUTH_SECRET` to invalidate every outstanding session immediately.

## Data

`inquiries` holds submissions; `request_limits` backs rate limiting. Timestamps
are stored as epoch-millisecond `bigint` values, not SQL timestamps. Pricing is
computed server-side from the submitted add-on indexes — a client-supplied
`estimate` is rejected. Reposting the same reference id is idempotent; reusing
it with different content returns 409.

After editing `db/schema.ts`, run `pnpm db:generate` to write a migration, then
`pnpm db:migrate` to apply it.

## Commands

- `pnpm dev`: development server
- `pnpm build`: production build
- `pnpm start`: serve the production build
- `pnpm test`: security suite (auth, CSRF, validation, rate limits, SQL
  parameterisation, CSV escaping) against in-process Postgres via PGlite
- `pnpm lint`: ESLint
- `pnpm db:generate` / `pnpm db:migrate`: Drizzle migrations
