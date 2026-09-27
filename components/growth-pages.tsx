'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Check, ShieldCheck, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { services } from '@/lib/site-content';
import { industries, toolGroups, comparison, engagement, securityPoints, securityFaq, checkTasks } from '@/lib/growth-content';
import { GridCircuit } from '@/components/motion/grid-circuit';
import { CTA, Label } from '@/components/expanded-pages';

const serviceName = (slug: string) => services.find(s => s.slug === slug)?.name ?? slug;

export function ToolsWall() {
  return <section className="jx-tools" aria-labelledby="jx-tools-title"><div className="jx-wrap">
    <div className="jx-split-head reveal">
      <h2 id="jx-tools-title">Works with the tools<br /><span>you already pay for.</span></h2>
      <p>Agents run inside your accounts through each tool’s supported API, so nothing moves to a new system and your team keeps working where it works today. Don’t see yours? If it has an API, we can usually connect it.</p>
    </div>
    <div className="jx-tools-grid">
      {toolGroups.map((g, i) => <div className="jx-tools-group reveal" style={{ '--i': i } as React.CSSProperties} key={g.group}>
        <h3>{g.group}</h3>
        <ul>{g.tools.map(t => <li key={t}>{t}</li>)}</ul>
      </div>)}
    </div>
    <p className="jx-fine">Product names are trademarks of their owners and are listed to show compatibility, not partnership.</p>
  </div></section>;
}

export function CompareTable() {
  const cols = [['jinnx', 'Jinnx Automation'], ['diy', 'Do it yourself (Zapier, Make)'], ['hire', 'Hire an assistant'], ['consultancy', 'Large consultancy']] as const;
  return <section className="jx-compare" aria-labelledby="jx-compare-title"><div className="jx-wrap">
    <div className="jx-split-head reveal">
      <h2 id="jx-compare-title">Four ways to get<br /><span>the busywork done.</span></h2>
      <p>Each one is right for someone. Here is an honest comparison for an owner-run business deciding what to do with the recurring work.</p>
    </div>
    <div className="jx-compare-scroll reveal" role="region" aria-label="Comparison table" tabIndex={0}>
      <table>
        <thead><tr><th scope="col"><span className="sr-only">Question</span></th>{cols.map(([k, l]) => <th scope="col" key={k} className={k === 'jinnx' ? 'is-us' : ''}>{l}</th>)}</tr></thead>
        <tbody>{comparison.map(row => <tr key={row.label}><th scope="row">{row.label}</th>{cols.map(([k]) => <td key={k} className={k === 'jinnx' ? 'is-us' : ''}>{row[k]}</td>)}</tr>)}</tbody>
      </table>
    </div>
  </div></section>;
}

export function EngagementPath({ onContact }: { onContact: () => void }) {
  return <section className="jx-path" aria-labelledby="jx-path-title"><div className="jx-wrap">
    <div className="jx-split-head reveal">
      <h2 id="jx-path-title">Start with one job.<br /><span>Add the next when it earns it.</span></h2>
      <p>No platform to adopt and no long contract up front. Each stage has to prove itself before the next one starts.</p>
    </div>
    <ol className="jx-path-list">
      {engagement.map((e, i) => <li className="reveal" style={{ '--i': i } as React.CSSProperties} key={e.name}>
        <span className="jx-path-when">{e.when}</span>
        <h3>{e.name}{e.free ? <em>Free</em> : null}</h3>
        <p>{e.text}</p>
      </li>)}
    </ol>
    <div className="jx-path-cta reveal"><Button className="button orange-btn" onClick={onContact}>Book the automation check <ArrowUpRight size={18} /></Button><a className="text-link" href="/automation-check">Or estimate it yourself first <ArrowRight size={17} /></a></div>
  </div></section>;
}

export function CheckTeaser() {
  return <section className="jx-teaser" aria-labelledby="jx-teaser-title"><div className="jx-wrap jx-teaser-inner reveal">
    <div>
      <h2 id="jx-teaser-title">How much of your week<br /><span>could an agent prepare?</span></h2>
      <p>Seven questions about the recurring work you do now. You get an estimate in hours, the agents that fit, and a plan you can send us. No email needed to see it.</p>
    </div>
    <a className="button orange-btn" href="/automation-check">Take the two-minute check <ArrowUpRight size={18} /></a>
  </div></section>;
}

function AutomationCheck({ onSend }: { onSend: (idea: string) => void }) {
  const [hours, setHours] = useState<Record<string, number>>({});
  const set = (k: string, v: number) => setHours(h => ({ ...h, [k]: Math.max(0, Math.min(20, v)) }));
  const result = useMemo(() => {
    const rows = checkTasks.map(t => ({ ...t, hours: hours[t.key] || 0, prep: (hours[t.key] || 0) * t.share }));
    const total = rows.reduce((n, r) => n + r.hours, 0);
    const prep = rows.reduce((n, r) => n + r.prep, 0);
    const top = rows.filter(r => r.prep > 0).sort((a, b) => b.prep - a.prep).slice(0, 3);
    return { rows, total, prep, keep: total - prep, top };
  }, [hours]);
  const round = (n: number) => Math.round(n * 2) / 2;
  const summary = () => ['Automation check results (illustrative estimate):', ...result.rows.filter(r => r.hours).map(r => `- ${r.label}: ${r.hours} h/week`), `Total recurring work: ${round(result.total)} h/week; preparation an agent could take on: about ${round(result.prep)} h/week.`, result.top.length ? `Start with: ${result.top.map(r => serviceName(r.service)).join(', ')}.` : ''].filter(Boolean).join('\n');
  return <>
    <section className="page-hero grid-paper jx-hero"><GridCircuit variant="check" /><div className="wrap">
      <Label>FREE AUTOMATION CHECK</Label>
      <h1>How much of your week<br /><span className="orange">could an agent prepare?</span></h1>
      <p>Put in roughly how many hours a week each job takes you. The estimate updates as you go, stays in your browser, and shows which agents fit. Approval time stays with you, so it is counted separately.</p>
    </div></section>
    <section className="section wrap jx-check">
      <div className="jx-check-list">
        {checkTasks.map(t => <div className="jx-check-row" key={t.key}>
          <div><label htmlFor={'h-' + t.key}>{t.label}</label><small>{t.hint}</small></div>
          <div className="jx-stepper">
            <button type="button" aria-label={'Fewer hours for ' + t.label} onClick={() => set(t.key, (hours[t.key] || 0) - 1)}><Minus size={16} /></button>
            <input id={'h-' + t.key} type="number" inputMode="numeric" min={0} max={20} value={hours[t.key] || 0} onChange={e => set(t.key, Number(e.target.value) || 0)} />
            <span>h/week</span>
            <button type="button" aria-label={'More hours for ' + t.label} onClick={() => set(t.key, (hours[t.key] || 0) + 1)}><Plus size={16} /></button>
          </div>
        </div>)}
      </div>
      <aside className="jx-check-result" aria-live="polite">
        <span className="jx-check-k">Preparation an agent could take on</span>
        <strong className="jx-check-big">{round(result.prep)}<small> h/week</small></strong>
        <div className="jx-check-bar" aria-hidden="true"><span style={{ transform: 'scaleX(' + (result.total ? result.prep / result.total : 0) + ')' }} /></div>
        <div className="jx-check-split"><span><b>{round(result.total)} h</b> recurring work now</span><span><b>{round(result.keep)} h</b> judgement and approval, still yours</span></div>
        {result.top.length ? <>
          <span className="jx-check-k">Where to start</span>
          <ul>{result.top.map(r => <li key={r.key}><a href={'/services/' + r.service}>{serviceName(r.service)} <ArrowUpRight size={15} /></a><small>about {round(r.prep)} h/week of preparation</small></li>)}</ul>
          <Button className="button orange-btn" onClick={() => onSend(summary())}>Send this to Jinnx <ArrowUpRight size={18} /></Button>
        </> : <p className="jx-check-empty">Add hours to any job to see an estimate.</p>}
        <p className="jx-fine">An illustrative estimate from your own numbers and typical preparation shares, not a promise. Your written plan replaces it with specifics.</p>
      </aside>
    </section>
  </>;
}

function IndustriesIndex({ onContact }: { onContact: () => void }) {
  return <main>
    <section className="page-hero grid-paper jx-hero"><GridCircuit variant="industries" /><div className="wrap">
      <Label>INDUSTRIES</Label>
      <h1>Ten industries.<br /><span className="orange">One approval gate.</span></h1>
      <p>The recurring jobs change from one industry to the next. The shape does not: agents prepare the work, and a person approves the step that matters. Pick yours to see the jobs, the agents, and the limits.</p>
    </div></section>
    <section className="section wrap jx-ind-grid">
      {industries.map((ind, i) => <a className="jx-ind-card reveal" style={{ '--i': i % 3 } as React.CSSProperties} href={'/industries/' + ind.slug} key={ind.slug}>
        <span className="jx-ind-for">{ind.short}</span>
        <h2>{ind.name}</h2>
        <p>{ind.headline}</p>
        <span className="service-link">See the workflows <ArrowUpRight size={18} /></span>
      </a>)}
    </section>
    <ToolsWall />
    <CTA onContact={onContact} />
  </main>;
}

function IndustryPage({ slug, onContact }: { slug: string; onContact: () => void }) {
  const ind = industries.find(i => i.slug === slug);
  if (!ind) return null;
  const others = industries.filter(i => i.slug !== slug).slice(0, 3);
  return <main>
    <section className="page-hero grid-paper jx-hero"><GridCircuit variant="industry" /><div className="wrap">
      <Link className="back-link" href="/industries">← All industries</Link>
      <Label>AI AUTOMATION FOR {ind.name.toUpperCase()}</Label>
      <h1>{ind.headline}</h1>
      <p>{ind.intro}</p>
      <div className="actions"><Button className="button orange-btn" onClick={onContact}>Talk about your workflow <ArrowUpRight size={18} /></Button></div>
    </div></section>
    <section className="section wrap jx-ind-detail">
      <div className="reveal"><h2>The recurring jobs<br /><span className="muted">agents can prepare.</span></h2>
        <ul className="jx-ticks">{ind.jobs.map(j => <li key={j}><Check size={17} />{j}</li>)}</ul></div>
      <div className="jx-ind-agents">
        {ind.agents.map((a, i) => <a className="jx-ind-agent reveal" style={{ '--i': i } as React.CSSProperties} href={'/services/' + a.service} key={a.service}>
          <h3>{serviceName(a.service)}</h3><p>{a.job}</p><ArrowUpRight size={18} />
        </a>)}
      </div>
    </section>
    <section className="jx-gatebar"><div className="jx-wrap jx-gatebar-inner reveal">
      <h2>Where you stay<br />in control.</h2>
      <ul>{ind.approval.map(a => <li key={a}><ShieldCheck size={18} />{a}</li>)}</ul>
    </div></section>
    <section className="section wrap jx-ind-more">
      <div className="reveal"><h3>Tools we often connect</h3><div className="tech-tags">{ind.tools.map(t => <span key={t}>{t}</span>)}</div></div>
      <div className="reveal"><h3>Boundaries</h3><p>{ind.boundaries}</p></div>
      <div className="reveal"><h3>Other industries</h3>{others.map(o => <a className="text-link" href={'/industries/' + o.slug} key={o.slug}>{o.name} <ArrowRight size={16} /></a>)}</div>
    </section>
    <CTA onContact={onContact} />
  </main>;
}

function SecurityPage({ onContact }: { onContact: () => void }) {
  return <main>
    <section className="page-hero grid-paper jx-hero"><GridCircuit variant="security" /><div className="wrap">
      <Label>SECURITY & DATA</Label>
      <h1>Nothing leaves<br /><span className="orange">without a person.</span></h1>
      <p>How we handle access, data, AI providers and mistakes, in plain language. If something here does not answer your question, ask before you share anything.</p>
    </div></section>
    <section className="section wrap"><div className="jx-sec-grid">
      {securityPoints.map((p, i) => <article className="reveal" style={{ '--i': i % 3 } as React.CSSProperties} key={p.title}><h2>{p.title}</h2><p>{p.text}</p></article>)}
    </div></section>
    <section className="section wrap jx-sec-faq">
      <h2 className="reveal">Straight answers.</h2>
      <dl>{securityFaq.map(([q, a]) => <div className="reveal" key={q}><dt>{q}</dt><dd>{a}</dd></div>)}</dl>
      <p className="jx-fine">Read the full <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms of Service</a>. An NDA is available before you share anything confidential.</p>
    </section>
    <CTA onContact={onContact} />
  </main>;
}

export const growthRoutes = ['industries', 'security', 'automation-check'];
export const isGrowthRoute = (route: string) => growthRoutes.includes(route) || route.startsWith('industries/');

export function GrowthPage({ route, onContact, onSend }: { route: string; onContact: () => void; onSend: (idea: string) => void }) {
  if (route === 'industries') return <IndustriesIndex onContact={onContact} />;
  if (route.startsWith('industries/')) return <IndustryPage slug={route.split('/')[1]} onContact={onContact} />;
  if (route === 'security') return <SecurityPage onContact={onContact} />;
  if (route === 'automation-check') return <main><AutomationCheck onSend={onSend} /><EngagementPath onContact={onContact} /></main>;
  return null;
}
