'use client';
import { ArrowRight, ArrowUpRight, Search, MessageSquare, Repeat, Database, Receipt, Activity, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { Facets } from '@/components/team';

// Home sections added for the 2026-10 content brief: lead with what the visitor
// gets (outcomes), then who does the work (the digital workforce), then how it
// applies (sales as a system, services by need). They render inside
// .reference-site, so they use the jx- styles in app/motion.css and its .reveal.

const outcomes = [
  { icon: Search, title: 'Find more opportunities', text: 'Research and qualify relevant prospects.', agent: 'Scout' },
  { icon: MessageSquare, title: 'Respond faster', text: 'Draft accurate replies to customer inquiries.', agent: 'Quill' },
  { icon: Repeat, title: 'Follow up consistently', text: 'Keep conversations moving.', agent: 'Cadence' },
  { icon: Database, title: 'Keep your CRM updated', text: 'Log leads, conversations and activities.', agent: 'Relay' },
  { icon: Receipt, title: 'Chase fewer payments', text: 'Prepare invoice reminders on schedule.', agent: 'Ledger' },
  { icon: Activity, title: 'See what is happening', text: 'Track activity and workflow performance.', agent: 'Beacon' },
];

export function Outcomes() {
  return <section className="jx-story jx-outcomes" aria-labelledby="jx-outcomes-title"><div className="jx-wrap">
    <div className="jx-split-head reveal">
      <h2 id="jx-outcomes-title">What could your business<br /><span>stop doing manually?</span></h2>
      <p>Six kinds of recurring work an AI agent can take off your plate. Each one prepares the work; you approve what matters.</p>
    </div>
    <ul className="jx-outcome-grid">
      {outcomes.map(({ icon: Icon, title, text, agent }, i) => <li key={title} className="jx-outcome reveal" style={{ '--i': i } as React.CSSProperties}>
        <span className="jx-outcome-icon"><Icon size={22} strokeWidth={2} /></span>
        <h3>{title}</h3>
        <p>{text}</p>
        <span className="jx-outcome-agent"><Facets name={agent} size={22} />Handled by {agent}</span>
      </li>)}
    </ul>
  </div></section>;
}

const flow = [
  { step: 'Research', text: 'Finds the lead, the thread, the overdue invoice.', who: 'agent' },
  { step: 'Prepare', text: 'Drafts the reply, the record, the reminder.', who: 'agent' },
  { step: 'Review', text: 'You see exactly what it wants to do.', who: 'you' },
  { step: 'Approve', text: 'Approve, edit or reject. Nothing moves before this.', who: 'you' },
  { step: 'Execute', text: 'Sent from your accounts, filed in your CRM.', who: 'agent' },
  { step: 'Log', text: 'Every action recorded, with a pause switch.', who: 'agent' },
];

export function DigitalWorkforce() {
  return <section className="jx-story jx-workforce" aria-labelledby="jx-workforce-title"><div className="jx-wrap">
    <div className="jx-split-head reveal">
      <h2 id="jx-workforce-title">Meet your<br /><span>digital workforce.</span></h2>
      <p>Jinnx builds AI agents and automated workflows that take repetitive operational work off your plate. They can research, prepare, organize, draft and follow up, while you remain in control.</p>
    </div>
    <ol className="jx-flow reveal" aria-label="How an agent handles a job">
      {flow.map((f, i) => <li key={f.step} className={'jx-flow-step is-' + f.who} style={{ '--i': i } as React.CSSProperties}>
        <span className="jx-flow-num">{String(i + 1).padStart(2, '0')}</span>
        <strong>{f.step}</strong>
        <span className="jx-flow-text">{f.text}</span>
        <span className="jx-flow-who">{f.who === 'you' ? <><UserCheck size={13} /> You</> : 'Agent'}</span>
      </li>)}
    </ol>
    <div className="jx-workforce-foot reveal">
      <div className="jx-workforce-roster" aria-label="The agents">{['Scout', 'Quill', 'Relay', 'Cadence', 'Echo', 'Ledger', 'Beacon'].map(n => <span key={n} title={n}><Facets name={n} size={34} /></span>)}</div>
      <Link className="jx-link" href="/about">Meet the seven agents and the person who signs off <ArrowRight size={16} /></Link>
    </div>
  </div></section>;
}

const pipeline = [
  { step: 'Find relevant prospects', text: 'Businesses that match your best customers.' },
  { step: 'Enrich', text: 'Contact details, size and context, checked.' },
  { step: 'Qualify', text: 'Scored against what makes a good fit for you.' },
  { step: 'Prepare outreach', text: 'A first message drafted for each one.' },
  { step: 'Follow up', text: 'Sent from your mailbox, stopped on reply.' },
  { step: 'Human handoff', text: 'A warm conversation lands with you.', you: true },
];

export function SalesSystem() {
  return <section className="jx-story jx-sales" aria-labelledby="jx-sales-title"><div className="jx-wrap">
    <div className="jx-split-head reveal">
      <h2 id="jx-sales-title">Turn your sales process<br /><span>into a system.</span></h2>
      <p>Lead generation is one of the jobs agents do best. It runs as a pipeline you can see, and a person takes over the moment a conversation is ready.</p>
    </div>
    <ol className="jx-pipeline reveal" aria-label="The sales pipeline">
      {pipeline.map((p, i) => <li key={p.step} className={p.you ? 'is-you' : ''} style={{ '--i': i } as React.CSSProperties}>
        <span className="jx-pipe-num">{i + 1}</span>
        <strong>{p.step}</strong>
        <span>{p.text}</span>
      </li>)}
    </ol>
    <p className="jx-fine">Lead generation is one application. The same system approach runs replies, CRM updates, invoicing and reporting. <Link href="/services/lead-discovery">How lead discovery works</Link></p>
  </div></section>;
}

const needs = [
  { need: 'Get more leads', outcome: 'Lead discovery, enrichment, qualification and outreach', href: '/services/lead-discovery' },
  { need: 'Respond to customers', outcome: 'AI reply agents and inquiry handling', href: '/services/ai-reply-agent' },
  { need: 'Keep sales moving', outcome: 'CRM pipelines, reminders and appointment workflows', href: '/services/crm-pipeline-automation' },
  { need: 'Reduce admin work', outcome: 'Data entry, reporting and repetitive operations', href: '/services/workflow-automation' },
  { need: 'Get paid faster', outcome: 'Invoice reminders and payment workflows', href: '/services/invoicing-automation' },
  { need: 'Build something custom', outcome: 'Software, portals, apps and custom systems', href: '/services/custom-software' },
];

export function ServicesByNeed() {
  return <section className="jx-story jx-needs" aria-labelledby="jx-needs-title"><div className="jx-wrap">
    <div className="jx-split-head reveal">
      <h2 id="jx-needs-title">Start with the problem.<br /><span>We build the system.</span></h2>
      <p>Pick the thing your business needs most. Each one is a service we scope, build and hand over, with your approval built in.</p>
    </div>
    <div className="jx-needs-table reveal">
      <div className="jx-needs-row jx-needs-head" aria-hidden="true"><span>What you need</span><span>What Jinnx builds</span><span /></div>
      <ul>{needs.map(n => <li key={n.need}><Link className="jx-needs-row" href={n.href}>
        <strong>{n.need}</strong>
        <span>{n.outcome}</span>
        <span className="jx-needs-go" aria-hidden="true"><ArrowUpRight size={18} /></span>
      </Link></li>)}</ul>
    </div>
  </div></section>;
}
