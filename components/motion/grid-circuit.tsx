'use client';
import { useEffect, useRef } from 'react';

// A live drawing on the page's own 80px grid paper: work items leave a source,
// travel the grid lines, wait at a yellow approval gate, and only then carry on
// to where they were going. Each page gets its own map of sources, gates and exits.

type Pt = { x: number; y: number; label?: string };
type Map = {
  sources: Pt[];
  gates: Pt[];
  exits: Pt[];
  // Which gate/exit each source routes through; defaults to round-robin.
  routes?: [number, number, number][];
  speed: number;       // px per second
  every: number;       // seconds between new items
  hold: [number, number]; // seconds an item waits for approval
  held?: number;       // index of a source whose items are always stopped at the gate
  heldLabel?: string;
};

export type CircuitVariant =
  | 'home' | 'services' | 'service' | 'process' | 'work' | 'about' | 'contact'
  | 'resources' | 'guide' | 'industries' | 'industry' | 'security' | 'check';

const MAPS: Record<CircuitVariant, Map> = {
  home: {
    sources: [{ x: .56, y: .05, label: 'Quote request' }, { x: .52, y: .16, label: 'New lead' }],
    gates: [{ x: .7, y: .1, label: 'Your approval' }],
    exits: [{ x: .96, y: .05, label: 'Sent' }, { x: .96, y: .16, label: 'Logged in CRM' }],
    speed: 110, every: 1.6, hold: [1, 1.8],
  },
  services: {
    sources: [{ x: .7, y: .12, label: 'Inquiry' }, { x: .66, y: .5, label: 'Lead list' }, { x: .72, y: .9, label: 'Call' }],
    gates: [{ x: .82, y: .5, label: 'Hold' }],
    exits: [{ x: .97, y: .1, label: 'Reply' }, { x: .98, y: .36, label: 'CRM' }, { x: .97, y: .66, label: 'Campaign' }, { x: .98, y: .92, label: 'Invoice' }],
    routes: [[0, 0, 0], [1, 0, 1], [1, 0, 2], [2, 0, 3]],
    speed: 130, every: 1.1, hold: [.8, 1.5],
  },
  service: {
    sources: [{ x: .56, y: .1 }, { x: .54, y: .92 }],
    gates: [{ x: .64, y: .5 }],
    exits: [{ x: .98, y: .2 }, { x: .98, y: .8 }],
    speed: 110, every: 1.8, hold: [1, 1.6],
  },
  process: {
    sources: [{ x: .6, y: .5, label: 'Brief' }],
    gates: [{ x: .7, y: .5, label: '25%' }, { x: .79, y: .5, label: '50%' }, { x: .88, y: .5, label: '75%' }],
    exits: [{ x: .97, y: .5, label: 'Launch' }],
    routes: [[0, -1, 0]], // -1: pass every gate in turn
    speed: 110, every: 3.2, hold: [.9, 1.2],
  },
  work: {
    sources: [{ x: .64, y: .1 }, { x: .62, y: .3 }, { x: .64, y: .5 }],
    gates: [{ x: .78, y: .3, label: 'Review' }],
    exits: [{ x: .96, y: .12 }, { x: .97, y: .3 }, { x: .96, y: .48 }],
    speed: 140, every: .9, hold: [.6, 1.1],
  },
  about: {
    sources: [{ x: .64, y: .2 }, { x: .66, y: .84 }],
    gates: [{ x: .8, y: .52, label: 'You' }],
    exits: [{ x: .98, y: .52 }],
    speed: 80, every: 2.6, hold: [1.4, 2.2],
  },
  contact: {
    sources: [{ x: .58, y: .2, label: 'Your inquiry' }],
    gates: [{ x: .76, y: .2, label: 'Private inbox' }],
    exits: [{ x: .95, y: .76, label: 'Reply by email' }],
    speed: 100, every: 2.4, hold: [1.2, 1.8],
  },
  resources: {
    sources: [{ x: .66, y: .16 }, { x: .64, y: .86 }],
    gates: [{ x: .8, y: .5 }],
    exits: [{ x: .98, y: .3 }, { x: .98, y: .76 }],
    speed: 90, every: 2.2, hold: [1, 1.6],
  },
  guide: {
    sources: [{ x: .7, y: .2 }],
    gates: [{ x: .84, y: .56 }],
    exits: [{ x: .98, y: .8 }],
    speed: 80, every: 3, hold: [1, 1.6],
  },
  industries: {
    sources: [{ x: .6, y: .1, label: 'Clinic' }, { x: .64, y: .38, label: 'Agency' }, { x: .6, y: .66, label: 'Store' }, { x: .64, y: .92, label: 'Brokerage' }],
    gates: [{ x: .8, y: .52, label: 'One approval gate' }],
    exits: [{ x: .98, y: .24 }, { x: .98, y: .8 }],
    speed: 120, every: 1.2, hold: [.8, 1.4],
  },
  industry: {
    sources: [{ x: .68, y: .14 }, { x: .66, y: .88 }],
    gates: [{ x: .8, y: .5, label: 'Your approval' }],
    exits: [{ x: .98, y: .3 }, { x: .98, y: .74 }],
    speed: 110, every: 1.6, hold: [1, 1.6],
  },
  security: {
    sources: [{ x: .66, y: .14, label: 'Routine reply' }, { x: .64, y: .86, label: 'Complaint' }],
    gates: [{ x: .8, y: .5, label: 'Checks + approval' }],
    exits: [{ x: .98, y: .5, label: 'Sent' }],
    routes: [[0, 0, 0], [1, 0, 0]],
    held: 1, heldLabel: 'Stopped · routed to you',
    speed: 100, every: 1.8, hold: [1, 1.6],
  },
  check: {
    sources: [{ x: .68, y: .12, label: 'Replies' }, { x: .66, y: .5, label: 'Follow-ups' }, { x: .68, y: .88, label: 'Invoices' }],
    gates: [{ x: .8, y: .5, label: 'You approve' }],
    exits: [{ x: .98, y: .5, label: 'Hours back' }],
    speed: 130, every: 1, hold: [.6, 1.1],
  },
};

const CELL = 80;
const INK = '22,22,22';
const YELLOW = '245,206,0';
const DEEP = '160,130,0';

type Seg = { x1: number; y1: number; x2: number; y2: number; len: number };
type Path = { segs: Seg[]; len: number };
type Item = { route: number; leg: number; d: number; wait: number; state: 'move' | 'hold' | 'stopped'; out: boolean };

function rand(seed: number) { let s = seed; return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }; }

function snap(v: number, max: number) { return Math.max(0, Math.min(Math.round(v / CELL) * CELL, Math.floor(max / CELL) * CELL)); }

// Manhattan route along grid lines, turning once at a grid column between the two points.
function route(a: { x: number; y: number }, b: { x: number; y: number }): Path {
  const midX = a.x === b.x ? a.x : Math.round((a.x + (b.x - a.x) * .5) / CELL) * CELL;
  const pts = [a, { x: midX, y: a.y }, { x: midX, y: b.y }, b].filter((p, i, all) => i === 0 || p.x !== all[i - 1].x || p.y !== all[i - 1].y);
  const segs: Seg[] = [];
  for (let i = 1; i < pts.length; i++) {
    const s = pts[i - 1], e = pts[i];
    segs.push({ x1: s.x, y1: s.y, x2: e.x, y2: e.y, len: Math.abs(e.x - s.x) + Math.abs(e.y - s.y) });
  }
  return { segs, len: segs.reduce((n, s) => n + s.len, 0) };
}

function at(p: Path, d: number) {
  let left = Math.max(0, Math.min(d, p.len));
  for (const s of p.segs) {
    if (left <= s.len) { const t = s.len ? left / s.len : 0; return { x: s.x1 + (s.x2 - s.x1) * t, y: s.y1 + (s.y2 - s.y1) * t }; }
    left -= s.len;
  }
  const last = p.segs[p.segs.length - 1];
  return last ? { x: last.x2, y: last.y2 } : { x: 0, y: 0 };
}

export function GridCircuit({ variant, className = '' }: { variant: CircuitVariant; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const map = MAPS[variant];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0, last = 0, spawnIn = 0, visible = false, hidden = false;
    let sources: Pt[] = [], gates: Pt[] = [], exits: Pt[] = [];
    // legs[route] = the ordered paths an item walks; gateAt[route][leg] = gate index at the end of that leg, or -1.
    let legs: Path[][] = [], gateAt: number[][] = [];
    let items: Item[] = [];
    const flash: number[] = [], landed: number[] = [];
    const next = rand(variant.length * 7919 + 17);

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const narrow = w < 760;
      // Wide screens: never draw under the headline or intro. Measure where the
      // left-column text actually ends and start the drawing past it.
      const mapMin = Math.min(...map.sources.map(q => q.x), ...map.gates.map(q => q.x)) - .02;
      const box = canvas.getBoundingClientRect();
      let textRight = 0;
      canvas.parentElement?.querySelectorAll('h1, h1 + p, .hero-sub, .page-hero > .wrap > p').forEach(el => {
        const r = document.createRange(); r.selectNodeContents(el);
        const b = r.getBoundingClientRect();
        if (b.width && b.left - box.left < w * .5) textRight = Math.max(textRight, b.right - box.left);
      });
      const fromX = Math.max(mapMin * w, textRight + 72), toX = w;
      hidden = !narrow && toX - fromX < 340;
      // Narrow screens: the drawing lives in the band CSS reserves under the hero copy.
      const band = 200, minX = mapMin;
      const place = (p: Pt): Pt => narrow
        ? { ...p, x: Math.round(Math.max(20, Math.min(w - 20, (p.x - minX) / (1 - minX) * (w - 40) + 20)) / (CELL / 2)) * (CELL / 2), y: Math.round((h - band + 30 + p.y * (band - 60)) / (CELL / 2)) * (CELL / 2) }
        : { ...p, x: snap(fromX + (p.x - mapMin) / (1 - mapMin) * (toX - fromX), w - CELL / 2), y: snap(p.y * h, h - CELL / 2) };
      sources = map.sources.map(place); gates = map.gates.map(place); exits = map.exits.map(place);
      const table = map.routes ?? map.sources.map((_, i) => [i, i % map.gates.length, i % map.exits.length] as [number, number, number]);
      legs = []; gateAt = [];
      table.forEach(([s, g, e]) => {
        const stops = g === -1 ? gates.map((_, i) => i) : [g];
        const chain = [sources[s], ...stops.map(i => gates[i]), exits[e]];
        legs.push(chain.slice(1).map((p, i) => route(chain[i], p)));
        gateAt.push([...stops, -1]);
      });
      items = items.filter(it => it.route < legs.length);
    };

    const spawn = () => {
      if (items.length > 14) return;
      const r = Math.floor(next() * legs.length);
      const held = map.held !== undefined && (map.routes?.[r]?.[0] ?? r) === map.held;
      if (held && items.some(it => it.state === 'stopped')) return;
      items.push({ route: r, leg: 0, d: 0, wait: 0, state: 'move', out: false });
    };

    const drawLabel = (text: string, x: number, y: number, align: CanvasTextAlign, strong = false) => {
      ctx.font = `${strong ? 600 : 500} 11px Inter, Arial, sans-serif`;
      ctx.textAlign = align; ctx.textBaseline = 'middle';
      const pad = 5, tw = ctx.measureText(text).width;
      const bx = align === 'left' ? x : align === 'right' ? x - tw : x - tw / 2;
      ctx.fillStyle = 'rgba(250,250,250,.92)';
      ctx.fillRect(bx - pad, y - 9, tw + pad * 2, 18);
      ctx.fillStyle = `rgba(${INK},${strong ? .86 : .62})`;
      ctx.fillText(text, x, y + .5);
    };

    const stripes = (x: number, y: number, s: number) => {
      ctx.save();
      ctx.beginPath(); ctx.rect(x - s / 2, y - s / 2, s, s); ctx.clip();
      ctx.fillStyle = `rgb(${YELLOW})`; ctx.fillRect(x - s / 2, y - s / 2, s, s);
      ctx.strokeStyle = `rgb(${INK})`; ctx.lineWidth = 3;
      for (let k = -s; k < s; k += 7) { ctx.beginPath(); ctx.moveTo(x - s / 2 + k, y + s / 2); ctx.lineTo(x - s / 2 + k + s, y - s / 2); ctx.stroke(); }
      ctx.restore();
      ctx.strokeStyle = `rgb(${INK})`; ctx.lineWidth = 1.5; ctx.strokeRect(x - s / 2, y - s / 2, s, s);
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      if (hidden) return;
      // The routes themselves, drawn over the paper grid.
      ctx.lineWidth = 1.5; ctx.strokeStyle = `rgba(${INK},.13)`;
      legs.forEach(chain => chain.forEach(p => { ctx.beginPath(); p.segs.forEach((s, i) => { if (i === 0) ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); }); ctx.stroke(); }));

      // Items.
      for (const it of items) {
        const chain = legs[it.route]; const path = chain[it.leg];
        const head = at(path, it.d);
        const trail = 64;
        for (let k = 0; k < 8; k++) {
          const a = at(path, it.d - (k * trail) / 8), b = at(path, it.d - ((k + 1) * trail) / 8);
          ctx.strokeStyle = it.out ? `rgba(${DEEP},${.55 * (1 - k / 8)})` : `rgba(${INK},${.5 * (1 - k / 8)})`;
          ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
        ctx.beginPath(); ctx.arc(head.x, head.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = it.out ? `rgb(${YELLOW})` : `rgb(${INK})`; ctx.fill();
        if (it.out) { ctx.strokeStyle = `rgb(${INK})`; ctx.lineWidth = 1.2; ctx.stroke(); }
        if (it.state !== 'move') {
          const pulse = (performance.now() / 900) % 1;
          ctx.beginPath(); ctx.arc(head.x, head.y, 6 + pulse * 10, 0, Math.PI * 2);
          ctx.strokeStyle = it.state === 'stopped' ? `rgba(${INK},${.5 * (1 - pulse)})` : `rgba(${DEEP},${.6 * (1 - pulse)})`;
          ctx.lineWidth = 1.5; ctx.stroke();
        }
      }

      // Sources and exits.
      sources.forEach(p => {
        ctx.fillStyle = '#fff'; ctx.fillRect(p.x - 5, p.y - 5, 10, 10);
        ctx.strokeStyle = `rgb(${INK})`; ctx.lineWidth = 1.5; ctx.strokeRect(p.x - 5, p.y - 5, 10, 10);
        if (p.label) drawLabel(p.label, p.x, p.y - 20, 'center');
      });
      exits.forEach((p, i) => {
        const f = landed[i] || 0;
        ctx.fillStyle = f > 0 ? `rgba(${YELLOW},${Math.min(1, f)})` : '#fff';
        ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = `rgb(${INK})`; ctx.lineWidth = 1.5; ctx.stroke();
        if (p.label) drawLabel(p.label, p.x - 14, p.y, 'right');
        landed[i] = Math.max(0, f - dt * 1.4);
      });
      // Gates: striped while holding, yellow with a tick the moment something is approved.
      gates.forEach((p, i) => {
        const f = flash[i] || 0;
        if (f > 0) {
          ctx.beginPath(); ctx.arc(p.x, p.y, 12 + (1 - f) * 26, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${YELLOW},${f})`; ctx.lineWidth = 3; ctx.stroke();
          ctx.fillStyle = `rgb(${YELLOW})`; ctx.fillRect(p.x - 10, p.y - 10, 20, 20);
          ctx.strokeStyle = `rgb(${INK})`; ctx.lineWidth = 1.5; ctx.strokeRect(p.x - 10, p.y - 10, 20, 20);
          ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(p.x - 5, p.y); ctx.lineTo(p.x - 1.5, p.y + 4); ctx.lineTo(p.x + 5.5, p.y - 4.5); ctx.stroke();
        } else stripes(p.x, p.y, 20);
        if (p.label) drawLabel(p.label, p.x, p.y + 26, 'center', true);
        flash[i] = Math.max(0, f - dt * 1.6);
      });
      const stopped = items.find(it => it.state === 'stopped');
      if (stopped && map.heldLabel) { const pos = at(legs[stopped.route][stopped.leg], stopped.d); drawLabel(map.heldLabel, pos.x - 16, pos.y - 22, 'right', true); }
    };

    const step = (dt: number) => {
      spawnIn -= dt;
      if (spawnIn <= 0) { spawn(); spawnIn = map.every * (.7 + next() * .6); }
      for (const it of items) {
        const chain = legs[it.route]; const path = chain[it.leg];
        if (it.state === 'stopped') { it.wait -= dt; continue; }
        if (it.state === 'hold') {
          it.wait -= dt;
          if (it.wait <= 0) { const g = gateAt[it.route][it.leg]; flash[g] = 1; it.state = 'move'; it.leg += 1; it.d = 0; it.out = it.leg === chain.length - 1; }
          continue;
        }
        it.d += map.speed * dt;
        if (it.d >= path.len - 12 && gateAt[it.route][it.leg] !== -1) {
          it.d = path.len - 12;
          const src = map.routes?.[it.route]?.[0] ?? it.route;
          if (map.held !== undefined && src === map.held) { it.state = 'stopped'; it.wait = 3.2; }
          else { it.state = 'hold'; it.wait = map.hold[0] + next() * (map.hold[1] - map.hold[0]); }
        } else if (it.d >= path.len) {
          const e = map.routes?.[it.route]?.[2] ?? it.route % exits.length;
          landed[e] = 1; it.wait = -1;
        }
      }
      items = items.filter(it => !(it.state === 'move' && it.wait === -1) && !(it.state === 'stopped' && it.wait <= 0));
    };

    const frame = (now: number) => {
      const dt = Math.min(.05, (now - last) / 1000 || 0); last = now;
      step(dt); draw(dt);
      raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0;
    };
    const start = () => { if (!raf && visible && !document.hidden && !reduce) { last = performance.now(); raf = requestAnimationFrame(frame); } };

    // A still frame for reduced motion: one item waiting at each gate.
    const still = () => {
      items = legs.map((chain, r) => ({ route: r, leg: 0, d: Math.max(0, chain[0].len - 12), wait: 1, state: 'hold' as const, out: false }));
      if (map.held !== undefined) items.forEach(it => { if ((map.routes?.[it.route]?.[0] ?? it.route) === map.held) it.state = 'stopped' as never; });
      draw(0);
    };

    layout();
    if (reduce) still(); else { for (let i = 0; i < 40; i++) step(.1); draw(0); }
    const ro = new ResizeObserver(() => { layout(); if (reduce) still(); else draw(0); });
    ro.observe(canvas);
    document.fonts?.ready.then(() => { layout(); if (reduce) still(); else draw(0); });
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
    io.observe(canvas);
    const onVis = () => start();
    document.addEventListener('visibilitychange', onVis);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', onVis); };
  }, [variant]);

  return <canvas ref={ref} className={'jx-circuit ' + className} aria-hidden="true" />;
}
