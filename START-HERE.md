# Jinnx Automation — source

Next.js 16 App Router site with the inquiry intake API, admin inbox, database
schema and migrations, security tests, and dependency lockfile.

## Setup

Install Node.js 22.13 or newer and pnpm 11.25.0, then:

    pnpm install
    cp .env.example .env.local
    pnpm db:migrate
    pnpm dev

Read README.md for the environment variables, deployment steps, and database
notes. The application runs on Vercel and stores inquiries in Postgres.

## Admin and hosting

The admin route is /admin, protected by the `ADMIN_PASSWORD` environment
variable with a signed session cookie. There is no shared password in this
archive; set your own. Do not accept client-supplied identity headers as
authentication.

The archive includes database schema and migrations, not production inquiry
data. Dependencies and generated build outputs are not included; install and
build first.

## Contact details

Both phone numbers, info@jinnxautomation.com, business hours, and the Chicago
and Glasgow office addresses appear on the contact page and site footers.
