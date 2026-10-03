'use client';
import { ArrowUpRight, Check, Quote, X } from 'lucide-react';
import { owner, agents, testimonials } from '@/lib/team';
import { services } from '@/lib/site-content';

// Each AI employee gets a badge drawn from the logo's language: yellow
// triangular facets on black, arranged uniquely from its name.
export function Facets({ name, size = 56 }: { name: string; size?: number }) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const cells: string[] = [];
  const u = 16;
  for (let i = 0; i < 9; i++) {
    const kind = (h >>> (i * 3)) % 6;
    const x = 4 + (i % 3) * u, y = 4 + Math.floor(i / 3) * u;
    const shapes = [
      `M${x} ${y}L${x + u} ${y}L${x} ${y + u}Z`, `M${x + u} ${y}L${x + u} ${y + u}L${x} ${y + u}Z`,
      `M${x} ${y}L${x + u} ${y + u}L${x} ${y + u}Z`, `M${x} ${y}L${x + u} ${y}L${x + u} ${y + u}Z`,
    ];
    if (kind < 4) cells.push(shapes[kind]);
  }
  if (cells.length < 4) cells.push(`M4 4L20 4L4 20Z`, `M52 52L36 52L52 36Z`);
  return <svg className="jx-facets" width={size} height={size} viewBox="0 0 56 56" aria-hidden="true">
    <rect width="56" height="56" rx="12" fill="#161616" />
    {cells.map((d, i) => <path key={i} d={d} fill={i % 3 === 2 ? '#fff3a6' : '#f5ce00'} />)}
  </svg>;
}

const serviceName = (slug: string) => services.find(s => s.slug === slug)?.name ?? slug;

export function TeamSection() {
  return <section className="jx-team" aria-labelledby="jx-team-title"><div className="jx-wrap">
    <div className="jx-split-head reveal">
      <h2 id="jx-team-title">One person signs off.<br /><span>Seven agents do the prep.</span></h2>
      <p>Jinnx Automation is a small, deliberate team: a founder who scopes and approves every build, and a staff of AI employees who each do one job, work on your accounts, and report back for approval. These are the same agents we build for clients.</p>
    </div>

    <div className="jx-org">
      <article className="jx-owner reveal">
        <div className="jx-owner-id">
          {owner.photo
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={owner.photo} alt={owner.name || 'Founder'} width={72} height={72} />
            : <span className="jx-owner-mark" aria-hidden="true">J</span>}
          <div>
            <span className="jx-badge-human">Human</span>
            <h3>{owner.name || 'The founder'}</h3>
            <p className="jx-owner-title">{owner.title}</p>
          </div>
        </div>
        <p className="jx-owner-bio">{owner.bio}</p>
        <ul>{owner.duties.map(d => <li key={d}><Check size={15} />{d}</li>)}</ul>
      </article>

      <div className="jx-gate-rail reveal" aria-hidden="true"><span>Approval gate · everything below reports up</span></div>

      <ul className="jx-agents">
        {agents.map((a, i) => <li className="jx-agent reveal" style={{ '--i': i % 4 } as React.CSSProperties} key={a.name}>
          <div className="jx-agent-top">
            <Facets name={a.name} />
            <div>
              <h3>{a.name}</h3>
              <p className="jx-agent-role">{a.role}</p>
            </div>
            <span className="jx-agent-status"><i />{a.shift}</span>
          </div>
          <p className="jx-agent-does">{a.does}</p>
          <p className="jx-agent-never"><X size={14} /><span><b>Never:</b> {a.never}</span></p>
          <a className="jx-agent-link" href={'/services/' + a.service}>{serviceName(a.service)} <ArrowUpRight size={15} /></a>
        </li>)}
        <li className="jx-agent jx-agent-you reveal">
          <h3>Your agent</h3>
          <p>The next hire is built around your job: one task, your accounts, your approval.</p>
          <a className="jx-agent-link" href="/automation-check">Find your first agent <ArrowUpRight size={15} /></a>
        </li>
      </ul>
    </div>
  </div></section>;
}

// Examples show everywhere except production, where only real quotes appear.
const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

export function Testimonials() {
  const shown = testimonials.filter(t => !t.example || !isProduction);
  if (!shown.length) return null;
  const examples = shown.some(t => t.example);
  return <section className="jx-quotes" aria-labelledby="jx-quotes-title"><div className="jx-wrap">
    <div className="jx-split-head reveal">
      <h2 id="jx-quotes-title">In their words.</h2>
      <p>{examples ? 'Example testimonials, shown on previews only while real client quotes are collected.' : 'What owners say after the first agent has been running for a while.'}</p>
    </div>
    <div className="jx-quote-grid">
      {shown.map((t, i) => <figure className="jx-quote reveal" style={{ '--i': i } as React.CSSProperties} key={i}>
        {t.example ? <span className="jx-quote-example">Example</span> : null}
        <Quote size={26} aria-hidden="true" />
        <blockquote>{t.quote}</blockquote>
        <figcaption><b>{t.name}</b><span>{t.role}, {t.company}</span><em>{t.industry}</em></figcaption>
      </figure>)}
    </div>
  </div></section>;
}
