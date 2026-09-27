'use client';
import { useEffect, useRef } from 'react';
import { Check, ShieldCheck, Mail, PenLine, Hand, Send } from 'lucide-react';

// The home page's one authored moment: a single inquiry followed from arrival
// to the CRM, scrubbed by scroll. Every step is fully visible without
// JavaScript, on phones, and with reduced motion; GSAP only choreographs it.

const steps = [
  { icon: Mail, title: 'A message arrives', text: 'A new inquiry lands in the mailbox you already use. Nothing is sent yet.' },
  { icon: ShieldCheck, title: 'It is checked first', text: 'Complaint or legal language stops the flow. Unknown senders are flagged. Do-not-contact lists are honored.' },
  { icon: PenLine, title: 'One reply is drafted', text: 'Written from the thread and your approved company facts, in your voice.' },
  { icon: Hand, title: 'It waits for you', text: 'The draft sits in your approval inbox. Edit it, approve it, or reject it.' },
  { icon: Send, title: 'You approve. It goes.', text: 'Sent from your mailbox within a minute, and logged against the person in your CRM.' },
];

const checks = ['No complaint or legal language', 'Sender is a real prospect', 'Not on a do-not-contact list'];

export function AgentRun() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(el);
        const stepsEls = q('.jx-run-step');
        const gate = q('.jx-run-gate')[0];
        // Highlight whichever step the scrubbed playhead is in, in either scroll direction.
        const sync = () => {
          const t = tl.time();
          let i = 0;
          for (let k = 0; k < steps.length; k++) if (t >= tl.labels['s' + k]) i = k;
          stepsEls.forEach((s, j) => { s.classList.toggle('is-active', j === i); s.classList.toggle('is-done', j < i); });
          gate?.classList.toggle('is-approved', t >= tl.labels.approved);
        };
        const tl = gsap.timeline({
          defaults: { ease: 'expo.out', duration: .6 },
          scrollTrigger: { trigger: q('.jx-run-stage')[0], start: 'top 12%', end: '+=1900', pin: true, scrub: .6, onUpdate: () => sync(), onRefresh: () => sync() },
        });
        gsap.set(q('.jx-run-card'), { autoAlpha: 0, y: 26 });
        gsap.set(q('.jx-run-check'), { autoAlpha: 0, x: -10 });
        gsap.set(q('.jx-run-draft p'), { clipPath: 'inset(0 100% 0 0)' });
        gsap.set(q('.jx-run-stamp'), { autoAlpha: 0, scale: 1.4, rotate: -8 });
        gsap.set(q('.jx-run-sent'), { autoAlpha: 0, y: 10 });
        tl.addLabel('s0').to(q('.jx-run-msg'), { autoAlpha: 1, y: 0 })
          .addLabel('s1').to(q('.jx-run-checks'), { autoAlpha: 1, y: 0 }).to(q('.jx-run-check'), { autoAlpha: 1, x: 0, stagger: .18 })
          .addLabel('s2').to(q('.jx-run-draft'), { autoAlpha: 1, y: 0 }).to(q('.jx-run-draft p'), { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'none' })
          .addLabel('s3').to(q('.jx-run-gate'), { autoAlpha: 1, y: 0 }).to({}, { duration: .6 })
          .addLabel('s4').addLabel('approved').to(q('.jx-run-stamp'), { autoAlpha: 1, scale: 1, rotate: -4, ease: 'back.out(2)' })
          .to(q('.jx-run-sent'), { autoAlpha: 1, y: 0 }).to({}, { duration: .4 });
        sync();
        return () => { stepsEls.forEach(s => s.classList.remove('is-active', 'is-done')); gate?.classList.remove('is-approved'); };
      });
      ctx = mm;
    })();
    return () => { cancelled = true; ctx?.revert(); };
  }, []);

  return (
    <section ref={root} className="jx-run" aria-labelledby="jx-run-title">
      <div className="jx-wrap">
        <header className="jx-run-head">
          <h2 id="jx-run-title">Follow one inquiry through.<br /><span>Nothing leaves without you.</span></h2>
          <p>This is the whole loop for an AI reply agent: five steps, and the fourth one is yours.</p>
        </header>
        <div className="jx-run-stage">
          <ol className="jx-run-steps">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li className={'jx-run-step' + (i === 3 ? ' is-gate' : '')} key={title}>
                <span className="jx-run-icon"><Icon size={18} /></span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </li>
            ))}
          </ol>
          <div className="jx-run-board" aria-label="Example: an inquiry moving through the approval flow">
            <div className="jx-run-card jx-run-msg">
              <span className="jx-run-avatar">DR</span>
              <div><b>Dana Reyes · Reyes Landscaping</b><small>Hi, can you quote weekly maintenance for two commercial sites from May?</small></div>
            </div>
            <div className="jx-run-card jx-run-checks">
              {checks.map(c => <span className="jx-run-check" key={c}><Check size={13} />{c}</span>)}
            </div>
            <div className="jx-run-card jx-run-draft">
              <span className="jx-run-tag">Draft · written from your approved facts</span>
              <p>Hi Dana, thanks for getting in touch. Yes, we cover both sites from May. I’ve attached our maintenance terms; could we book a 15-minute walk-through next week?</p>
            </div>
            <div className="jx-run-card jx-run-gate">
              <span className="jx-run-hold">Hold</span>
              <span className="jx-run-wait">Waiting for your approval</span>
              <span className="jx-run-stamp">Approved by you</span>
            </div>
            <div className="jx-run-sent"><Check size={13} /> Sent from your mailbox · logged in your CRM</div>
            <span className="jx-run-note">Illustrative example</span>
          </div>
        </div>
      </div>
    </section>
  );
}
