# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: owners and operators of small, owner-led businesses. They run the inbox, the follow-ups, the quotes and the invoices themselves, alongside the actual work. Non-technical; they buy outcomes and trust, not tooling. They arrive from a referral or a search with a specific pain (leads slipping, replies late, records scattered) and need to see quickly that this is for a business their size.

Secondary (confirmed by keeping the launch offer): founders and small teams who need a focused first software release built.

## Product Purpose

Jinnx Automation designs and builds automation for small businesses: CRM and sales pipelines, AI-assisted reply and follow-up, workflow automation, integrations and reporting, focused AI assistants, custom portals, and a phased product-launch sprint. Success is a visitor understanding within seconds that this is automation for a business like theirs, trusting that it keeps a human in control, and submitting an inquiry.

## Positioning

Automation with a human approval gate built in: systems prepare (find leads, draft replies, route records, assemble reports) and a person authorizes the consequential step (send, publish, change a record, commit). Every offer states its boundaries plainly. The site leads with automation and CRM; the launch sprint is one service among several, not the front door.

Pricing is never shown. No dollar amounts, package prices, add-on prices, hourly rates, or price-based estimates appear anywhere on the site, in forms, or in generated emails.

## Operating Context

- Primary action everywhere: the inquiry form (name, email, project description, consent, optional interests), which lands in the owner's admin inbox at `/admin`. Phone and email (`info@jinnxautomation.com`, two numbers, business hours, Chicago and Glasgow offices, as published on the contact page) are secondary.
- Automation capabilities to present as offerings, each described by how it works, never by price: lead discovery and qualification into a CRM; AI-drafted replies and follow-ups that wait for human approval before sending; a CRM pipeline with clear next steps and ownership; email campaigns from approved mailboxes with reply tracking; invoicing with payment links; reporting across these. Do not attribute these to any named business.
- The launch sprint is a phased delivery process (discovery and scope approval; AI-assisted engineering with 25/50/75% reviews; QA, security and performance checks; deployment, source handoff, documentation, 14 days of launch support) presented without hours-as-price or dollar figures.

## Capabilities and Constraints

- Stack in place: Next.js 16 App Router on Vercel, Postgres via Drizzle, shadcn/ui, Tailwind 4. Inquiry API, rate limiting, CSRF guard and admin inbox are working and tested; keep their contracts and the form's fields.
- Current structure: the whole site renders from one client component (`app/page.tsx`) with route wrappers passing `initialRoute`. Breaking it into real pages is confirmed work.
- Preserve: existing URLs (`/services/*`, `/resources/*`, `/process`, `/work`, `/about`, `/contact`, `/privacy`, `/terms`; redirects are acceptable for renames); the inquiry form fields and admin inbox behavior; the existing service and guide copy as written, reorganized rather than rewritten, except sentences that state prices, which are removed.
- Work / use-case projects are illustrative concepts, not client engagements. Present them as examples of what can be built; never as case studies, never with results.
- Terminology: "inquiry" for a submitted form; "human approval" / "review gate" for the authorization step; "boundaries" for the stated limits of an offer.
- Page map additions (2026-09-27): `/industries` and `/industries/[slug]` (the ten industries from the home page), `/security` (how data and approvals are handled), `/automation-check` (a self-serve estimate of preparation hours an agent could take on, in hours only, never money, feeding the inquiry form), a "works with your tools" section, a comparison against doing it yourself / hiring / a large consultancy, and an engagement path (check, pilot, expand, ongoing care on request).
- New inquiries are also pushed to the owner's Twenty CRM (person, opportunity, note) when `TWENTY_API_URL` and `TWENTY_API_KEY` are set.

## Brand Commitments

- Name: Jinnx Automation. Logo: `public/images/jinnx-automation-logo.webp` (binding): a black angular "J/A" monogram with yellow triangular facets, wordmark "JINNX" in heavy black geometric caps, "AUTOMATION" letterspaced beneath. Its colors are black and a warm yellow; any visual world must sit with it.
- Voice, from the existing copy: plain, specific, boundary-honest. Each offer states what it does, who it fits, and what it will not do. No hype, no invented urgency.
- The site keeps its existing visual world as shipped: near-white paper ground with the 80px grid-paper texture, black ink (#161616), the logo's yellow (#f5ce00) as the accent, heavy tight display type. The 2026-09-22 rejection of a replacement redesign stands; no new palette or type system.
- Motion and visuals were approved on 2026-09-27 as an extension of that world: every page hero carries a live "grid circuit" canvas (work items travel the grid lines, stop at a yellow approval gate, then continue), and the home page has one scroll-driven focal sequence showing a single inquiry going through the approval flow (GSAP ScrollTrigger). Motion always has a reduced-motion path and never hides content by default.

## Evidence on Hand

- `public/images/jinnx-automation-logo.webp` (logo), `public/images/automation-sculpture.webp` (hero image from the incumbent site).
- Service, guide, process, industry and project copy in `lib/site-content.ts`, `app/page.tsx`, `components/work-examples.tsx`, `components/expanded-pages.tsx`.
- Contact details and office addresses on the contact page and footer.
- Absent, and not to be fabricated: testimonials, client names, case-study results, metrics, benchmarks, team bios, press, pricing.

## Product Principles

1. Lead with the visitor's business, not the technology: name the recurring job before the tool.
2. Show the approval gate: every automation is presented with where a person stays in control.
3. State boundaries as a feature: what an offer will not do is part of the offer.
4. One clear next step everywhere: the inquiry form, never a price quote.
5. Examples are examples: concept work is labeled as such and never dressed as proof.
