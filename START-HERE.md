# Jinnx Automation — version 4 source export

Exact published source commit: 1972ab5dcd5b9439256d19d13000a4c38a689901

Includes React pages, styles, animations, logo and image assets, inquiry APIs,
admin inbox, database schema and migrations, security tests, and dependency lockfile.

## Local setup

Install Node.js 22.13 or newer and pnpm 11.25.0. From this directory run:

    pnpm install --frozen-lockfile
    pnpm dev

For a production build:

    pnpm build

Read README.md for the runtime and local database migration instructions.
The application uses React with Next.js App Router conventions, executed by
Vinext on Cloudflare Workers. Persistent inquiries use Cloudflare D1.

## Admin and hosting

The admin route is /admin. Authentication on the hosted Site uses ChatGPT sign-in
and owner authorization; there is no shared admin password in this archive.
Hosting elsewhere requires configuring a D1 database and a trusted authentication
integration. Do not accept client-supplied identity headers as authentication.
The archive includes database schema and migrations, not production inquiry data.
Dependencies and generated build outputs are not included; install and build first.

This export preserves the website source without changing the live site.

## Contact update — 21 September 2026
Both phone numbers, info@jinnxautomation.com, business hours, and Chicago and Glasgow office addresses are included on the contact page and site footers. Office addresses verified against https://jinnxbookpress.com/contact. This is a source ZIP update; the deployed Site is unchanged. Adding the email link does not provision an email mailbox.
