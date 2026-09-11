import React, { useEffect, useMemo, useState } from 'react'

const phases = [
  { n:'01', hours:'0–12', title:'Discovery deep-dive', body:'Your vision. Your users. One clear priority. We turn your idea into a focused, buildable product scope.', role:'Share your vision and approve the feature priorities. We agree on exactly what ships.', outputs:['Product roadmap','Feature specification','Locked scope'] },
  { n:'02', hours:'12–84', title:'AI-powered development', body:'AI accelerates the groundwork. Engineers shape the experience, business logic, and integrations that make it yours.', role:'Review progress at 25%, 50%, and 75%. Give feedback while it can still make a difference.', outputs:['Frontend + backend','Core integrations','Staging preview'] },
  { n:'03', hours:'84–92', title:'Testing & polish', body:'We test the important journeys, refine mobile layouts, and smooth out the details before your first users arrive.', role:'Walk through the staging build. Review the agreed acceptance criteria with us.', outputs:['Functional checks','Performance review','Final refinements'] },
  { n:'04', hours:'92–100', title:'Launch handoff', body:'From staging to the real world. Your live product, your source code, and the documentation to keep moving.', role:'Approve the launch and get a guided walkthrough of your code and deployment.', outputs:['Live product','Source repository','Handoff documentation'] },
]

const industries = [
  ['Healthcare & MedTech','Patient portals, appointment workflows, and clinical operations tools.','React · Scheduling · Portals'],
  ['Sales & revenue automation','Lead research, CRM workflows, follow-ups, and voice-enabled sales experiences.','AI agents · CRM · Twilio'],
  ['Developer tools & AI','Internal copilots, developer workflows, and tools that remove repetitive work.','APIs · Node.js · AI'],
  ['Marketing & agency SaaS','Content planning, campaign management, and reporting in one place.','Analytics · CMS · Automation'],
  ['Events & logistics','Vendor coordination, booking systems, and real-time operations.','Scheduling · PostgreSQL'],
  ['E-commerce & retail','Product discovery, customer support, and order automation.','Commerce · AI chat · Payments'],
  ['B2B SaaS & platforms','Focused software products with accounts, dashboards, and subscriptions.','Auth · Billing · Full stack'],
  ['Real estate technology','Property inquiries, lead qualification, and connected agent workflows.','Voice AI · CRM sync'],
  ['Legal technology','Document workflows, case organization, and assisted information extraction.','Documents · Search · LLMs'],
  ['Fintech & reporting','Payment experiences, financial dashboards, and reporting workflows.','Payments · Dashboards'],
]

const addons = [
  {group:'TECH TIER', label:'Advanced AI features', desc:'LLM integrations, embeddings, RAG, and agents.', price:1000},
  {group:'TECH TIER', label:'Mobile apps', desc:'iOS and Android with a shared React Native codebase.', price:1500},
  {group:'DATA TIER', label:'Custom dashboard', desc:'A branded admin experience with role-based access.', price:500},
  {group:'DATA TIER', label:'API integration', desc:'Connect an external service to your product.', price:300},
  {group:'LAUNCH TIER', label:'Launch roadmap', desc:'A 30/60/90-day plan with clear product priorities.', price:250},
  {group:'LAUNCH TIER', label:'Product Hunt prep', desc:'Launch copy, creative assets, and a launch-day checklist.', price:400},
]

const faqs = [
  ['Is this custom or template-based?','We combine reusable foundations with custom design and business logic. Accounts and common infrastructure should not consume your entire budget. The product experience is built around your users and your scope.'],
  ['What if my idea needs more than 100 hours?','We define the most valuable first release and protect the sprint from scope creep. Larger products can be split into focused follow-on sprints with a clear roadmap.'],
  ['Can you automate my existing business systems?','Yes. We can connect your current CRM, email, data sources, internal tools, and approved third-party APIs when they fit the agreed scope.'],
  ['What’s the actual cost?','The base 100-hour MVP is shown at $10,999. Optional capabilities can be added in the pricing builder. Final scope, schedule, and terms are confirmed in a proposal before work begins.'],
  ['What happens after launch?','Every sprint includes a handoff, documentation, source code ownership, deployment, and a proposed 14-day launch support period. Ongoing work can be scoped separately.'],
  ['Do you sign NDAs?','Yes, when appropriate. We can review reasonable confidentiality requirements before discovery starts.'],
  ['How do payments work?','Payment terms are set in your proposal after the scope is agreed. The pricing builder is illustrative and does not collect payment.'],
]

function money(n){ return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n) }

function Arrow(){ return <span aria-hidden="true">↗</span> }

function Header(){
  const [open,setOpen] = useState(false)
  return <header className="site-header">
    <a className="brand" href="#top"><span className="brand-mark">JA</span><span>Jinnx Automation<small>IDEA. BUILD. AUTOMATE.</small></span></a>
    <button className="menu" onClick={()=>setOpen(!open)} aria-label="Toggle menu">{open?'×':'☰'}</button>
    <nav className={open?'open':''} onClick={()=>setOpen(false)}>
      <a href="#solution">Solution</a><a href="#process">How it works</a><a href="#portfolio">Portfolio</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a>
      <a className="nav-cta" href="#contact">Start your project <Arrow/></a>
    </nav>
  </header>
}

function Hero(){ return <section className="hero section" id="top">
  <div className="hero-copy reveal">
    <div className="eyebrow">JINNXAUTOMATION · AI-ACCELERATED DELIVERY</div>
    <h1>Your idea. <span>Months of waiting.</span><br/>We ship it in <em>100 hours.</em></h1>
    <p className="lede">A real, working product. Thoughtfully designed, engineered to perform, and ready for your first users. From your big idea to your next big move.</p>
    <div className="actions"><a href="#contact" className="btn dark">Start my 100-hour sprint <Arrow/></a><a href="#process" className="btn ghost">See the playbook ↓</a></div>
    <div className="micro-row"><span>Your code.</span><span>Your ownership.</span><span>Clear scope.</span><span>Clear timeline.</span></div>
  </div>
  <div className="hero-visual reveal delay-1" aria-label="100-hour sprint preview">
    <div className="visual-label">FROM ZERO → SOMETHING REAL</div>
    <div className="visual-title">YOUR NEXT PRODUCT SPRINT <b>PREVIEW</b></div>
    <div className="terminal-card">
      <div className="terminal-top"><span>An idea today.</span><span>100 hours · one focused sprint</span></div>
      <div className="progress-list">
        {phases.map((p,i)=><div className="progress-item" key={p.n}><span className="dot"></span><div><small>{p.hours}h</small><strong>{p.title}</strong></div><span>{i===0?'Discover':i===1?'Build':i===2?'Polish':'Launch'}</span></div>)}
      </div>
      <div className="code-window"><div className="code-head"><i></i><i></i><i></i><span>jinnx ~/your-next-big-thing</span></div><code>✓ vision.aligned<br/>✓ possibilities.unlocked<br/><b>› Building something that matters</b></code></div>
      <div className="visual-foot"><span>Human expertise.</span><span>AI velocity.</span><b>✳ Less waiting. More creating.</b></div>
    </div>
  </div>
</section> }

function Stats(){ return <section className="stats-strip">
  <div><strong>100</strong><span>HOURS / FOCUSED SPRINT</span></div><div><strong>4</strong><span>CLEAR DELIVERY PHASES</span></div><div><strong>100%</strong><span>SOURCE CODE OWNERSHIP</span></div><div><strong>14</strong><span>DAYS PROPOSED LAUNCH SUPPORT</span></div>
</section> }

function Problems(){ return <section className="section dark-zone" id="solution">
  <div className="section-head reveal"><div className="eyebrow light">THE MVP GRAVEYARD IS REAL</div><h2>Great ideas shouldn’t die in the waiting room.</h2><p>The old way asks you to spend more, wait longer, and hope for the best. Let’s change that.</p></div>
  <div className="problem-grid">
    {[['01 / THE COST','Budget burn','Paying for process instead of progress. Big overheads leave less room for the thing that matters: building a useful product.'],['02 / THE DELAY','Months lost','Your market won’t wait for a kickoff. Long handoffs and endless design rounds turn momentum into missed opportunities.'],['03 / THE SCOPE','Never “done”','One more feature. One more delay. Without a focused first release, the finish line keeps moving further away.']].map(x=><article className="problem-card reveal" key={x[0]}><small>{x[0]}</small><h3>{x[1]}</h3><p>{x[2]}</p></article>)}
  </div>
  <div className="compare reveal">
    <div><small>THE TRADITIONAL WAY</small><h3>The drawn-out build.</h3>{['Requirements that keep changing','Design rounds without decisions','Development behind closed doors','A launch date that keeps slipping'].map((x,i)=><p key={x}><b>0{i+1}</b>{x}</p>)}<em>More uncertainty. Less momentum.</em></div>
    <div className="vs">VS</div>
    <div className="accent-panel"><small>THE JINNXAUTOMATION WAY</small><h3>The focused sprint.</h3>{phases.map(p=><p key={p.n}><b>{p.n}</b>{p.title}<span>{p.hours}h</span></p>)}<em>A working product. A clear next step.</em></div>
  </div>
  <div className="benefit-row reveal"><div><b>Scope you can see</b><span>Agree on the essentials before the build.</span></div><div><b>AI speed. Human judgment.</b><span>Faster foundations, considered decisions.</span></div><div><b>Built for real users</b><span>A product you can launch, learn from, and improve.</span></div></div>
</section> }

function Process(){ return <section className="section" id="process">
  <div className="section-head reveal"><div className="eyebrow">THE 100-HOUR JOURNEY</div><h2>You’re in the cockpit.<br/>We do the flying.</h2><p>4 phases · 100 hours · one clear goal</p></div>
  <div className="timeline">{phases.map(p=><article className="phase reveal" key={p.n}><div className="phase-index">{p.n}</div><div className="phase-hours">HOURS<br/><b>{p.hours}</b></div><div className="phase-main"><h3>{p.title}</h3><p>{p.body}</p><small>YOUR ROLE</small><p>{p.role}</p></div><div className="phase-output">{p.outputs.map(o=><span key={o}>{o}</span>)}</div></article>)}</div>
  <div className="tag-row reveal"><span>Visible progress</span><span>Clear approval gates</span><span>Source code handoff</span><span>No silent dev cycles</span></div>
</section> }

function Speed(){ return <section className="section speed">
  <div className="section-head reveal"><div className="eyebrow">THE SPEED SECRET</div><h2>Move faster. Keep the craft.</h2><p>Good tools remove busywork. Good engineers know what still deserves human attention.</p></div>
  <div className="speed-table reveal">
    <div className="table-row head"><b>WHAT MATTERS</b><b>THE SLOW WAY</b><b>THE JINNX APPROACH</b></div>
    {[
      ['Build approach','Every foundation built from zero','Reusable foundations, custom experience'],['Code authoring','Repetitive implementation','AI-assisted code, engineer-reviewed'],['Design process','Round after round of guesswork','A focused direction, real feedback'],['Quality assurance','Testing left to the very end','Check important flows as we build'],['Deployment','Fragile manual handoffs','Repeatable deployment and clear docs'],['Ownership','Dependent on your agency','Your source code. Your next move.']
    ].map(r=><div className="table-row" key={r[0]}><b>{r[0]}</b><span>{r[1]}</span><span>{r[2]}</span></div>)}
  </div>
  <div className="included reveal"><small>BUILT INTO EVERY SPRINT</small>{['Working product','Source code','Live deployment','Documentation','Launch support'].map(x=><span key={x}>{x}</span>)}</div>
</section> }

function Portfolio(){ return <section className="section dark-zone portfolio" id="portfolio">
  <div className="section-head reveal"><div className="eyebrow light">BUILT AROUND YOUR WORLD</div><h2>Different industries.<br/>One builder’s mindset.</h2><p>From sales automation to the next SaaS idea. Explore what a focused first release could look like.</p></div>
  <div className="industry-grid">{industries.map((x,i)=><article className="industry-card reveal" key={x[0]}><div className="industry-no">{String(i+1).padStart(2,'0')} / 10</div><h3>{x[0]}</h3><p>{x[1]}</p><small>{x[2]}</small><span className="corner">↗</span></article>)}</div>
  <div className="industry-end reveal">Your industry not here? <a href="#contact">Let’s explore your idea. <Arrow/></a></div>
</section> }

function Pricing(){
  const [selected,setSelected]=useState([])
  const total=10999+selected.reduce((s,i)=>s+addons[i].price,0)
  const groups=[...new Set(addons.map(a=>a.group))]
  return <section className="section pricing" id="pricing">
    <div className="section-head reveal"><div className="eyebrow">BUILD YOUR PACKAGE</div><h2>Pick what matters.<br/>Pay for nothing else.</h2><p>Start with the essentials. Add what your idea needs. Your estimate updates instantly.</p></div>
    <div className="always reveal"><small>ALWAYS INCLUDED</small><span>Functional MVP</span><span>Your source code</span><span>Deployment</span><span>14-day support</span></div>
    <div className="pricing-layout">
      <div>{groups.map((g,gi)=><div className="price-group reveal" key={g}><div className="group-title"><span>0{gi+1} / {g}</span><b>{gi===0?'Stack & capabilities':gi===1?'Analytics & integrations':'Go-to-market'}</b></div>
        {gi===0&&<div className="option included-option"><div><b>Standard stack</b><p>React, backend, and production-ready foundations.</p></div><strong>Included</strong></div>}
        {gi===1&&<div className="option included-option"><div><b>Basic analytics</b><p>Events and core product usage insights.</p></div><strong>Included</strong></div>}
        {gi===2&&<div className="option included-option"><div><b>Testing report</b><p>Functional checks and a clear launch handoff.</p></div><strong>Included</strong></div>}
        {addons.map((a,i)=>a.group===g&&<button className={'option '+(selected.includes(i)?'selected':'')} key={a.label} onClick={()=>setSelected(s=>s.includes(i)?s.filter(v=>v!==i):[...s,i])}><div><b>{a.label}</b><p>{a.desc}</p></div><strong>{selected.includes(i)?'Added ✓':'Add · '+money(a.price)}</strong></button>)}
      </div>)}</div>
      <aside className="estimate reveal"><div className="live">YOUR CUSTOM PACKAGE <span>LIVE</span></div><p>Base MVP · 100 hours</p><h3>{money(total)}</h3><div className="selected-list">{selected.length?selected.map(i=><span key={i}>{addons[i].label}<b>+{money(addons[i].price)}</b></span>):<span>Select any + Add card to shape your custom package.</span>}</div><div className="estimate-line"><span>YOUR ESTIMATE</span><b>{money(total)}</b></div><p>One focused build. The essentials included.</p><a className="btn dark full" href="#contact">Build my project brief <Arrow/></a><div className="tiny"><span>No payment now</span><span>Scope first</span></div><small>Illustrative pricing. Final scope, timeline, and terms are confirmed in a proposal.</small></aside>
    </div>
  </section>
}

function Focus(){ return <section className="section focus-zone">
  <div className="focus-copy reveal"><div className="eyebrow">LESS JUGGLING. MORE FOCUS.</div><h2>Your project deserves our full attention.</h2><p>We plan focused sprints around clear priorities. Start with a conversation, leave with a direction.</p><a className="btn dark" href="#contact">Plan my sprint <Arrow/></a><small>Scheduling is confirmed after discovery.</small></div>
  <div className="launch reveal"><small>YOUR LAUNCH, AT A GLANCE</small>{[['01','Align on the vision','Discovery'],['02','Make the important decisions','Scope'],['03','Watch your product take shape','Build'],['04','Put it in people’s hands','Launch']].map(x=><div key={x[0]}><b>{x[0]}</b><span>{x[1]}</span><em>{x[2]}</em></div>)}<p>Not sure where to start? Bring the idea. We’ll help find the first step.</p></div>
</section> }

function Confidence(){ return <section className="section confidence">
  <div className="section-head reveal"><div className="eyebrow">CONFIDENCE, BUILT IN</div><h2>All the momentum.<br/>None of the black box.</h2></div>
  <div className="confidence-grid">{[['Clarity before commitment','Your priorities, deliverables, and acceptance criteria are agreed before development starts.'],['Ownership without friction','Keep your source code and the freedom to continue with us or your own team.'],['A considered handoff','Documentation, a walkthrough, and a support period help you take the next step confidently.']].map((x,i)=><article className="reveal" key={x[0]}><span>0{i+1}</span><h3>{x[0]}</h3><p>{x[1]}</p></article>)}</div>
</section> }

function FAQ(){ const [open,setOpen]=useState(0); return <section className="section faq" id="faq"><div className="section-head reveal"><div className="eyebrow">COMMON QUESTIONS</div><h2>Things founders ask.</h2><p>Still wondering about something? <a href="#contact">Let’s talk.</a></p></div><div className="faq-list">{faqs.map((f,i)=><div className={'faq-item '+(open===i?'open':'')} key={f[0]}><button onClick={()=>setOpen(open===i?-1:i)}><span>{f[0]}</span><b>{open===i?'−':'+'}</b></button><div><p>{f[1]}</p></div></div>)}</div></section> }

function ProjectForm(){
 const [form,setForm]=useState({name:'',email:'',company:'',phone:'',projectType:'',budget:'',message:'',website:''})
 const [state,setState]=useState('idle')
 const submit=async e=>{e.preventDefault();setState('loading');try{const r=await fetch('/api/inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});if(!r.ok)throw new Error();setState('ok');setForm({name:'',email:'',company:'',phone:'',projectType:'',budget:'',message:'',website:''})}catch{setState('error')}}
 return <section className="section contact" id="contact"><div className="contact-intro reveal"><div className="eyebrow light">YOUR NEXT CHAPTER STARTS HERE</div><h2>Your idea deserves to exist.</h2><p>Take it out of your notebook. Let’s build something people can actually use.</p><div className="contact-notes"><span>✓ No payment now</span><span>✓ Scope first</span><span>✓ Your code, your ownership</span></div></div><form className="project-form reveal" onSubmit={submit}><div className="form-grid"><label>Name*<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Email*<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Company<input value={form.company} onChange={e=>setForm({...form,company:e.target.value})}/></label><label>Phone<input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label><label>Project type<select value={form.projectType} onChange={e=>setForm({...form,projectType:e.target.value})}><option value="">Choose one</option><option>New MVP</option><option>Business automation</option><option>Existing product upgrade</option><option>AI / agent system</option><option>Mobile app</option><option>Other</option></select></label><label>Approx. budget<select value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})}><option value="">Choose one</option><option>Under $10k</option><option>$10k–$15k</option><option>$15k–$25k</option><option>$25k+</option></select></label></div><label>Tell us what you want to build*<textarea required rows="6" value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/></label><input className="hp" tabIndex="-1" autoComplete="off" value={form.website} onChange={e=>setForm({...form,website:e.target.value})}/><button disabled={state==='loading'} className="btn lime" type="submit">{state==='loading'?'Sending…':'Start my project'} <Arrow/></button>{state==='ok'&&<p className="success">Thanks — your project brief has been received.</p>}{state==='error'&&<p className="error">We couldn’t send that right now. Please try again.</p>}</form></section>
}

function Footer(){ return <footer><div className="footer-top"><a className="brand invert" href="#top"><span className="brand-mark">JA</span><span>Jinnx Automation<small>IDEA. BUILD. AUTOMATE.</small></span></a><p>Intelligent products. Thoughtful automation. Built to move your business forward.</p><a className="btn lime" href="#contact">Let’s build <Arrow/></a></div><div className="footer-links"><div><small>PRODUCT</small><a href="#solution">The approach</a><a href="#process">How it works</a><a href="#pricing">Pricing builder</a></div><div><small>EXPLORE</small><a href="#portfolio">Portfolio concepts</a><a href="#portfolio">Industries</a><a href="#faq">Common questions</a></div><div><small>LET’S MAKE IT HAPPEN</small><p>A good idea is a great place to start. A working product is even better.</p><a href="#contact">Start your project brief <Arrow/></a></div></div><div className="footer-bottom"><span>© 2026 JinnxAutomation.</span><span>Privacy · Terms</span><a href="#top">Back to top ↑</a></div></footer> }

function InquiryCard({r,onStatus,onNotes,onRemove}){
 const [notes,setNotes]=useState(r.notes||'')
 const [saved,setSaved]=useState(true)
 const save=async()=>{await onNotes(r.id,notes);setSaved(true)}
 return <article><div className="inq-head"><div><span className={'pill '+r.status}>{r.status}</span><h2>{r.name}</h2><a href={'mailto:'+r.email}>{r.email}</a>{r.phone&&<a href={'tel:'+r.phone}>{r.phone}</a>}</div><small>{new Date(r.createdAt).toLocaleString()}</small></div><div className="inq-meta"><span><b>Company</b>{r.company||'—'}</span><span><b>Project</b>{r.projectType||'—'}</span><span><b>Budget</b>{r.budget||'—'}</span><span><b>Contacted</b>{r.contactedAt?new Date(r.contactedAt).toLocaleString():'—'}</span></div><p className="inq-msg">{r.message}</p><label className="inq-notes">Notes<textarea rows="2" placeholder="Log what happened when you reached out…" value={notes} onChange={e=>{setNotes(e.target.value);setSaved(false)}} onBlur={()=>!saved&&save()}/></label><div className="inq-actions"><select value={r.status} onChange={e=>onStatus(r.id,e.target.value)}><option>new</option><option>contacted</option><option>qualified</option><option>closed</option></select>{r.status==='new'&&<button onClick={()=>onStatus(r.id,'contacted')}>Mark contacted</button>}{!saved&&<button onClick={save}>Save notes</button>}<button className="danger" onClick={()=>onRemove(r.id)}>Delete</button></div></article>
}

function Admin(){
 const [authed,setAuthed]=useState(false),[loading,setLoading]=useState(true),[rows,setRows]=useState([]),[error,setError]=useState('')
 const [creds,setCreds]=useState({email:'',password:''})
 const load=async()=>{try{let r=await fetch('/api/admin/session'); if(r.ok){let s=await r.json();setAuthed(s.authenticated);if(s.authenticated){r=await fetch('/api/admin/inquiries');if(r.ok)setRows(await r.json())}}}finally{setLoading(false)}}
 useEffect(()=>{load()},[])
 const login=async e=>{e.preventDefault();setError('');const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(creds)});if(r.ok){setAuthed(true);load()}else setError('Invalid email or password.')}
 const logout=async()=>{await fetch('/api/admin/logout',{method:'POST'});setAuthed(false)}
 const status=async(id,v)=>{const r=await fetch('/api/admin/inquiries/'+id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:v})});if(r.ok)load()}
 const notes=async(id,v)=>{const r=await fetch('/api/admin/inquiries/'+id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({notes:v})});if(r.ok)load()}
 const remove=async id=>{if(confirm('Delete this inquiry?')){const r=await fetch('/api/admin/inquiries/'+id,{method:'DELETE'});if(r.ok)load()}}
 const csv=()=>{const esc=v=>'"'+String(v??'').replaceAll('"','""')+'"';const cols=['createdAt','name','email','company','phone','projectType','budget','message','status','contactedAt','notes'];const content=[cols.join(','),...rows.map(r=>cols.map(c=>esc(r[c])).join(','))].join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type:'text/csv'}));a.download='jinnxautomation-inquiries.csv';a.click()}
 if(loading)return <div className="admin-shell"><p>Loading…</p></div>
 if(!authed)return <div className="admin-shell"><form className="admin-login" onSubmit={login}><a href="/" className="admin-brand">JINNXAUTOMATION</a><h1>Admin access</h1><p>Sign in to review project inquiries.</p><label>Email<input type="email" required value={creds.email} onChange={e=>setCreds({...creds,email:e.target.value})}/></label><label>Password<input type="password" required value={creds.password} onChange={e=>setCreds({...creds,password:e.target.value})}/></label><button className="btn dark full">Sign in</button>{error&&<p className="error">{error}</p>}<a href="/" className="back">← Back to website</a></form></div>
 return <div className="admin-page"><div className="admin-top"><div><small>JINNXAUTOMATION</small><h1>Project inquiries</h1></div><div><button onClick={csv}>Export CSV</button><button onClick={logout}>Sign out</button></div></div><div className="admin-summary"><div><b>{rows.length}</b><span>Total inquiries</span></div><div><b>{rows.filter(r=>r.status==='new').length}</b><span>New</span></div><div><b>{rows.filter(r=>r.status==='contacted').length}</b><span>Contacted</span></div></div><div className="admin-cards">{rows.length===0?<div className="empty">No inquiries yet.</div>:rows.map(r=><InquiryCard key={r.id} r={r} onStatus={status} onNotes={notes} onRemove={remove}/>)}</div></div>
}

export default function App(){
 useEffect(()=>{
   const nodes=document.querySelectorAll('.reveal'); const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.08});nodes.forEach(n=>io.observe(n));return()=>io.disconnect()
 },[])
 const isAdmin=location.pathname.startsWith('/admin')
 if(isAdmin)return <Admin/>
 return <><Header/><main><Hero/><Stats/><Problems/><Process/><Speed/><Portfolio/><Pricing/><Focus/><Confidence/><FAQ/><ProjectForm/></main><Footer/></>
}
