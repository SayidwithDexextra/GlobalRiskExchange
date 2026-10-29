// The Inside Look page logic, copied verbatim from the <script data-dc-script> block of
// design/source/Inside Look.dc.html. Only two site hooks were added (search 'Site hook' in convert.py).
/* eslint-disable */
// @ts-nocheck
import * as React from 'react';
import { DCLogic } from './dcRuntime';

export class Component extends DCLogic {
  state = { settle: 41.24, rin: false, w: 1440, h: 900, sec: 'development', vis: 1, scrolled: false, menu: false, dd: false, tab: 0, sub: 0 };
  secs = [{ id: 'development', n: '01', l: 'Development cost' }, { id: 'elnino', n: '02', l: 'El Niño' }, { id: 'power', n: '03', l: 'Power' }];
  pwVals(s) {
    const d = 2880 * (s.settle - 41.24), z = Math.abs(d) < 0.5;
    const f = v => (z || Math.abs(v) < 0.5) ? '$0' : (v > 0 ? '+' : '\u2212') + '$' + Math.round(Math.abs(v)).toLocaleString('en-US');
    const P = [['Brazil spot power (Southeast)','Hydrology driven spot price','264 TWh free market','L'],['Nordic zone premiums (SE3, SE4, FI)','Local price vs system price','173 TWh Nordic open interest','V'],['Colombia spot power','El Ni\u00f1o price swings','$78 to $219/MWh annual range','V'],['Brazil evening vs midday price','Solar shape risk','23x intraday moves','V'],['Solar capture rate (5 grids)','Solar cannibalization','$221M per 0.10 in Texas alone','V'],['Chile marginal cost','Night prices and solar glut','85 TWh no exchange','P'],['Texas solar capture rate','Solar cannibalization','$570M lost in 2025','P'],['Japan spot power','Fuel and weather','285 TWh spot volume','P'],['Great Britain imbalance price','Forecast error cost','$107 to $266/MWh annual avg','P'],['Brazil Northeast vs Southeast','Regional price split','$50/MWh peak spread','P'],['Korea system price','Fuel driven spot price','$51B settled in 2025','P'],['PJM capacity price','Data centre scarcity','$16.4B auction','P'],['California capacity (RA)','Reliability scarcity','Opaque bilateral market','P'],['Solar module price','Project build cost','about 690 GW built in 2025','P']];
    return {
      settleNum: s.settle, settleStr: '$' + s.settle.toFixed(2),
      onSettle: e => { const v = parseFloat(e.target.value); if (!isNaN(v) && v !== this.state.settle) this.setState({ settle: v }); },
      fCost: f(-d), fHedge: f(d), fNet: '$0', wRev: f(d), wHedge: f(-d), wNet: '$0',
      pDesk: s.w >= 720, pPhone: s.w < 720,
      pipeRows: P.map(([m, r, sz, t]) => ({ m, r, s: sz, lead: t === 'L', val: t === 'V', pipe: t === 'P' }))
    };
  }
  splitRef = React.createRef(); gapsRef = React.createRef(); whoRef = React.createRef(); layersRef = React.createRef(); splitRef2 = React.createRef(); splitRef3 = React.createRef();
  componentDidMount() {
    const fromHash = () => { let h = (location.hash || '').slice(1); if (!h && window.__dxIL) { h = String(window.__dxIL); window.__dxIL = ''; } return this.secs.some(s => s.id === h) ? h : null; };
    const h0 = fromHash(); if (h0) this.setState({ sec: h0 });
    this.onHash = () => { const h = fromHash(); if (h && h !== this.state.sec) this.go(h, true); };
    this.onResize = () => this.setState({ w: window.innerWidth, h: window.innerHeight });
    this.onScroll = () => { const y = window.scrollY || 0, sc = y > 24; if (sc !== this.state.scrolled) this.setState({ scrolled: sc });
      if (!this.raf) this.raf = requestAnimationFrame(() => { this.raf = 0; this.heroFx(); });
    };
    this.onLink = ev => { const a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null; if (!a) return; const m = (a.getAttribute('href') || '').match(/^(?:\/inside-look)?#(development|elnino|power)$/); if (!m) return; ev.preventDefault(); if (!a.closest('[data-dx-il]')) this.go(m[1]); }; document.addEventListener('click', this.onLink); window.addEventListener('hashchange', this.onHash); window.addEventListener('popstate', this.onHash);
    window.addEventListener('resize', this.onResize); window.addEventListener('scroll', this.onScroll, { passive: true });
    this.onResize(); this.onScroll(); setTimeout(() => { this.draw(); this.fitHero(); this.heroFx(); }, 30); setTimeout(() => { this.fitHero(); this.heroFx(); }, 400);
    requestAnimationFrame(() => requestAnimationFrame(() => this.setState({ rin: true })));
    setTimeout(() => this.contentFx(), 50);
    this.onPx = () => this.fixPx(); window.addEventListener('resize', this.onPx); setTimeout(this.onPx, 300);
  }
  componentWillUnmount() {
    clearInterval(this.tickT); window.removeEventListener('resize', this.onPx); this.cio && this.cio.disconnect();
    document.removeEventListener('click', this.onLink); window.removeEventListener('hashchange', this.onHash); window.removeEventListener('popstate', this.onHash);
    window.removeEventListener('resize', this.onResize); window.removeEventListener('scroll', this.onScroll);
    clearTimeout(this.ft);
  }
  componentDidUpdate() { this.contentFx(); this.draw(); this.fitHero(); this.heroFx(); this.tickStart(); this.fixPx(); }
  contentFx() {
    this.sparks(); this.railSync(); this.railFx();
    const rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!this.cio && 'IntersectionObserver' in window) this.cio = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; this.cio.unobserve(e.target); const el = e.target; if (el.dataset.count) this.countUp(el); else this.revealEl(el); }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    const io = this.cio;
    document.querySelectorAll('[data-card]:not([data-fx])').forEach(c => {
      c.dataset.fx = '1';
      Object.assign(c.style, { border: '1px solid transparent', background: 'radial-gradient(360px circle at var(--mx,50%) var(--my,0%), var(--cspot,transparent), transparent 70%) padding-box, linear-gradient(var(--card),var(--card)) padding-box, linear-gradient(160deg, var(--line4), var(--line) 38%, var(--hair) 70%, var(--line3)) border-box' });
      c.addEventListener('mousemove', ev => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (ev.clientX - r.left) + 'px'); c.style.setProperty('--my', (ev.clientY - r.top) + 'px'); });
      c.addEventListener('mouseenter', () => { c.style.setProperty('--cspot', 'var(--spot)'); if (!rm && c.dataset.rv !== '0') { c.style.transform = 'translateY(-3px)'; c.style.boxShadow = 'var(--highlight), 0 18px 40px -18px rgba(0,0,0,.6)'; } });
      c.addEventListener('mouseleave', () => { c.style.setProperty('--cspot', 'transparent'); if (c.dataset.rv !== '0') { c.style.transform = ''; c.style.boxShadow = ''; } });
    });
    document.querySelectorAll('[data-count]:not([data-fx])').forEach(el => { el.dataset.fx = '1'; el.style.fontVariantNumeric = 'tabular-nums'; if (!rm && io) { this.setNums(el, 0); io.observe(el); } });
    if (rm || !io) return;
    document.querySelectorAll('section[data-screen-label]:not([data-screen-label$="Hero"])').forEach(sec => {
      if (sec.dataset.fx) return; sec.dataset.fx = '1';
      const items = [];
      [...sec.children].forEach(ch => { if (ch.querySelector('[data-card]')) { items.push(...[...ch.children].filter(k => !k.dataset.card)); ch.querySelectorAll('[data-card]').forEach(k => items.push(k)); } else items.push(ch); });
      const sib = new Map();
      items.forEach(el => { const p = el.parentElement, i = sib.get(p) || 0; sib.set(p, i + 1); el.dataset.rv = '0'; el.style.opacity = '0'; el.style.transform = 'translateY(18px)'; el.style.transition = 'opacity .7s ease ' + (i * 0.08) + 's, transform .7s cubic-bezier(.2,.7,.2,1) ' + (i * 0.08) + 's'; io.observe(el); });
    });
  }
  mkChartEl(kind) {
    if (!this.MktChart) {
      const e = React.createElement, mono = "'JetBrains Mono',monospace";
      const seed = s => () => (s = (s * 16807) % 2147483647) / 2147483647;
      const series = k => {
        const r = seed(k === 'dev' ? 7 : k === 'el' ? 11 : 13), out = [];
        if (k === 'dev') { for (let i = 0; i < 72; i++) { const t = i / 71; const b = t < 0.35 ? 112 + t * 20 : t < 0.6 ? 119 + (t - 0.35) / 0.25 * 46 : t < 0.8 ? 165 - (t - 0.6) * 25 : 160 + (t - 0.8) / 0.2 * 24.5; out.push(b + (r() - 0.5) * 3); } out[71] = 184.5; }
        else if (k === 'el') { for (let i = 0; i < 72; i++) { const t = i / 71; const b = -0.4 + Math.sin(t * 9) * 0.35 + Math.pow(Math.max(0, t - 0.55) / 0.45, 1.8) * 4.6; out.push(b + (r() - 0.5) * 0.25); } out[71] = 4.69; }
        else { for (let i = 0; i < 96; i++) { const hr = i / 4; const b = 190 - 120 * Math.exp(-Math.pow((hr - 12.5) / 2.6, 2)) + 260 * Math.exp(-Math.pow((hr - 19) / 1.3, 2)) - 20 * Math.exp(-Math.pow((hr - 4) / 2, 2)); out.push(b + (r() - 0.5) * 14); } }
        return out;
      };
      const fmt = (k, v) => k === 'dev' ? v.toFixed(1) : k === 'el' ? (v >= 0 ? '+' : '') + v.toFixed(2) + '°C' : 'R$' + Math.round(v);
      this.MktChart = function MktChart({ kind }) {
        const base = React.useMemo(() => series(kind), [kind]);
        const rm = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
        const [t, setT] = React.useState(rm ? 1e6 : 0);
        React.useEffect(() => { if (rm) return; setT(0); const id = setInterval(() => { if (!document.hidden) setT(x => x + 1); }, 700); return () => clearInterval(id); }, [kind]);
        const N = base.length; let pts = base.slice(), n = N;
        if (kind === 'pw') { pts[N - 1] = base[N - 1] + (t ? Math.sin(t * 0.9) * 4 : 0); }
        else { const j = t ? Math.abs(Math.sin(t * 1.7) * 0.5 + Math.sin(t * 0.63) * 0.5) : 0; pts[N - 1] = base[N - 1] - j * (kind === 'dev' ? 0.6 : 0.04); }
        const lo = Math.min(...base) , hi = Math.max(...base), pad = (hi - lo) * 0.12, y0 = lo - pad, y1 = hi + pad;
        const X = i => i / (N - 1) * 100, Y = v => (1 - (v - y0) / (y1 - y0)) * 100;
        const vis = pts.slice(0, n), d = vis.map((v, i) => (i ? 'L' : 'M') + X(i).toFixed(2) + ' ' + Y(v).toFixed(2)).join(' ');
        const last = vis[vis.length - 1], lx = X(vis.length - 1), ly = Y(last);
        const grid = [0.25, 0.5, 0.75].map(f => e('line', { key: 'g' + f, x1: 0, x2: 100, y1: f * 100, y2: f * 100, stroke: 'var(--t1)', strokeOpacity: 0.06, strokeWidth: 1, vectorEffect: 'non-scaling-stroke' }));
        const ax = [0.25, 0.75].map(f => e('span', { key: 'a' + f, style: { position: 'absolute', right: 0, top: (f * 100) + '%', transform: 'translateY(-130%)', fontFamily: mono, fontSize: 10, color: 'var(--t4)' } }, fmt(kind, y1 - f * (y1 - y0))));
        const xl = kind === 'pw' ? ['00:00', '06:00', '12:00', '18:00', '24:00'] : kind === 'dev' ? ['2021', '2022', '2023', '2024', '2025', '2026'] : ['APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP'];
        return e('div', { style: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', gap: 6 } }, [
          e('div', { key: 'p', style: { position: 'relative', flex: 1, minHeight: 0 } }, [
            e('svg', { key: 's', viewBox: '0 0 100 100', preserveAspectRatio: 'none', 'aria-hidden': 'true', style: { position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' } }, [
              e('defs', { key: 'd' }, e('linearGradient', { id: 'dxMk' + kind, x1: 0, y1: 0, x2: 0, y2: 1 }, [e('stop', { key: 1, offset: 0, stopColor: 'var(--t1)', stopOpacity: 0.12 }), e('stop', { key: 2, offset: 1, stopColor: 'var(--t1)', stopOpacity: 0 })])),
              ...grid,
              e('path', { key: 'f', d: d + ' L' + lx.toFixed(2) + ' 100 L0 100 Z', fill: 'url(#dxMk' + kind + ')' }),
              e('path', { key: 'l', d, fill: 'none', stroke: 'var(--t1)', strokeOpacity: 0.9, strokeWidth: 1.6, strokeLinejoin: 'round', strokeLinecap: 'round', vectorEffect: 'non-scaling-stroke', style: { filter: 'drop-shadow(0 0 3px var(--t1))' } }),
              e('line', { key: 'h', x1: 0, x2: 100, y1: ly, y2: ly, stroke: 'var(--t1)', strokeOpacity: 0.18, strokeWidth: 1, strokeDasharray: '3 4', vectorEffect: 'non-scaling-stroke' })
            ]),
            ...ax,
            e('span', { key: 'dot', style: { position: 'absolute', left: lx + '%', top: ly + '%', width: 9, height: 9, margin: '-4.5px 0 0 -4.5px', borderRadius: '50%', background: 'var(--t1)', boxShadow: '0 0 0 4px color-mix(in srgb,var(--t1) 14%,transparent), 0 0 12px var(--t1)', transition: 'top .6s ease' } }),
            e('span', { key: 'tag', style: { position: 'absolute', top: ly + '%', ...(lx > 70 ? { right: (100 - lx) + '%', marginRight: 12 } : { left: lx + '%', marginLeft: 12 }), transform: 'translateY(-50%)', height: 20, padding: '0 7px', display: 'flex', alignItems: 'center', borderRadius: 4, background: 'var(--t1)', color: 'var(--bg)', fontFamily: mono, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', transition: 'top .6s ease' } }, fmt(kind, kind === 'pw' ? last : base[N - 1]))
          ]),
          e('div', { key: 'x', style: { display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 10, letterSpacing: '0.08em', color: 'var(--t4)' } }, xl.map(s => e('span', { key: s }, s)))
        ]);
      };
    }
    return React.createElement(this.MktChart, { kind });
  }
  railSecs() { const pre = { development: '01 ', elnino: '02 ', power: '03 ' }[this.state.sec] || '01 '; return [...document.querySelectorAll('section[data-screen-label^="' + pre + '"]')].filter(s => !/Hero$/.test(s.dataset.screenLabel) && s.offsetParent !== null); }
  railSync() {
    const n = this.railSecs().length;
    if (n !== (this.state.railN || 0)) this.setState({ railN: n });
  }
  railFx() {
    const nav = document.querySelector('[data-rail]'); if (!nav) return;
    this.railSync();
    const secs = this.railSecs(), vh = window.innerHeight, pin = document.querySelector('[data-story]');
    const pinOn = pin && pin.offsetParent !== null && pin.getBoundingClientRect().bottom > vh * 0.6;
    let room = true; const c0 = document.querySelector('[data-mkt], [data-card]'); if (c0) { const nr = nav.getBoundingClientRect(), cl = c0.getBoundingClientRect().left; room = nr.width ? cl - (10 + nr.width) >= 16 : true; }
    const show = window.innerWidth >= 1100 && secs.length > 1 && !pinOn && room;
    nav.style.opacity = show ? '1' : '0'; nav.style.pointerEvents = show ? 'auto' : 'none';
    let a = 0; secs.forEach((s, i) => { if (s.getBoundingClientRect().top < vh * 0.45) a = i; });
    nav.querySelectorAll('[data-rail-i]').forEach(b => { const on = +b.dataset.railI === a; b.style.color = on ? 'var(--t1)' : ''; b.style.background = on ? 'var(--line)' : 'transparent'; b.setAttribute('aria-current', on ? 'true' : 'false'); });
  }
  sparks() {
    const rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches, NS = 'http://www.w3.org/2000/svg';
    document.querySelectorAll('[data-spark]:not([data-sk])').forEach(el => {
      el.dataset.sk = '1'; const k = el.dataset.spark;
      const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 160 40'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('preserveAspectRatio', 'none');
      Object.assign(svg.style, { display: 'block', width: '100%', maxWidth: '200px', height: '36px', overflow: 'visible' });
      const add = (t, at) => { const n = document.createElementNS(NS, t); for (const x in at) n.setAttribute(x, at[x]); svg.appendChild(n); return n; };
      add('line', { x1: 0, y1: 39.5, x2: 160, y2: 39.5, stroke: 'var(--t1)', 'stroke-opacity': .12, 'stroke-width': 1, 'vector-effect': 'non-scaling-stroke' });
      const lines = [], bars = [];
      const line = (d, red) => lines.push(add('path', { d, fill: 'none', stroke: red ? 'var(--red)' : 'var(--t1)', 'stroke-opacity': red ? .55 : .85, 'stroke-width': 1.4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke', style: 'filter:drop-shadow(0 0 3px ' + (red ? 'var(--red)' : 'var(--t1)') + ')' }));
      const dot = (x, y, red) => add('circle', { cx: x, cy: y, r: 2.2, fill: red ? 'var(--red)' : 'var(--t1)', 'fill-opacity': red ? .7 : 1, style: 'opacity:0;transition:opacity .4s ease 1.1s' });
      const bar = (x, w, hgt, red, o) => bars.push(add('rect', { x, y: 39 - hgt, width: w, height: hgt, rx: 1, fill: red ? 'var(--red)' : 'var(--t1)', 'fill-opacity': o ?? (red ? .4 : .8), style: 'transform-box:fill-box;transform-origin:50% 100%' }));
      let dots = [];
      if (k === 'rise') { line('M0 34 L18 33 L34 30 L50 31 L66 26 L82 24 L98 25 L114 17 L130 14 L146 9 L160 5'); dots.push(dot(160, 5)); }
      if (k === 'fall') { line('M0 6 L24 9 L48 12 L72 18 L96 22 L120 28 L144 31 L160 34'); dots.push(dot(0, 6), dot(160, 34, true)); }
      if (k === 'spike') { line('M0 32 L30 31 L50 30 L64 28 L76 20 L88 6 L100 18 L112 24 L130 25 L160 25'); line('M84 12 L88 6 L92 12', true); dots.push(dot(88, 6, true)); }
      if (k === 'b51' || k === 'b88') { const u = k === 'b51' ? 51 : 88; bar(0, 160 * (100 - u) / 100 - 2, 14, false, .8); bar(160 * (100 - u) / 100 + 2, 160 * u / 100 - 2, 14, true, .35); bars.forEach(b => { b.setAttribute('y', 13); b.style.transformOrigin = '0 50%'; }); add('text', { x: 0, y: 40, fill: 'var(--t4)', style: "font:9px 'JetBrains Mono',monospace;letter-spacing:.1em" }).textContent = 'INSURED'; const t = add('text', { x: 160, y: 40, 'text-anchor': 'end', fill: 'var(--t3)', style: "font:9px 'JetBrains Mono',monospace;letter-spacing:.1em" }); t.textContent = 'UNINSURED'; svg.querySelector('line').remove(); }
      if (k === 's90') { svg.querySelector('line').remove(); bar(0.5, 143, 13, false, 0); bars[0].setAttribute('y', 13.5); bars[0].setAttribute('stroke', 'var(--t1)'); bars[0].setAttribute('stroke-opacity', '.8'); bars[0].setAttribute('vector-effect', 'non-scaling-stroke'); bar(146, 14, 14, false, 1); bars[1].setAttribute('y', 13); bars.forEach(b => b.style.transformOrigin = '0 50%'); add('text', { x: 0, y: 40, fill: 'var(--t4)', style: "font:9px 'JetBrains Mono',monospace;letter-spacing:.1em" }).textContent = 'OTC 90'; const t2 = add('text', { x: 160, y: 40, 'text-anchor': 'end', fill: 'var(--t3)', style: "font:9px 'JetBrains Mono',monospace;letter-spacing:.1em" }); t2.textContent = 'EXCHANGE 10'; }
      if (k === 'b11') { [[0, 3], [56, 12], [112, 33]].forEach(([x, v], i) => bar(x, 44, v, i === 2 && false, i === 2 ? 1 : .5)); }
      lines.forEach(p => { const len = p.getTotalLength ? 400 : 0; p.style.strokeDasharray = len; p.style.strokeDashoffset = rm ? 0 : len; });
      bars.forEach(b => { b.style.transform = rm ? 'none' : (b.style.transformOrigin === '0 50%' ? 'scaleX(0)' : 'scaleY(0)'); });
      const host = el.parentElement.dataset.card ? el : el.parentElement; host.insertAdjacentElement('afterend', svg);
      const run = () => { lines.forEach(p => { p.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)'; p.style.strokeDashoffset = 0; }); bars.forEach((b, i) => { b.style.transition = 'transform .9s cubic-bezier(.2,.7,.2,1) ' + (i * 0.15) + 's'; b.style.transform = 'none'; }); dots.forEach(d => d.style.opacity = 1); };
      if (rm) return run();
      const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); requestAnimationFrame(() => requestAnimationFrame(run)); } }, { threshold: 0.4 }); io.observe(svg);
    });
  }
  revealEl(el) {
    el.style.opacity = '1'; el.style.transform = 'translateY(0)';
    setTimeout(() => { el.dataset.rv = '1'; el.style.transition = 'transform .3s ease, box-shadow .3s ease'; el.style.transform = ''; }, 1300);
  }
  setNums(el, k) {
    const tn = el.firstChild; if (!tn || tn.nodeType !== 3) return;
    const o = el.dataset.orig || (el.dataset.orig = tn.nodeValue);
    tn.nodeValue = o.replace(/\d[\d,]*(\.\d+)?/g, m => { const dec = (m.split('.')[1] || '').length, v = parseFloat(m.replace(/,/g, '')) * k, s = v.toFixed(dec); return m.includes(',') ? Number(s).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : s; });
  }
  countUp(el) {
    const t0 = performance.now(), D = 1400;
    const st = now => { const p = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - p, 3); this.setNums(el, e); if (p < 1) requestAnimationFrame(st); };
    requestAnimationFrame(st);
  }
  phoneFx() {
    const vw = window.innerWidth, ph = vw < 640;
    document.querySelectorAll('[data-story-step] > span:first-child').forEach(sp => { if (sp.dataset.fs0 == null) sp.dataset.fs0 = sp.style.fontSize; sp.style.fontSize = sp.dataset.fs0; if (!ph) return; const max = (sp.parentElement.parentElement.clientWidth || vw) - 8; let fs = parseFloat(getComputedStyle(sp).fontSize); let g = 0; while (sp.scrollWidth > max && fs > 24 && g++ < 40) { fs -= 2; sp.style.fontSize = fs + 'px'; } });
    document.querySelectorAll('[data-hero-art] [data-chip]').forEach(g => {
      const k = g.getAttribute('data-chip'); g.style.display = ph && /2$/.test(k) ? 'none' : '';
      g.removeAttribute('transform'); if (!ph || g.style.display === 'none') return;
      const svg = g.ownerSVGElement, m = svg && svg.getScreenCTM(); if (!m || !m.a) return;
      const r = g.getBoundingClientRect(); if (!r.width) return; let dx = 0;
      if (r.right > vw - 8) dx = vw - 8 - r.right; if (r.left + dx < 8) dx = 8 - r.left;
      if (dx) g.setAttribute('transform', 'translate(' + (dx / m.a).toFixed(1) + ' 0)');
    });
  }
  fixPx() {
    try { this.phoneFx(); } catch (e) {}
    document.querySelectorAll('text[data-px]').forEach(t => { const svg = t.ownerSVGElement, m = svg && svg.getScreenCTM(); if (!m || !m.a) return; const fs = (+t.getAttribute('data-px') / m.a).toFixed(2) + 'px'; if (t.style.fontSize !== fs) t.style.fontSize = fs; });
  }
  tickStart() {
    if (this.tickT) return;
    this.tickT = setInterval(() => {
      document.querySelectorAll('[data-hero-art] [data-tick]').forEach(el => {
        const d = el.dataset, svg = el.ownerSVGElement, tm = svg && svg.getCurrentTime ? svg.getCurrentTime() % 10 : 5;
        const a0 = d.tickFrom != null ? +d.tickFrom : 164.4, a1 = d.tickTo != null ? +d.tickTo : 184.5, dec = d.tickDec != null ? +d.tickDec : 1;
        const u = Math.min(1, Math.max(0, tm / 4.5)), v = (a0 + (a1 - a0) * u).toFixed(dec);
        const txt = (d.tickPre != null ? d.tickPre : 'INPUT COSTS ') + v + (d.tickSuf || '');
        if (el.textContent !== txt) el.textContent = txt;
      });
    }, 120);
  }
  storyFx() {
    const rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches, vh = window.innerHeight || 800;
    document.querySelectorAll('[data-story]').forEach(root => {
      const pin = root.firstElementChild, r = root.getBoundingClientRect(), run = Math.max(1, r.height - pin.offsetHeight);
      const p = Math.min(1, Math.max(0, (72 - r.top) / run)), art = root.querySelector('[data-hero-art]'), cue = root.querySelector('[data-hero-cue]'), bar = root.querySelector('[data-story-prog]');
      const steps = root.querySelectorAll('[data-story-step]'), N = steps.length, A = 0.08, seg = (1 - A) / N;
      const sm = x => x * x * (3 - 2 * x), cl = x => Math.min(1, Math.max(0, x));
      if (art) { art.style.opacity = (1 - 0.75 * sm(cl(p / A))).toFixed(3); art.style.transform = ''; }
      if (cue) cue.style.opacity = Math.max(0, 1 - p * 12).toFixed(3);
      root.style.setProperty('--lbl', (1 - sm(cl(p / (A * 0.8)))).toFixed(3));
      if (bar) bar.style.transform = 'scaleY(' + p.toFixed(4) + ')';
      steps.forEach((el, i) => {
        const t = (p - A - i * seg) / seg, last = i === N - 1, fi = cl(t / 0.3), fo = last ? 1 : 1 - cl((t - 0.7) / 0.3), o = t < 0 ? 0 : sm(fi) * sm(fo);
        const s = rm ? 1 : t < 0.3 ? 0.92 + 0.08 * sm(fi) : last ? 1 : 1 + 0.06 * (1 - sm(fo));
        el.style.opacity = o.toFixed(3); el.style.transform = 'scale(' + s.toFixed(4) + ')';
      });
    });
  }
  heroFx() {
    this.storyFx(); this.railFx();
    const art = document.querySelector('[data-hero-art]'), fb = document.querySelector('[data-first-block]'), cue = document.querySelector('[data-hero-cue]');
    const rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const y = window.scrollY || 0, vh = window.innerHeight || 800, H = art ? art.parentElement.offsetHeight : vh, p = Math.min(1, Math.max(0, y / H));
    if (rm) { [art, fb, cue].filter(el => el && !el.closest('[data-story]')).forEach(el => { if (el) { el.style.transform = el === cue ? 'translateX(-50%)' : ''; el.style.opacity = ''; } }); return; }
    if (art && !art.closest('[data-story]')) { art.style.transform = 'translateY(' + (-p * H * 0.1).toFixed(1) + 'px) scale(' + (1 - 0.1 * p).toFixed(4) + ')'; art.style.opacity = (1 - 0.8 * p).toFixed(3); }
    if (cue && !cue.closest('[data-story]')) cue.style.opacity = Math.max(0, 1 - p * 4).toFixed(3);
    if (fb) { const shift = this.fbShift || 0, top = fb.getBoundingClientRect().top - shift, q = Math.min(1, Math.max(0, (vh - top) / (vh * 0.5))); this.fbShift = (1 - q) * 72; fb.style.transform = 'translateY(' + this.fbShift.toFixed(1) + 'px)'; fb.style.opacity = (0.08 + 0.92 * q).toFixed(3); }
  }
  fitHero() {
    const svg = document.querySelector('[data-hero-art] svg'); if (!svg) return; if (svg.getAttribute('data-fit')) return this.measureHero();
    const m = svg.getScreenCTM(); if (!m || !svg.getBoundingClientRect().width) return;
    const inv = m.inverse(), pt = svg.createSVGPoint(), rects = [];
    svg.querySelectorAll('line,rect,circle,ellipse,path,polygon,polyline,text').forEach(el => {
      if (el.closest('defs')) return; const b = el.getBoundingClientRect(); if (!b.width && !b.height) return;
      pt.x = b.left; pt.y = b.top; const a = pt.matrixTransform(inv); pt.x = b.right; pt.y = b.bottom; const c = pt.matrixTransform(inv);
      rects.push({ x0: Math.min(a.x, c.x), y0: Math.min(a.y, c.y), x1: Math.max(a.x, c.x), y1: Math.max(a.y, c.y) });
    });
    const longs = rects.filter(q => q.x1 - q.x0 > 1500), gys = longs.map(q => (q.y0 + q.y1) / 2);
    let X0 = Infinity, Y0 = Infinity, X1 = -Infinity, Y1 = -Infinity;
    rects.forEach(q => {
      const w = q.x1 - q.x0, hh = q.y1 - q.y0;
      if (w > 1500) { Y0 = Math.min(Y0, q.y0); Y1 = Math.max(Y1, q.y1); return; }
      if (w <= 24 && hh <= 24 && gys.some(g => q.y0 >= g - 2 && q.y1 <= g + 18)) return;
      X0 = Math.min(X0, q.x0); Y0 = Math.min(Y0, q.y0); X1 = Math.max(X1, q.x1); Y1 = Math.max(Y1, q.y1);
    });
    if (!isFinite(X0)) return;
    const pw = (X1 - X0) * 0.03, ph = (Y1 - Y0) * 0.04;
    svg.setAttribute('viewBox', [X0 - pw, Y0 - ph, X1 - X0 + pw * 2, Y1 - Y0 + ph * 2].map(v => v.toFixed(1)).join(' '));
    svg.setAttribute('data-fit', '1'); this.measureHero();
  }
  measureHero() {
    const svg = document.querySelector('[data-hero-art] svg[data-fit]'); if (!svg) return; const vb = svg.viewBox.baseVal; if (!vb || !vb.width || !svg.clientWidth) return;
    const s = Math.min(svg.clientWidth / vb.width, svg.clientHeight / vb.height); if (s > 0 && Math.abs(s - (this.hs || 0)) / s > 0.03) { this.hs = s; this.forceUpdate(); }
  }
  draw() {
    const rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('svg[data-draw]:not([data-drawn])').forEach(svg => {
      svg.setAttribute('data-drawn', '1'); if (rm || !svg.animate) return;
      const hero = !!svg.closest('[data-hero-art]');
      if (hero && svg.pauseAnimations) { try { svg.pauseAnimations(); svg.setCurrentTime(0); } catch (e) {} setTimeout(() => { try { svg.unpauseAnimations(); } catch (e) {} }, 2550); }
      const els = svg.querySelectorAll('[data-s]'), n = els.length || 1, span = +svg.getAttribute('data-draw') || 1600;
      els.forEach((el, i) => el.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: hero ? 800 : 900, delay: (i / n) * span, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'backwards' }));
      svg.querySelectorAll('[data-f]').forEach(el => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, delay: span * 0.6 + 300, fill: 'backwards' }));
    });
  }
  go(id, fromNav) {
    if (id === this.state.sec) return;
    clearTimeout(this.ft); clearTimeout(this.ft2); this.pendSec = id;
    const top0 = () => { const se = document.scrollingElement || document.documentElement; try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); } catch (e) { window.scrollTo(0, 0); } se.scrollTop = 0; document.body.scrollTop = 0; };
    this.setState({ vis: 0, dd: false, menu: false });
    this.ft = setTimeout(() => {
      if (!fromNav) { try { history.pushState(null, '', '#' + id); } catch (e) { try { history.replaceState(null, '', '#' + id); } catch (e2) {} } }
      this.cio && this.cio.disconnect(); this.cio = null;
      top0();
      this.setState({ sec: id, vis: 1, tab: 0, sub: 0, railN: 0 }, () => {
        top0(); this.pendSec = null;
        requestAnimationFrame(() => { top0(); try { this.contentFx(); this.storyFx(); this.railFx(); this.fixPx(); } catch (e) {} this.onScroll && this.onScroll(); });
        this.ft2 = setTimeout(() => { const want = { development: '01 Hero', elnino: '02 Hero', power: '03 Hero' }[this.state.sec], hs = [...document.querySelectorAll('section[data-screen-label$="Hero"]')].map(s => s.dataset.screenLabel); if (hs.length !== 1 || hs[0] !== want) this.forceUpdate(); if ((window.scrollY || 0) > 0 && !this.userScrolled) top0(); }, 120);
      });
    }, 160);
  }
  mk(sw, fid, flip) {
    const h = React.createElement, a = [], fa = [], ta = []; let i = 0;
    const B = o => ({ fill: 'none', stroke: 'var(--t1)', strokeWidth: sw, strokeOpacity: o, pathLength: 1, strokeDasharray: '1', strokeLinecap: 'round', 'data-s': '' });
    const fs = 10 * Math.max(1, sw * 0.8), isHero = ['dxGlowHero', 'dxGlowElH', 'dxGlowPwH'].includes(fid);
    const u = 1 / (this.hs || 0.6), cfs = 11.5 * u, CH = 24 * u, ccw = cfs * 0.66;
    const chip = (k, txt, ax, ay, tx, ty, right, o = {}) => {
      const w = 34 * u + txt.length * ccw, x = right ? tx - w : tx, lx = right ? tx - 14 * u : tx + 14 * u, up = ay > ty + CH / 2, ey = up ? ty + CH : ty, dc = o.red ? 'var(--red)' : 'var(--t1)';
      return h('g', { key: 'tg' + k, 'data-chip': k, style: { opacity: 'var(--lbl,1)' } }, [
        h('circle', { key: 'h', cx: ax, cy: ay, r: 5 * u, style: { fill: dc, fillOpacity: 0.14 } }),
        h('circle', { key: 'd', cx: ax, cy: ay, r: 2 * u, style: { fill: dc, fillOpacity: 0.85 } }),
        h('path', { key: 'ld', d: 'M' + ax + ' ' + ay + ' L' + lx + ' ' + (up ? ey + 8 * u : ey - 8 * u) + ' V' + ey, style: { fill: 'none', stroke: 'var(--t1)', strokeOpacity: 0.5, strokeWidth: u, filter: 'drop-shadow(0 0 ' + 3 * u + 'px var(--t1))' } }),
        h('rect', { key: 'b', x, y: ty, width: w, height: CH, rx: CH / 2, style: { fill: 'var(--chip-bg)', stroke: 'var(--chip-line)', strokeWidth: u } }),
        h('circle', { key: 'cd', cx: x + 13 * u, cy: ty + CH / 2, r: 2.5 * u, style: { fill: dc, fillOpacity: o.red ? 0.9 : 0.7 } }),
        h('text', { key: 't', x: x + 22 * u, y: ty + CH / 2 + cfs * 0.36, ...(o.tick || {}), style: { fontFamily: "'JetBrains Mono',monospace", fontSize: cfs, letterSpacing: '0.06em', fill: 'var(--t1)', fillOpacity: 0.88 } }, txt),
      ]);
    };
    return {
      chip, u, cfs, CH, ccw,
      h, B, raw: e => a.push(e), rawF: e => fa.push(e), mark: () => a.length,
      wrap: (from, props, kids) => { const els = a.splice(from); a.push(h('g', { key: 'w' + i++, ...props }, els.concat(kids || []))); },
      l: (x1, y1, x2, y2, o = 0.85) => a.push(h('line', { key: 'l' + i++, x1, y1, x2, y2, ...B(o) })),
      r: (x, y, wd, ht, o = 0.85) => a.push(h('rect', { key: 'r' + i++, x, y, width: wd, height: ht, ...B(o) })),
      p: (d, o = 0.85) => a.push(h('path', { key: 'p' + i++, d, ...B(o) })),
      c: (cx, cy, rr, o = 0.85) => a.push(h('circle', { key: 'c' + i++, cx, cy, r: rr, ...B(o) })),
      pg: (points, o = 0.85) => a.push(h('polygon', { key: 'g' + i++, points, ...B(o) })),
      f: (x, y, wd, ht, red) => fa.push(h('rect', { key: 'f' + i++, x, y, width: wd, height: ht, fill: red ? 'var(--red)' : 'var(--t1)', fillOpacity: red ? 0.26 : 0.16, filter: red ? (isHero ? 'url(#dxEmber)' : undefined) : 'url(#' + fid + ')', 'data-f': '' })),
      pf: (points, fill, op, glow) => fa.push(h('polygon', { key: 'q' + i++, points, fill, fillOpacity: op, filter: glow ? 'url(#' + fid + ')' : undefined, style: { transition: 'fill-opacity .45s ease' }, 'data-f': '' })),
      t: (x, y, s, an) => (flip ? ta : a).push(h('text', { key: 't' + i++, x: flip ? 1200 - x : x, y, textAnchor: flip ? ({ start: 'end', end: 'start' }[an || 'start'] || an) : (an || 'start'), fill: 'var(--t4)', 'data-f': '', style: { fontFamily: "'JetBrains Mono',monospace", fontSize: fs, letterSpacing: '0.1em', opacity: 'var(--lbl,1)' } }, s)),
      out: (vb, span, maxW, fill) => h('svg', { viewBox: vb, width: '100%', preserveAspectRatio: fill ? (this.heroPar || 'xMidYMax meet') : 'xMidYMid meet', style: fill ? { display: 'block', width: '100%', height: '100%', overflow: 'visible', filter: 'var(--stroke-glow)' } : { display: 'block', height: 'auto', overflow: 'visible', maxWidth: maxW || 'none', margin: '0 auto' }, 'data-draw': span, 'aria-hidden': 'true' },
        [h('defs', { key: 'df' }, isHero ? h('filter', { key: 'em', id: 'dxEmber', x: '-60%', y: '-60%', width: '220%', height: '220%' }, h('feGaussianBlur', { stdDeviation: 7, result: 'b' }), h('feMerge', null, h('feMergeNode', { in: 'b' }), h('feMergeNode', { in: 'b' }), h('feMergeNode', { in: 'SourceGraphic' }))) : null, h('filter', { key: 'gl', id: fid, x: '-50%', y: '-50%', width: '200%', height: '200%' }, h('feGaussianBlur', { stdDeviation: 5, result: 'b' }), h('feMerge', null, h('feMergeNode', { in: 'b' }), h('feMergeNode', { in: 'SourceGraphic' }))))].concat(flip ? [h('g', { key: 'fg', transform: 'matrix(-1 0 0 1 1200 0)' }, fa.concat(a))] : fa.concat(a), ta)),
    };
  }
  heroSvg(sw) {
    const { l, r, p, c, f, t, out, h, B, raw, rawF, mark, wrap } = this.mk(sw, 'dxGlowHero');
    const G = 548, X = i => 680 + i * 80, Y = j => 548 - j * 68, wins = [];
    const rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches, DUR = '10s';
    const an = (attributeName, values, keyTimes, extra) => rm ? null : h('animate', { key: 'a' + attributeName, attributeName, values, keyTimes, dur: DUR, repeatCount: 'indefinite', ...extra });
    const ease = { calcMode: 'spline', keySplines: '.4 0 .2 1;0 0 1 1;.4 0 .2 1' };
    const mono = { fontFamily: "'JetBrains Mono',monospace", fontSize: 10 * Math.max(1, sw * 0.8), letterSpacing: '0.1em', fill: 'var(--t4)' };
    const mono11 = { ...mono, fontSize: 11 * sw / 0.95, letterSpacing: '0.08em' };
    const CX0 = 180, CX1 = 1590, BY = 420, NP = 30, CW = CX1 - CX0 + 8;
    const cpts = Array.from({ length: NP }, (_, k) => { const u = k / (NP - 1); return [+(CX0 + u * (CX1 - CX0)).toFixed(1), +(BY - 300 * Math.pow(u, 1.3) + u * (12 * Math.sin(k * 1.7) + 6 * Math.sin(k * 0.9))).toFixed(1)]; });
    const cd = 'M' + cpts.map(q => q.join(' ')).join(' L');
    raw(h('g', { key: 'chart', 'aria-hidden': 'true', mask: 'url(#dxChartMask)' }, [
      h('defs', { key: 'cdf' }, [
        h('pattern', { key: 'pt', id: 'dxHatchDev', width: 7, height: 7, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, h('line', { x1: 0, y1: 0, x2: 0, y2: 7, style: { stroke: 'var(--red)', strokeOpacity: 0.55, strokeWidth: 1 } })),
        h('clipPath', { key: 'cp', id: 'dxChartClip' }, h('rect', { x: CX0 - 4, y: 60, width: rm ? CW : 0, height: 380 }, an('width', '0;' + CW + ';' + CW + ';' + CW, '0;0.6;0.85;1', { calcMode: 'spline', keySplines: '.45 0 .55 1;0 0 1 1;0 0 1 1' }))),
        h('mask', { key: 'mk', id: 'dxChartMask', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 1800, height: 600 }, [h('rect', { key: 'm1', x: 0, y: 0, width: 1800, height: 600, fill: '#fff' }), h('rect', { key: 'm2', x: 656, y: 100, width: 524, height: 460, fill: '#000' })]),
      ]),
      h('line', { key: 'bud', x1: CX0, y1: BY, x2: CX1, y2: BY, style: { fill: 'none', stroke: 'var(--t1)', strokeOpacity: 0.7, strokeWidth: sw * 1.2, strokeDasharray: '7 7' } }),
      h('text', { key: 'budt', 'data-px': 11, x: CX0, y: BY + 10, dominantBaseline: 'hanging', style: { ...mono11, opacity: 'var(--lbl,1)', fill: 'var(--t2)' } }, 'BUDGET SET DAY ONE'),
      h('g', { key: 'live' }, [
        an('opacity', '1;1;0;0', '0;0.85;0.97;1'),
        h('g', { key: 'clip', clipPath: 'url(#dxChartClip)' }, [
          h('polygon', { key: 'gap', points: cpts.map(q => q.join(',')).join(' ') + ' ' + CX1 + ',' + BY + ' ' + CX0 + ',' + BY, fill: 'url(#dxHatchDev)', filter: 'url(#dxEmber)' }),
          h('path', { key: 'cost', d: cd, style: { fill: 'none', stroke: 'var(--t1)', strokeOpacity: 1, strokeWidth: sw * 1.7, strokeLinejoin: 'round', strokeLinecap: 'round', filter: 'drop-shadow(0 0 4px var(--t1))' } }),
        ]),
        h('text', { key: 'gapt', 'data-px': 11, x: 1400, y: 350, textAnchor: 'middle', style: { ...mono11, opacity: 'var(--lbl,1)', fill: 'var(--red)', opacity: rm ? 0.9 : 0 } }, ['UNHEDGED GAP', an('opacity', '0;0;0.9;0.9;0;0', '0;0.35;0.55;0.85;0.97;1')]),
        h('text', { key: 'costt', 'data-px': 11, x: CX1, y: 96, textAnchor: 'end', style: { ...mono11, opacity: 'var(--lbl,1)', fill: 'var(--t2)', opacity: rm ? 1 : 0 } }, ['MATERIAL COST', an('opacity', '0;0;1;1;0', '0;0.4;0.6;0.85;1')]),
      ]),
    ]));
    l(-2000, G, 3800, G, 0.9);
    for (let x = -1990; x < 3800; x += 16) l(x, G + 2, x - 10, G + 12, 0.2);
    p('M264 548 H382 A10 10 0 0 0 382 528 H264 A10 10 0 0 0 264 548 Z', 0.85);
    for (let x = 270; x <= 376; x += 26.5) c(x, 538, 5, 0.5);
    r(268, 500, 98, 28, 0.85); r(324, 464, 40, 36, 0.85); r(330, 470, 26, 20, 0.4); f(330, 470, 26, 20, false);
    l(272, 512, 266, 512, 0.6);
    p('M278 506 L216 434 L208 444 L270 516', 0.85);
    p('M212 438 L168 468 L176 476 L214 450', 0.85);
    p('M170 466 L154 492 L178 500 L184 476', 0.85);
    l(242, 474, 224, 462, 0.4);
    for (let x = 1200; x <= 1328; x += 32) { l(x, G, x, G - 112, 0.55); r(x - 6, G - 3, 12, 3, 0.5); }
    for (let y = G - 34; y >= G - 102; y -= 34) { l(1168, y, 1334, y, 0.55); r(1170, y - 4, 160, 4, 0.35); }
    l(1168, G - 112, 1334, G - 112, 0.4);
    let zs = 'M1168 ' + G; for (let x = 1200, k = 0; x <= 1328; x += 32, k++) zs += ' L' + x + ' ' + (k % 2 ? G : G - 102); p(zs, 0.3);
    r(1400, G - 70, 164, 58, 0.85); r(1396, G - 76, 172, 6, 0.85);
    r(1406, G - 12, 22, 12, 0.6); r(1536, G - 12, 22, 12, 0.6);
    r(1414, G - 58, 40, 22, 0.45); l(1434, G - 58, 1434, G - 36, 0.3);
    r(1466, G - 58, 40, 22, 0.45); l(1486, G - 58, 1486, G - 36, 0.3); f(1466, G - 58, 40, 22, false);
    r(1530, G - 62, 26, 50, 0.6); l(1550, G - 38, 1552, G - 38, 0.6);
    p('M1564 ' + (G - 12) + ' H1584 V' + (G - 8) + ' H1592 V' + (G - 4) + ' H1600 V' + G, 0.6);
    l(1584, G - 40, 1584, G - 12, 0.5); l(1606, G - 26, 1606, G, 0.5); l(1584, G - 40, 1606, G - 26, 0.5);
    for (let j = 1; j <= 5; j++) r(664, Y(j) - 6, 432, 6, 0.9);
    r(664, Y(6) - 6, 272, 6, 0.9);
    for (let j = 1; j <= 6; j++) for (let i = 0; i < 6; i++) { if (j === 6 && i > 3) continue; const top = Y(j), bot = j === 1 ? G : Y(j - 1) - 6; r(X(i) - 4, top, 8, bot - top, 0.85); }
    [4, 5].forEach(i => { l(X(i) - 2, Y(5) - 6, X(i) - 2, Y(5) - 30, 0.6); l(X(i) + 2, Y(5) - 6, X(i) + 2, Y(5) - 26, 0.6); });
    for (let i = 0; i < 4; i++) { l(X(i) - 2, Y(6) - 6, X(i) - 2, Y(6) - 26, 0.6); l(X(i) + 2, Y(6) - 6, X(i) + 2, Y(6) - 22, 0.6); }
    const hi = { '1-1-0': 'g', '2-3-1': 'g', '3-0-1': 'g', '2-1-1': 'r', '3-4-0': 'g', '1-3-1': 'r' };
    for (let j = 1; j <= 3; j++) for (let b = 0; b < 5; b++) {
      const x0 = X(b) + 4, top = Y(j), bot = j === 1 ? G : Y(j - 1) - 6;
      if (j === 1 && b === 2) { r(x0 + 16, top + 14, 40, bot - top - 14, 0.7); l(x0 + 36, top + 14, x0 + 36, bot, 0.5); continue; }
      for (let k = 0; k < 2; k++) {
        const px = x0 + 4 + k * 34, py = top + 6, ph = bot - top - 12, hv = hi[j + '-' + b + '-' + k];
        if (hv) f(px, py, 30, ph, hv === 'r'); if (hv === 'g') wins.push([px, py, ph]);
        r(px, py, 30, ph, 0.45); l(px, py + ph * 0.62, px + 30, py + ph * 0.62, 0.3);
      }
    }
    [0, 4].forEach(b => { l(X(b) + 4, Y(4), X(b + 1) - 4, Y(3) - 6, 0.5); l(X(b + 1) - 4, Y(4), X(b) + 4, Y(3) - 6, 0.5); });
    for (let b = 1; b <= 3; b++) for (let x = X(b) + 14; x < X(b + 1) - 8; x += 14) l(x, Y(5), x, Y(4) - 6, 0.28);
    for (let b = 0; b <= 2; b++) for (let x = X(b) + 14; x < X(b + 1) - 8; x += 14) l(x, Y(6), x, Y(5) - 6, 0.28);
    l(940, 184, 1096, 184, 0.45); for (let x = 940; x <= 1096; x += 26) l(x, 184, x, 202, 0.4);
    [1104, 1136, 1168].forEach(x => l(x, G, x, 150, 0.55));
    for (let y = G - 34; y >= 150; y -= 34) { l(1098, y, 1174, y, 0.55); l(1084, y, 1104, y, 0.35); }
    let z1 = 'M1136 ' + G, z2 = 'M1104 ' + G;
    for (let y = G, k = 0; y > 160; y -= 34, k++) { z1 += ' L' + (k % 2 ? 1136 : 1168) + ' ' + (y - 34); z2 += ' L' + (k % 2 ? 1104 : 1136) + ' ' + (y - 34); }
    p(z1, 0.45); p(z2, 0.25); l(1098, 150, 1174, 150, 0.55); l(1098, 160, 1174, 160, 0.35);
    const m0 = 620, m1 = 644, mt = 96;
    l(m0, G, m0, mt, 0.9); l(m1, G, m1, mt, 0.9); r(598, G, 68, 12, 0.6);
    let zm = 'M' + m0 + ' ' + G;
    for (let y = G, k = 0; y > mt; y -= 24, k++) { const ny = Math.max(mt, y - 24); zm += ' L' + (k % 2 ? m0 : m1) + ' ' + ny; l(m0, ny, m1, ny, 0.35); }
    p(zm, 0.5);
    r(608, 82, 48, 14, 0.85); r(656, 84, 22, 18, 0.85); f(659, 87, 13, 8, false);
    p('M620 82 L632 22 L644 82', 0.85);
    l(644, 64, 1180, 64, 0.85); l(644, 80, 1180, 80, 0.85); l(1180, 64, 1180, 80, 0.85);
    let zj = 'M644 80'; for (let x = 668, k = 0; x <= 1180; x += 24, k++) zj += ' L' + x + ' ' + (k % 2 ? 80 : 64); p(zj, 0.45);
    l(580, 72, 620, 72, 0.85); l(580, 82, 620, 82, 0.85);
    let zc = 'M580 82'; for (let x = 600, k = 0; x <= 620; x += 20, k++) zc += ' L' + x + ' ' + (k % 2 ? 82 : 72); p(zc, 0.4);
    r(582, 82, 32, 34, 0.85); for (let k = 0; k < 4; k++) l(584, 90 + k * 7, 612, 90 + k * 7, 0.28);
    l(632, 22, 1060, 64, 0.55); l(632, 22, 582, 72, 0.55);
    const warm = an('opacity', '0;0;1;1;0', '0;0.2;0.6;0.85;1');
    wins.forEach(([x, y, hh], k) => rawF(h('rect', { key: 'wr' + k, x, y, width: 30, height: hh, filter: 'url(#dxEmber)', fill: 'var(--red)', fillOpacity: 0.2, opacity: 0 }, warm)));
    r(952, 80, 16, 6, 0.8);
    raw(h('line', { key: 'hoist', x1: 960, y1: 86, x2: 960, y2: 148, ...B(0.7) }, an('y2', '148;104;104;148', '0;0.6;0.85;1', ease)));
    const m0b = mark();
    p('M960 148 L960 156 A5 5 0 1 1 955 161', 0.8);
    l(960, 152, 922, 168, 0.5); l(960, 152, 998, 168, 0.5);
    raw(h('rect', { key: 'beamf', x: 906, y: 168, width: 108, height: 7, fill: 'var(--t1)', fillOpacity: 0.16, filter: 'url(#dxGlowHero)', 'data-f': '' }));
    raw(h('rect', { key: 'beamr', x: 906, y: 168, width: 108, height: 7, filter: 'url(#dxEmber)', fill: 'var(--red)', fillOpacity: 0.3, opacity: 0 }, warm));
    r(906, 168, 108, 7, 0.9);
    wrap(m0b, {}, rm ? [] : [h('animateTransform', { key: 'lift', attributeName: 'transform', type: 'translate', values: '0 0;0 -44;0 -44;0 0', keyTimes: '0;0.6;0.85;1', dur: DUR, repeatCount: 'indefinite', ...ease })]);
    r(404, 532, 110, 8, 0.6); r(410, 524, 98, 8, 0.6); r(416, 516, 86, 8, 0.6);
    r(524, 520, 64, 28, 0.5); for (let k = 1; k < 4; k++) l(524, 520 + k * 7, 588, 520 + k * 7, 0.3);
    const { chip } = this.mk(sw, 'dxGlowHero'), TY = 566;
    const pairA = [chip('a1', 'INPUT COSTS 184.5', 480, 518, 420, TY, false, { tick: { 'data-tick': '1' } }), chip('a2', '+12.2% IN A YEAR', 1264, 540, 1240, TY, false)];
    const pairB = [chip('b1', '10% COST RISE, 41 TO 43% OF PROFIT GONE', 676, 520, 640, TY, true, { red: true }), chip('b2', 'FIXED PRICE BACKLOG 79% TO 91.5%', 1092, 520, 1112, TY, false)];
    raw(h('g', { key: 'tagsA', style: { opacity: rm ? 1 : 0 } }, pairA.concat(rm ? [] : [an('opacity', '0;1;1;0;0', '0;0.05;0.45;0.5;1')])));
    if (!rm) raw(h('g', { key: 'tagsB', style: { opacity: 0 } }, pairB.concat([an('opacity', '0;0;1;1;0', '0;0.49;0.55;0.95;1')])));
    for (let i = 0; i < 6; i++) { c(X(i), 584, 9, 0.5); t(X(i), 587.5, 'ABCDEF'[i], 'middle'); }
    for (let j = 1; j <= 6; j++) t(654, Y(j) + 3, 'L' + j, 'end');
    return out('0 0 1200 600', 1700, null, true);
  }
  splitSvg(sw) {
    const { l, r, p, c, f, t, out } = this.mk(sw, 'dxGlowSplit');
    r(40, 70, 520, 70, 0.85);
    for (let x = 50; x <= 550; x += 40) { c(x, 92, 5, 0.6); c(x, 120, 5, 0.6); }
    for (let x = 56; x < 560; x += 22) l(x, 136, x + 6, 130, 0.18);
    f(292, 156, 16, 144, false);
    p('M220 140 H380 V156 H308 V300 H380 V316 H220 V300 H292 V156 H220 Z', 0.9);
    [270, 310].forEach(x => { r(x - 4, 112, 8, 28, 0.7); r(x - 8, 108, 16, 4, 0.7); });
    p('M442 190 H518 A12 12 0 0 1 530 202 V318 A12 12 0 0 1 518 330 H442 A12 12 0 0 1 430 318 V202 A12 12 0 0 1 442 190 Z', 0.75);
    p('M436 196 L452 212', 0.6);
    [[442, 202], [480, 202], [518, 202], [442, 318], [480, 318], [518, 318]].forEach(([x, y]) => c(x, y, 6, 0.85));
    for (let y = 214; y < 310; y += 24) l(436, y, 524, y, 0.18);
    r(60, 196, 120, 12, 0.6); r(60, 312, 120, 12, 0.6); l(120, 208, 120, 312, 0.6);
    for (let x = 74; x <= 166; x += 23) { c(x, 202, 2.5, 0.5); c(x, 318, 2.5, 0.5); }
    l(40, 362, 560, 362, 0.3); [40, 220, 380, 560].forEach(x => l(x, 356, x, 368, 0.3));
    t(40, 56, 'SLAB'); t(220, 350, 'STEEL BEAM'); t(430, 350, 'REBAR CAGE'); t(60, 186, 'PLATE GIRDER');
    return out('0 0 600 380', 1600, '640px');
  }
  isoSvg(sw, tab) {
    const { l, pg, pf, t, out } = this.mk(sw, 'dxGlowIso');
    const P0 = [210, 70], P1 = [348.6, 150], P2 = [244.7, 210], P3 = [106.1, 130], H = 36;
    const dn = (q, d) => [q[0], q[1] + d], lerp = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
    const pt = arr => arr.map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' ');
    const Q1 = dn(P1, H), Q2 = dn(P2, H), Q3 = dn(P3, H), up = q => dn(q, -56);
    const red = 'var(--red)', wh = 'var(--t1)';
    const o = [[0.24, 0, 0, 0, 0], [0, 0, 0.2, 0, 0], [0, 0.14, 0, 0, 0], [0, 0, 0, 0.14, 0.26]][tab] || [0, 0, 0, 0, 0];
    const top = pt([P0, P1, P2, P3]);
    pf(top, red, o[0]); pf(top, wh, o[1], true); pf(pt([P0, P1, lerp(P1, P2, 0.18), lerp(P0, P3, 0.18)]), wh, o[2], true);
    pf(pt([P3, P2, Q2, Q3]), wh, o[3], true); pf(pt([P1, P2, Q2, Q1]), red, o[4]);
    pg(pt([up(P0), up(P1), up(P2), up(P3)]), 0.3);
    [P0, P1, P2, P3].forEach(q => l(q[0], q[1], q[0], q[1] - 56, 0.18));
    pg(top, 0.9); pg(pt([P3, P2, Q2, Q3]), 0.85); pg(pt([P1, P2, Q2, Q1]), 0.85);
    for (let k = 1; k < 5; k++) { const a = lerp(P0, P3, k / 5), b = lerp(P1, P2, k / 5); l(a[0], a[1], b[0], b[1], 0.3); }
    for (let k = 1; k < 6; k++) { const a = lerp(P0, P1, k / 6), b = lerp(P3, P2, k / 6); l(a[0], a[1], b[0], b[1], 0.3); }
    [Q3, Q2, Q1].forEach(q => { l(q[0] - 4, q[1], q[0] - 4, q[1] + 70, 0.6); l(q[0] + 4, q[1] + 2, q[0] + 4, q[1] + 72, 0.6); });
    l(60, 320, 380, 320, 0.25);
    t(up(P0)[0], up(P0)[1] - 10, 'BUDGET', 'middle'); t(P1[0] + 12, P1[1] + 22, 'INPUT BASKET');
    return out('0 0 420 340', 1400, '460px');
  }
  elHeroSvg(sw) {
    const { l, r, p, c, f, t, out, h, B, raw, rawF, mark, wrap } = this.mk(sw, 'dxGlowElH');
    const SL = 380, wave = (y, a, x0, x1, o) => { let d = 'M' + x0 + ' ' + y; for (let x = x0; x < x1; x += 40) d += ' q10 ' + (-a) + ' 20 0 q10 ' + a + ' 20 0'; p(d, o); };
    const rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches, DUR = '10s';
    const an = (attributeName, values, keyTimes, extra) => rm ? null : h('animate', { key: 'a' + attributeName, attributeName, values, keyTimes, dur: DUR, repeatCount: 'indefinite', ...extra });
    const grow = an('opacity', '0;0;1;1;0', '0;0.15;0.6;0.88;1');
    const fz = 10 * Math.max(1, sw * 0.8), mono = { fontFamily: "'JetBrains Mono',monospace", fontSize: fz, letterSpacing: '0.1em' };
    const BW = 3830, BX = -2000;
    rawF(h('g', { key: 'warm', 'aria-hidden': 'true' }, [
      h('defs', { key: 'd' }, [
        h('pattern', { key: 'pt', id: 'dxHatchEl', width: 7, height: 7, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, h('line', { x1: 0, y1: 0, x2: 0, y2: 7, style: { stroke: 'var(--red)', strokeOpacity: 0.5, strokeWidth: 1 } })),
        h('clipPath', { key: 'cp', id: 'dxWarmClip' }, h('rect', { x: BX, y: SL + 12, width: rm ? BW : 2000, height: 60 }, an('width', '2000;' + BW + ';' + BW + ';2000', '0;0.6;0.88;1', { calcMode: 'spline', keySplines: '.45 0 .55 1;0 0 1 1;.4 0 .2 1' }))),
      ]),
      h('g', { key: 'band', style: { opacity: rm ? 1 : 0 } }, [an('opacity', '0;1;1;0', '0;0.12;0.88;1'),
        h('rect', { key: 'r', x: BX, y: SL + 14, width: BW, height: 46, fill: 'url(#dxHatchEl)', filter: 'url(#dxEmber)', clipPath: 'url(#dxWarmClip)' })]),
      h('text', { key: 'wt', x: 120, y: SL + 42, style: { ...mono, fill: 'var(--red)', opacity: rm ? 0.9 : 0 } }, ['WARM WATER', an('opacity', '0;0;0.9;0.9;0', '0;0.15;0.35;0.88;1')]),
    ]));
    wave(SL, 7, -2000, 830, 0.85); wave(SL + 22, 4, -1980, 830, 0.4); wave(SL + 46, 3, -1960, 830, 0.25); wave(SL + 74, 2, -1940, 830, 0.15);
    p('M-2000 560 L300 560 C500 552 680 556 760 520 C800 500 820 470 836 430', 0.7);
    { let hd = ''; for (let x = -1990; x < 830; x += 18) { const o = x > 760 ? (x - 760) * 1.2 : 0; hd += 'M' + x + ' ' + (566 - o) + ' L' + (x - 10) + ' ' + (576 - o); } p(hd, 0.18); }
    f(453, 318, 14, 10, false); r(453, 318, 14, 10, 0.9);
    p('M444 372 L476 372 L470 392 L450 392 Z', 0.9); l(460, 372, 460, 328, 0.85); l(450, 372, 460, 342, 0.5); l(470, 372, 460, 342, 0.5);
    p('M460 392 Q496 470 468 548', 0.6); r(456, 548, 24, 8, 0.7);
    t(460, 304, 'NIÑO 1+2 BUOY', 'middle');
    const m0 = mark();
    p('M500 366 L750 366 L734 394 L518 394 Z', 0.9); l(512, 380, 742, 380, 0.35);
    for (let k = 0; k < 3; k++) for (let x = 534; x < 684; x += 25) { if (k === 2 && x > 628) continue; r(x, 352 - k * 14, 23, 14, 0.6); }
    r(694, 316, 34, 50, 0.85); r(698, 322, 26, 8, 0.5); r(708, 296, 12, 20, 0.7); l(512, 366, 500, 352, 0.6);
    p('M768 384 l20 -3 M778 392 l16 -2', 0.3);
    wrap(m0, {}, rm ? [] : [h('animateTransform', { key: 'sh', attributeName: 'transform', type: 'translate', values: '-60 0;0 0;0 0;-60 0', keyTimes: '0;0.55;0.88;1', dur: DUR, repeatCount: 'indefinite', calcMode: 'spline', keySplines: '.1 .6 .3 1;0 0 1 1;.4 0 .2 1' })]);
    r(830, 330, 14, 110, 0.85); r(912, 330, 14, 110, 0.85);
    raw(h('line', { key: 'wl', x1: 844, y1: 368, x2: 912, y2: 368, ...B(0.55) }, [an('y1', '368;368;378;378;368', '0;0.3;0.6;0.88;1', { calcMode: 'spline', keySplines: '0 0 1 1;.4 0 .2 1;0 0 1 1;.4 0 .2 1' }), an('y2', '368;368;378;378;368', '0;0.3;0.6;0.88;1', { calcMode: 'spline', keySplines: '0 0 1 1;.4 0 .2 1;0 0 1 1;.4 0 .2 1' })]));
    f(860, 336, 36, 64, false); r(860, 336, 36, 64, 0.9); l(860, 336, 896, 400, 0.5); l(896, 336, 860, 400, 0.5);
    for (let y = 352; y < 400; y += 16) l(860, y, 896, y, 0.3);
    t(878, 318, 'LOCK GATE', 'middle');
    p('M926 340 C956 336 976 356 996 356 L1136 356 C1156 340 1176 302 1200 292 L3800 292', 0.85);
    p('M830 440 L3800 440', 0.4);
    for (let x = 840; x < 3800; x += 18) l(x, 452, x - 10, 462, 0.18);
    const hv = { 1: 1, 3: 1, 4: 1 };
    for (let k = 0; k < 6; k++) { const x0 = 1010 + k * 22, top = 330 - k * 2; if (hv[k]) f(x0 - 3, top, 6, 356 - top, false); rawF(h('rect', { key: 'vr' + k, x: x0 - 3, y: top, width: 6, height: 356 - top, filter: 'url(#dxEmber)', fill: 'var(--red)', fillOpacity: 0.26, opacity: rm ? 1 : 0 }, grow)); l(x0, 356, x0, top, 0.75); p('M' + (x0 - 8) + ' ' + (top + 8) + ' q8 -10 16 0', 0.55); }
    for (let k = 0; k < 6; k++) l(1006 + k * 22, 342 - k, 1026 + k * 22, 342 - k, 0.25);
    t(1065, 380, 'VINEYARD', 'middle');
    const cloud = (x, y, s, o) => p('M' + x + ' ' + y + ' a' + 18 * s + ' ' + 18 * s + ' 0 0 1 ' + 30 * s + ' -18 a' + 26 * s + ' ' + 26 * s + ' 0 0 1 ' + 48 * s + ' 6 a' + 18 * s + ' ' + 18 * s + ' 0 0 1 ' + 24 * s + ' 24 Z', o);
    cloud(60, 170, 1.6, 0.85); cloud(210, 140, 1.2, 0.7); cloud(340, 100, 1, 0.4);
    cloud(996, 190, 1.4, 0.85);
    const fall = rm ? [] : [h('animateTransform', { key: 'fl', attributeName: 'transform', type: 'translate', values: '0 -10;-3 10', dur: '0.9s', repeatCount: 'indefinite' })];
    let m1 = mark();
    for (let x = 1016; x < 1140; x += 28) l(x, 206, x - 8, 236, 0.3);
    wrap(m1, {}, fall);
    m1 = mark();
    for (let x = 1004; x < 1146; x += 9) l(x, 204 + (x % 3) * 4, x - 14, 274 + (x % 3) * 4, 0.4);
    wrap(m1, {}, fall);
    wrap(m1, { style: { opacity: rm ? 1 : 0 } }, rm ? [] : [an('opacity', '0;0;1;1;0', '0;0.2;0.6;0.88;1')]);
    p('M60 254 C160 248 260 236 380 224', 0.3); p('M80 272 C180 266 270 258 360 250', 0.2);
    t(60, 240, 'TRADE WINDS');
    {
      const { chip } = this.mk(sw, 'dxGlowElH'), tag = (k, txt, ax, ay, tx, ty, right, tick, red) => chip(k, txt, ax, ay, tx, ty, right, { tick, red });
      const pairA = [
        tag('a1', 'NIÑO 1+2 SEP 2026 +4.69°C', 460, 292, 470, 236, false, { 'data-tick': '1', 'data-tick-pre': 'NIÑO 1+2 SEP 2026 +', 'data-tick-from': '3.20', 'data-tick-to': '4.69', 'data-tick-dec': '2', 'data-tick-suf': '°C' }),
        tag('a2', 'PERU GRAPES 2023/24 ABOUT 30% DOWN', 1120, 360, 1192, 398, true, null, true),
      ];
      const pairB = [
        tag('b1', '$112BN UNINSURED DISASTER DAMAGE, 2025', 246, 124, 160, 56, false),
        tag('b2', 'PANAMA CANAL TOLLS DOWN ABOUT $169M, FY2024', 878, 294, 980, 236, true),
      ];
      raw(h('g', { key: 'tagsA', style: { opacity: rm ? 1 : 0 } }, pairA.concat(rm ? [] : [an('opacity', '0;1;1;0;0', '0;0.05;0.45;0.5;1')])));
      if (!rm) raw(h('g', { key: 'tagsB', style: { opacity: 0 } }, pairB.concat([an('opacity', '0;0;1;1;0', '0;0.49;0.55;0.95;1')])));
    }
    l(40, SL, 40, SL - 8, 0.4); t(50, SL - 16, 'SEA LEVEL');
    return out('0 0 1200 600', 1700, null, true);
  }
  elSplitSvg(sw) {
    const { l, r, p, c, f, t, out } = this.mk(sw, 'dxGlowElS');
    f(76, 150, 8, 160, true);
    p('M70 44 A10 10 0 0 1 90 44 V300 A22 22 0 1 1 70 300 Z', 0.9); c(80, 320, 14, 0.6);
    for (let k = 0; k <= 12; k++) { const y = 60 + k * 20; l(96, y, k % 2 ? 104 : 112, y, 0.6); }
    t(120, 64, '+'); t(120, 304, '−'); t(40, 30, '°C ANOMALY');
    let d = 'M170 80'; for (let x = 170; x < 560; x += 40) d += ' q10 -6 20 0 q10 6 20 0'; p(d, 0.85);
    f(170, 84, 390, 46, false);
    l(170, 130, 560, 130, 0.5); p('M170 250 C300 236 420 210 560 180', 0.85); p('M170 262 C300 250 420 226 560 196', 0.35);
    for (let x = 180; x < 560; x += 26) l(x, 300, x + 8, 292, 0.15);
    l(170, 340, 560, 340, 0.7); l(170, 80, 170, 340, 0.5); l(560, 80, 560, 340, 0.5);
    for (let y = 150; y < 175; y += 8) l(180, y, 550, y, 0.12);
    t(180, 120, 'MIXED LAYER'); t(400, 176, 'THERMOCLINE'); t(180, 330, 'DEEP OCEAN');
    t(170, 362, 'WEST'); t(560, 362, 'EAST', 'end');
    return out('0 0 600 380', 1600, '640px');
  }
  elIsoSvg(sw, tab) {
    const { l, pg, pf, p, t, out } = this.mk(sw, 'dxGlowElI');
    const P0 = [210, 60], P1 = [348.6, 140], P2 = [244.7, 200], P3 = [106.1, 120], H = 90;
    const dn = (q, d) => [q[0], q[1] + d], lerp = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
    const pt = arr => arr.map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' ');
    const Q1 = dn(P1, H), Q2 = dn(P2, H), Q3 = dn(P3, H);
    const red = 'var(--red)', wh = 'var(--t1)';
    const o = [[0.24, 0, 0, 0, 0], [0, 0, 0.2, 0, 0], [0, 0.14, 0, 0, 0], [0, 0, 0, 0.14, 0.26]][tab] || [0, 0, 0, 0, 0];
    const top = pt([P0, P1, P2, P3]);
    pf(top, red, o[0]); pf(top, wh, o[1], true); pf(pt([P3, P2, dn(P2, 22), dn(P3, 22)]), wh, o[2], true);
    pf(pt([P3, P2, Q2, Q3]), wh, o[3], true); pf(pt([P1, P2, Q2, Q1]), red, o[4]);
    pg(top, 0.9); pg(pt([P3, P2, Q2, Q3]), 0.85); pg(pt([P1, P2, Q2, Q1]), 0.85);
    for (let k = 1; k < 6; k++) { const a = lerp(P0, P3, k / 6), b = lerp(P1, P2, k / 6); let d = 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1); const n = 6; for (let s = 1; s <= n; s++) { const q = lerp(a, b, s / n); d += ' L' + q[0].toFixed(1) + ' ' + (q[1] + (s % 2 ? -3 : 0)).toFixed(1); } p(d, 0.3); }
    l(P3[0], P3[1] + 22, P2[0], P2[1] + 22, 0.5); l(P2[0], P2[1] + 22, P1[0], P1[1] + 22, 0.5);
    l(P3[0], P3[1] + 58, P2[0], P2[1] + 46, 0.35); l(P2[0], P2[1] + 46, P1[0], P1[1] + 34, 0.35);
    l(60, 320, 380, 320, 0.25);
    t(P0[0], P0[1] - 14, 'SEA SURFACE', 'middle'); t(P1[0] + 12, P1[1] + 40, 'NIÑO REGION');
    return out('0 0 420 340', 1400, '460px');
  }
  pwHeroSvg(sw) {
    const { l, r, p, c, f, t, out, h, raw, rawF } = this.mk(sw, 'dxGlowPwH');
    const G = 548, rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches, DUR = '10s';
    const an = (attributeName, values, keyTimes, extra) => rm ? null : h('animate', { key: 'a' + attributeName, attributeName, values, keyTimes, dur: DUR, repeatCount: 'indefinite', ...extra });
    const SP = 0.58, hot = () => an('opacity', '0;0;1;1;0', '0;0.45;' + SP + ';0.86;1');
    l(-2000, G, 3800, G, 0.9);
    { let hd = ''; for (let x = -1990; x < 3200; x += 16) hd += 'M' + x + ' ' + (G + 2) + ' L' + (x - 10) + ' ' + (G + 12); p(hd, 0.2); }
    const PX0 = -400, PX1 = 1600, pr = [60, 55, 52, 50, 52, 60, 75, 85, 70, 50, 35, 25, 20, 18, 22, 30, 50, 90, 150, 170, 120, 80, 70, 62];
    const pts = pr.map((v, k) => [+(PX0 + k * (PX1 - PX0) / 23).toFixed(1), +(300 - v * 1.3).toFixed(1)]);
    const pd = 'M' + pts.map(q => q.join(' ')).join(' L'), sd = 'M' + pts.slice(16, 22).map(q => q.join(' ')).join(' L'), CW = PX1 - PX0 + 20;
    rawF(h('g', { key: 'price', 'aria-hidden': 'true' }, [
      h('defs', { key: 'd' }, [
        h('clipPath', { key: 'cp', id: 'dxPriceClip' }, h('rect', { x: PX0 - 10, y: 40, width: rm ? CW : 0, height: 300 }, an('width', '0;' + CW + ';' + CW + ';' + CW, '0;0.7;0.9;1'))),
        h('clipPath', { key: 'sk', id: 'dxSkyClip' }, h('rect', { x: -2000, y: 0, width: 5800, height: G })),
      ]),
      h('g', { key: 'live' }, [an('opacity', '1;1;0;0', '0;0.88;0.97;1'),
        h('g', { key: 'cl', clipPath: 'url(#dxPriceClip)' }, [
          h('path', { key: 'pl', d: pd, style: { fill: 'none', stroke: 'var(--t1)', strokeOpacity: 1, strokeWidth: sw * 1.8, strokeLinejoin: 'round', strokeLinecap: 'round', filter: 'drop-shadow(0 0 4px var(--t1))' } }),
          h('path', { key: 'sp', d: sd, style: { fill: 'none', stroke: 'var(--red)', strokeOpacity: 0.85, strokeWidth: sw * 2, strokeLinejoin: 'round' }, filter: 'url(#dxEmber)' }),
        ]),
        h('circle', { key: 'dot', cx: rm ? pts[23][0] : 0, cy: rm ? pts[23][1] : 0, r: 5, style: { fill: 'var(--t1)', fillOpacity: 1, filter: 'drop-shadow(0 0 6px var(--t1)) drop-shadow(0 0 2px var(--t1))' } },
          rm ? null : h('animateMotion', { path: pd, dur: DUR, repeatCount: 'indefinite', keyPoints: '0;1;1', keyTimes: '0;0.7;1', calcMode: 'linear' })),
      ]),
      h('g', { key: 'sun', clipPath: 'url(#dxSkyClip)' }, h('g', { style: { opacity: rm ? 1 : 0 } }, [an('opacity', '0;1;1;0;0', '0;0.06;' + (SP - 0.04) + ';' + SP + ';1'),
        h('g', { key: 'sg', transform: rm ? 'translate(-200 170)' : undefined }, [
          h('circle', { key: 's1', cx: 0, cy: 0, r: 16, style: { fill: 'none', stroke: 'var(--t1)', strokeOpacity: 0.7, strokeWidth: sw } }),
          h('path', { key: 's2', d: [0, 45, 90, 135, 180, 225, 270, 315].map(dg => { const q = dg * Math.PI / 180; return 'M' + (24 * Math.cos(q)).toFixed(1) + ' ' + (24 * Math.sin(q)).toFixed(1) + ' L' + (32 * Math.cos(q)).toFixed(1) + ' ' + (32 * Math.sin(q)).toFixed(1); }).join(' '), style: { fill: 'none', stroke: 'var(--t1)', strokeOpacity: 0.45, strokeWidth: sw * 0.8, strokeLinecap: 'round' } }),
          rm ? null : h('animateMotion', { key: 'sm', path: 'M-380 470 Q-210 -10 -40 600', dur: DUR, repeatCount: 'indefinite', keyPoints: '0;1;1', keyTimes: '0;' + SP + ';1', calcMode: 'linear' }),
        ])])),
    ]));
    t(PX0 + 8, pts[0][1] - 14, 'HOURLY PRICE');
    for (let k = 0; k < 3; k++) { const x = -380 + k * 64; p('M' + x + ' ' + (G - 44) + ' L' + (x + 52) + ' ' + (G - 44) + ' L' + (x + 62) + ' ' + (G - 76) + ' L' + (x + 10) + ' ' + (G - 76) + ' Z', 0.8); l(x + 5, G - 60, x + 57, G - 60, 0.3); l(x + 26, G - 44, x + 36, G - 76, 0.3); l(x + 12, G - 44, x + 12, G, 0.6); l(x + 46, G - 44, x + 50, G - 30, 0.5); l(x + 50, G - 30, x + 50, G, 0.6); }
    t(-284, 584, 'SOLAR', 'middle');
    const tower = (tx, tt) => { const hw = y => 12 + (y - tt) * 0.09;
      l(tx - 12, tt, tx - hw(G), G, 0.9); l(tx + 12, tt, tx + hw(G), G, 0.9);
      for (let y = tt + 30; y < G; y += 36) { const y2 = Math.min(G, y + 36); l(tx - hw(y), y, tx + hw(y2), y2, 0.45); l(tx + hw(y), y, tx - hw(y2), y2, 0.45); l(tx - hw(y), y, tx + hw(y), y, 0.4); }
      [110, 160, 210].forEach((y, i) => { const w = 64 - i * 6, yy = y + tt - 70; l(tx - w, yy, tx + w, yy, 0.85); l(tx - w, yy, tx - hw(yy), yy + 18, 0.6); l(tx + w, yy, tx + hw(yy), yy + 18, 0.6); l(tx - w, yy, tx - w, yy + 14, 0.7); l(tx + w, yy, tx + w, yy + 14, 0.7); });
      p('M' + (tx - 12) + ' ' + tt + ' L' + tx + ' ' + (tt - 26) + ' L' + (tx + 12) + ' ' + tt, 0.85); };
    const mp = (x, top, k, o) => { const hw2 = y => 3 * k + (y - top) * 0.06; l(x - 3 * k, top, x - hw2(G), G, o); l(x + 3 * k, top, x + hw2(G), G, o); for (let y = top + 14 * k; y < G - 8 * k; y += 16 * k) { const y2 = Math.min(G, y + 16 * k); l(x - hw2(y), y, x + hw2(y2), y2, o * 0.45); l(x + hw2(y), y, x - hw2(y2), y2, o * 0.45); } [[10, 22], [24, 18]].forEach(([dy, w]) => { l(x - w * k, top + dy * k, x + w * k, top + dy * k, o); }); p('M' + (x - 3 * k) + ' ' + top + ' L' + x + ' ' + (top - 8 * k) + ' L' + (x + 3 * k) + ' ' + top, o); return [x, top + 15 * k, 22 * k]; };
    const LT = 40, RT = 1160, TT = 110;
    tower(LT, TT); tower(RT, TT);
    const A = mp(1330, 380, 2.4, 0.75), Bt = mp(1470, 446, 1.5, 0.55);
    const lines = [];
    const ln = (d, o) => { p(d, o); lines.push(d); };
    [0, 1, 2].forEach(i => { const w = 64 - i * 6, y = TT + 54 + i * 50, gx = 240 + i * 40;
      ln('M' + (LT + w) + ' ' + y + ' Q' + 160 + ' ' + (y + 100) + ' ' + gx + ' 294', [0.7, 0.55, 0.45][i]);
      ln('M' + (RT - w) + ' ' + y + ' Q' + 1060 + ' ' + (y + 110) + ' ' + (970 - i * 10) + ' ' + (420 + i * 14), [0.7, 0.55, 0.45][i]);
      p('M' + (LT - w) + ' ' + y + ' Q' + (LT - 120) + ' ' + (y + 120) + ' ' + (-150 - i * 30) + ' ' + (G - 80 + i * 4), [0.4, 0.3, 0.25][i]);
      p('M' + (RT + w) + ' ' + y + ' Q' + (RT + 110) + ' ' + (y + 130) + ' ' + (A[0] - A[2]) + ' ' + A[1], [0.4, 0.3, 0.25][i]); });
    [-1, 1].forEach(sd2 => { const ax = A[0] + sd2 * A[2], bx = Bt[0] + sd2 * Bt[2]; p('M' + ax + ' ' + A[1] + ' Q' + ((ax + bx) / 2) + ' ' + (Math.max(A[1], Bt[1]) + 26) + ' ' + bx + ' ' + Bt[1], 0.4); p('M' + bx + ' ' + Bt[1] + ' Q' + (bx + 50) + ' ' + (Bt[1] + 18) + ' ' + (bx + 90) + ' ' + (Bt[1] + 8), 0.25); });
    r(230, 286, 100, 8, 0.8); [240, 280, 320].forEach(x => { l(x, 294, x, G, 0.7); r(x - 4, 294, 8, 12, 0.5); });
    l(230, 330, 330, 330, 0.35);
    const xf = (x, w, hh, hi) => { const y = G - hh; if (hi) f(x, y, w, hh, false); rawF(h('rect', { key: 'xr' + x, x, y, width: w, height: hh, filter: 'url(#dxEmber)', fill: 'var(--red)', fillOpacity: 0.24, opacity: rm ? 0 : 0 }, hot())); r(x, y, w, hh, 0.9); for (let k = 1; k < 5; k++) l(x + (w * k) / 5, y + 6, x + (w * k) / 5, G - 6, 0.35); [0.25, 0.5, 0.75].forEach(q => { const bx = x + w * q; l(bx, y, bx, y - 20, 0.7); r(bx - 4, y - 30, 8, 10, 0.6); }); r(x - 6, G - 10, w + 12, 10, 0.5); };
    xf(370, 70, 84, true); xf(470, 70, 84, false);
    r(358, 430, 200, 118, 0.25);
    { let fd = ''; for (let x = 366; x < 558; x += 16) fd += 'M' + x + ' 430 L' + x + ' 438'; p(fd, 0.25); }
    t(458, 420, 'SUBSTATION', 'middle');
    ln('M330 300 Q352 330 405 464', 0.4); ln('M405 450 Q500 380 590 404', 0.5); ln('M505 450 Q560 400 590 412', 0.5);
    const hx = 590, hy = 404, bays = 8, bw = 380 / bays;
    r(hx, hy, 380, G - hy, 0.9); l(hx, hy + 14, hx + 380, hy + 14, 0.4);
    for (let k = 0; k < bays; k++) { const x0 = hx + k * bw; if (k) l(x0, hy + 14, x0, G, 0.35); const hi = k === 2 || k === 3 || k === 6; if (hi) f(x0 + 6, hy + 26, bw - 12, 70, false); rawF(h('rect', { key: 'br' + k, x: x0 + 6, y: hy + 26, width: bw - 12, height: 70, filter: 'url(#dxEmber)', fill: 'var(--red)', fillOpacity: hi ? 0.26 : 0.12, opacity: 0 }, hot())); r(x0 + 6, hy + 26, bw - 12, 70, 0.45); for (let y = hy + 38; y < hy + 96; y += 12) l(x0 + 10, y, x0 + bw - 10, y, 0.18); }
    r(hx + 170, G - 34, 40, 34, 0.7);
    for (let k = 0; k < 5; k++) { const cx = hx + 38 + k * 76; r(cx - 22, hy - 26, 44, 26, 0.8); c(cx - 10, hy - 13, 8, 0.55); c(cx + 10, hy - 13, 8, 0.55); }
    t(hx + 190, hy - 40, 'COOLING', 'middle'); t(hx + 190, 584, 'DATA HALL', 'middle'); t(LT, 584, 'TRANSMISSION', 'middle');
    if (!rm) {
      const pulses = (n, dur, op, key) => h('g', { key, style: { opacity: 0 } }, [an('opacity', op[0], op[1])].concat(lines.flatMap((d, li) => Array.from({ length: n }, (_, k) => h('circle', { key: li + '_' + k, r: 2.2, style: { fill: 'var(--t1)', fillOpacity: 0.8 } }, h('animateMotion', { path: d, dur, begin: (-(k / n) * parseFloat(dur) - li * 0.37).toFixed(2) + 's', repeatCount: 'indefinite' }))))));
      raw(pulses(1, '3.6s', ['1;1;0;0;1', '0;0.44;0.5;0.8;0.88'], 'pz'));
      raw(pulses(4, '1.1s', ['0;0;1;1;0;0', '0;0.44;0.5;0.72;0.8;1'], 'pd'));
    }
    {
      const fz = 10 * Math.max(1, sw * 0.8), cw = fz * 0.72, mono = { fontFamily: "'JetBrains Mono',monospace", fontSize: fz, letterSpacing: '0.1em' };
      const { chip, u, cfs, CH, ccw } = this.mk(sw, 'dxGlowPwH');
      const box = (k, x, y, w, kids) => h('g', { key: k }, [h('rect', { key: 'b', x, y, width: w, height: CH, rx: CH / 2, style: { fill: 'var(--chip-bg)', stroke: 'var(--chip-line)', strokeWidth: u } })].concat(kids));
      const tag = (k, s2, ax, ay, tx, ty, right) => chip(k, s2, ax, ay, tx, ty, right);
      raw(h('text', { key: 'cap', x: 600, y: 120, textAnchor: 'middle', style: { ...mono, fill: 'var(--t3)', opacity: 'var(--lbl,1)' } }, 'BRAZIL, 26 OCT 2026, 23X IN ONE DAY'));
      const RW = 34 * u + 14 * ccw, ry = -CH - 14 * u, ty = ry + CH / 2 + cfs * 0.36, rmono = { fontFamily: "'JetBrains Mono',monospace", fontSize: cfs, letterSpacing: '0.06em' };
      const tA = h('text', { key: 'rA', x: -RW / 2 + 22 * u, y: ty, style: { ...rmono, fill: 'var(--t1)', fillOpacity: 0.88, opacity: rm ? 0 : 1 } }, ['$11/MWH MIDDAY', an('opacity', '1;1;0;0', '0;0.5;0.53;1')]);
      const tB = h('text', { key: 'rB', x: -RW / 2 + 22 * u, y: ty, style: { ...rmono, fill: 'var(--red)', opacity: rm ? 1 : 0 } }, ['$246/MWH 7 PM', an('opacity', '0;0;1;1', '0;0.52;0.56;1')]);
      raw(h('g', { key: 'readout', transform: rm ? 'translate(' + pts[19].join(' ') + ')' : undefined, style: { opacity: 'var(--lbl,1)' } }, [
        h('line', { key: 'rl', x1: 0, y1: -4 * u, x2: 0, y2: -14 * u, style: { stroke: 'var(--t1)', strokeOpacity: 0.4, strokeWidth: u } }),
        box('rb', -RW / 2, ry, RW, [h('circle', { key: 'cd', cx: -RW / 2 + 13 * u, cy: ry + CH / 2, r: 2.5 * u, style: { fill: 'var(--red)', fillOpacity: 0.9 } }), tA, tB]),
        rm ? null : h('animateMotion', { key: 'rm', path: pd, dur: DUR, repeatCount: 'indefinite', keyPoints: '0;1;1', keyTimes: '0;0.7;1', calcMode: 'linear' }),
      ]));
      const T = [
        [tag('so', 'TEXAS SOLAR CAPTURE 1.42 TO 0.72', -330, 472, -430, 404, false), '0;0;1;1;0', '0;0.3;0.36;0.97;1'],
        [tag('ss', 'PJM CAPACITY $333/MW-DAY, 11X IN 3 AUCTIONS', 458, 540, 300, 562, false), '1;1;0;0;1', '0;0.63;0.69;0.97;1'],
        [tag('dh', 'DATA CENTRES 14 TWH TO 32 TWH BY 2030', 700, 378, 600, 316, false), '1;1;0;0;1;1', '0;0.3;0.36;0.63;0.69;1'],
      ];
      T.forEach(([g, v, kt], k) => raw(h('g', { key: 'ct' + k, style: { opacity: rm ? (k < 2 ? 1 : 0) : 1 } }, [g, an('opacity', v, kt)])));
    }
    return out('0 0 1200 600', 1700, null, true);
  }
  pwSplitSvg(sw) {
    const { l, r, p, f, t, out } = this.mk(sw, 'dxGlowPwS');
    const X0 = 60, X1 = 560, Y0 = 40, Y1 = 320;
    r(X0, Y0, X1 - X0, Y1 - Y0, 0.6);
    for (let x = X0 + 50; x < X1; x += 50) l(x, Y0, x, Y1, 0.15);
    for (let y = Y0 + 40; y < Y1; y += 40) l(X0, y, X1, y, 0.15);
    const fc = 'M60 280 C160 262 260 230 360 196 C440 170 500 150 560 134';
    p(fc, 0.5); p('M60 280 C160 262 260 238 340 214 C420 196 480 198 560 214', 0.95);
    f(486, 146, 10, 62, true);
    l(360, Y0, 360, Y1, 0.3);
    t(X0, 30, 'PEAK DEMAND'); t(X1, 30, 'TIME', 'end'); t(540, 126, 'FORECAST', 'end'); t(540, 236, 'ACTUAL', 'end'); t(366, 54, 'PUBLISHED');
    for (let x = X0; x <= X1; x += 50) l(x, Y1, x, Y1 + 6, 0.4);
    return out('0 0 600 360', 1600, '640px');
  }
  pwIsoSvg(sw, tab) {
    const { l, pg, pf, t, out } = this.mk(sw, 'dxGlowPwI');
    const dn = (q, d) => [q[0], q[1] + d], pt = arr => arr.map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' ');
    const red = 'var(--red)', wh = 'var(--t1)';
    const o = [[0.24, 0, 0, 0, 0], [0, 0, 0.2, 0, 0], [0, 0.14, 0, 0, 0], [0, 0, 0, 0.14, 0.26]][tab] || [0, 0, 0, 0, 0];
    const blk = (P0, H, isA) => { const P1 = [P0[0] + 69.3, P0[1] + 40], P2 = [P0[0] + 17.3, P0[1] + 70], P3 = [P0[0] - 52, P0[1] + 30]; const Q1 = dn(P1, H), Q2 = dn(P2, H), Q3 = dn(P3, H); const top = pt([P0, P1, P2, P3]);
      if (isA) { pf(top, red, o[0]); pf(top, wh, o[1], true); pf(pt([P3, P2, Q2, Q3]), wh, o[3], true); pf(pt([P1, P2, Q2, Q1]), red, o[4]); } else pf(top, wh, o[2], true);
      pg(top, 0.9); pg(pt([P3, P2, Q2, Q3]), 0.85); pg(pt([P1, P2, Q2, Q1]), 0.85); for (let y = 20; y < H; y += 20) { l(P3[0], P3[1] + y, P2[0], P2[1] + y, 0.25); l(P2[0], P2[1] + y, P1[0], P1[1] + y, 0.25); } return P0; };
    blk([140, 90], 170, false); blk([280, 130], 120, true);
    l(40, 320, 400, 320, 0.25);
    t(140, 78, 'FORECAST', 'middle'); t(280, 118, 'ACTUAL', 'middle');
    return out('0 0 420 340', 1400, '460px');
  }
  renderVals() {
    const s = this.state, w = s.w, M = w >= 1024, T = w >= 768, S = w >= 640;
    const sec = this.secs.find(x => x.id === s.sec) || this.secs[0], isDev = s.sec === 'development', isEl = s.sec === 'elnino', isPw = s.sec === 'power';
    const colW = Math.min(w, 1200);
    const D = w > 1024, dashW = D ? Math.min(880, w * 0.72) : T ? w * 0.86 : w - 32, rm = (w - dashW) / 2, rov = T ? 70 : 20, rsc = Math.max((rm + rov) / 515, D ? 0 : w * 0.22 / 515);
    const inset = T ? Math.max(32, Math.round(rm + rov * 0.5 - (w - colW) / 2)) : 0;
    const heroHpx = Math.max(520, s.h - 72), heroW = T ? w : colW, ovL = T ? inset + Math.round((w - colW) / 2) : 0; this.heroPar = 'xMidYMid meet'; const _u = 0, splitW = Math.min(640, M ? colW - 260 - 96 : colW - 40), isoW = Math.min(460, M ? colW / 2 - 64 : colW - 40);
    const sw = (vb, rw) => Math.max(1, (vb / Math.max(200, rw)) * 0.95);
    const tabsDev = [['The exposure', 'Budgets are fixed at underwriting. Inputs are paid for over the build.'], ['Why it is unhedged', 'Single commodity futures cover a sliver of the bill. Contingency lines absorb the rest.'], ['What settles it', 'A public monthly index from BLS producer price data. Settled from public data, no counterparty decides the number.'], ['Who takes each side', 'Developers and general contractors who lose when inputs rise, against producers and suppliers who gain.']];
    const tabsEl = [['The exposure', 'Northern Peru grape harvests, Pacific shipping routes and coastal fisheries all swing with Pacific temperatures.'], ['Why it is unhedged', 'Weather insurance is bespoke and slow. There is no listed market on the index itself.'], ['What settles it', 'NOAA Climate Prediction Center monthly anomalies for Niño 3.4 and Niño 1+2. Public, monthly, settled from public data.'], ['Who takes each side', 'Growers, shippers and fishing fleets hurt by a strong El Niño, against businesses and risk takers who gain or want the exposure.']];
    const tabsPw = [['The exposure', 'Generators, lenders and data center developers commit billions on demand forecasts that keep moving.'], ['Why it is unhedged', 'No venue lists load arrival, grid capacity, or the ratio between a forecast and the outcome.'], ['What settles it', "ERCOT's own published forecast and its own measured peak. Both public, settled from public data."], ['Who takes each side', 'Those who lose if load arrives late, against those who lose if it arrives early.']];
    const tabsD = isPw ? tabsPw : isEl ? tabsEl : tabsDev;
    const subs = isPw ? ['Load forecasts', 'Interconnection queue', 'Data center demand', 'Capacity planning'] : isEl ? ['Agriculture', 'Shipping lanes', 'Fisheries', 'Hydropower'] : ['Materials', 'Labor and sub bids', 'Fuel and freight', 'Financing'];
    return {
      hdrBg: s.scrolled ? 'var(--hdr-glass)' : 'transparent', hdrLine: s.scrolled ? 'var(--hair)' : 'transparent', hdrBlur: s.scrolled ? 'blur(14px) saturate(140%)' : 'none',
      toggleTheme: () => window.dxToggleTheme && window.dxToggleTheme(), toggleThemeMenu: e => { e.stopPropagation(); window.dxToggleTheme && window.dxToggleTheme(); },
      showCreate: w > 720, showLang: w > 1100, hdrNav: w > 1100, hdrBurger: w <= 1100, hdrPad: w > 720 ? '32px' : '16px',
      menuOpen: s.menu && w <= 1100, toggleMenu: () => this.setState({ menu: !s.menu }),
      ddOpen: s.dd, ddOn: () => this.setState({ dd: true }), ddOff: () => this.setState({ dd: false }),
      mainPadB: w < 640 ? '24px' : '0px',
      secItems: this.secs.map(x => { const on = x.id === s.sec; return { n: x.n, l: x.l, href: '#' + x.id, checked: on ? 'true' : 'false', bg: on ? 'var(--btn-p-bg)' : 'transparent', fg: on ? 'var(--btn-p-fg)' : 'var(--t3)', hov: on ? 'var(--btn-p-fg)' : 'var(--t1)', ddFg: on ? 'var(--t1)' : 'var(--t3)', on: e => { if (e && e.preventDefault) e.preventDefault(); this.go(x.id); } }; }),
      segFs: S ? '11px' : w < 420 ? '9px' : '10px', segPad: S ? '14px' : w < 420 ? '7px' : '9px',
      vis: s.vis, isDev, isEl, isPw, pwHero: isPw ? this.pwHeroSvg(sw(1200, heroW)) : null, pwSplit: isPw ? this.pwSplitSvg(sw(600, splitW)) : null, pwIso: isPw ? this.pwIsoSvg(sw(420, isoW), s.tab) : null, splitRef3: this.splitRef3,
      elHero: isEl ? this.elHeroSvg(sw(1200, heroW)) : null, elSplit: isEl ? this.elSplitSvg(sw(600, splitW)) : null, elIso: isEl ? this.elIsoSvg(sw(420, isoW), s.tab) : null, splitRef2: this.splitRef2, ph: { n: sec.n, l: sec.l.toUpperCase() },
      pillBot: s.w < 640 ? '14px' : '20px', footPadB: s.w < 640 ? '96px' : '76px', cueBot: 'max(76px, calc(100% - 100svh + 148px))', heroH: T ? 'calc(100svh - 72px)' : 'auto', heroMin: T ? '520px' : '0', ovPos: T ? 'absolute' : 'relative', ovOrder: T ? 0 : 2, ovPad: T ? '28px ' + ovL + 'px' : '28px 20px 40px', ovGrad: 'transparent', h1Fs: T ? Math.round(Math.max(22, Math.min(34, 34 * Math.min(colW / 1200, (heroHpx * 2) / 1200)))) + 'px' : '26px', h1Ws: T ? 'nowrap' : 'normal', h1Disp: T ? 'block' : 'inline', artFlex: T ? '1 1 0' : '0 0 auto', artPos: T ? 'absolute' : 'relative', artPad: T ? '24px 0 110px' : '24px 0 0', artPadM: '0', showCue: T, heroArt: isDev ? this.heroSvg(sw(1200, heroW)) : null,
      explore: () => { const el = (isPw ? this.splitRef3 : isEl ? this.splitRef2 : this.splitRef).current; if (el) window.scrollTo({ top: el.getBoundingClientRect().top + (window.scrollY || 0) - 88, behavior: 'smooth' }); },
      toContent: () => { const el = document.querySelector('[data-first-block]'); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + (window.scrollY || 0) - (this.fbShift || 0) - 88, behavior: 'smooth' }); },
      cueLine: React.createElement('span', { key: 'cl', style: { position: 'absolute', left: 0, top: 0, width: '1px', height: '100%', background: 'var(--t2)', animation: 'dx-cue 2.4s cubic-bezier(.6,0,.3,1) infinite' } }),
      ...this.pwVals(s), notPw: s.sec !== 'power',
      layersRef: this.layersRef, toLayers: () => { const el = this.layersRef.current; if (el) window.scrollTo({ top: el.getBoundingClientRect().top + (window.scrollY || 0) - 88, behavior: 'smooth' }); },
      whoRef: this.whoRef, toWho: () => { const el = this.whoRef.current; if (el) window.scrollTo({ top: el.getBoundingClientRect().top + (window.scrollY || 0) - 88, behavior: 'smooth' }); },
      splitRef: this.splitRef, gapsRef: this.gapsRef, toGaps: () => { const el = this.gapsRef.current; if (el) window.scrollTo({ top: el.getBoundingClientRect().top + (window.scrollY || 0) - 88, behavior: 'smooth' }); }, splitCols: M ? '260px minmax(0,1fr)' : 'minmax(0,1fr)', cardPad: S ? '40px' : '24px',
      subItems: subs.map((x, i) => ({ l: x, n: '0' + (i + 1), fg: i === s.sub ? 'var(--t1)' : 'var(--t4)', hv: i === s.sub ? 'var(--t1)' : 'var(--t2)', bd: i === s.sub ? 'var(--t1)' : 'var(--line)', nf: i === s.sub ? 'var(--t2)' : 'var(--t4)', on: () => this.setState({ sub: i }) })),
      mktChart_dev: this.mkChartEl('dev'), mktChart_el: this.mkChartEl('el'), mktChart_pw: this.mkChartEl('pw'),
      railItems: Array.from({ length: this.state.railN || 0 }, (_, i) => ({ i, n: String(i + 1).padStart(2, '0'), go: () => { const s = this.railSecs()[i]; if (s) window.scrollTo({ top: s.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' }); } })),
      storyItems: isDev ? [{ n: '184.5', l: 'Record construction input cost index, Sep 2026' }, { n: '+12.2%', l: 'In a single year' }, { n: '41 to 43%', l: 'Of developer profit erased by a 10% cost rise' }]
        : isEl ? [{ n: '$112bn', l: 'Of weather disaster damage uninsured in 2025' }, { n: '88%', l: 'Of Asia Pacific losses uninsured' }, { n: '$5.7tn', l: 'Lost to the 1997 to 98 El Niño' }]
        : isPw ? [{ n: '23x', l: "One day move in Brazil's power price" }, { n: '$333', l: 'Per MW-day PJM capacity, 11x in 3 auctions' }, { n: '1.42 to 0.72', l: 'Texas solar capture rate' }] : [],
      splitArt: isDev ? this.splitSvg(sw(600, splitW)) : null,
      whyCols: M ? 'minmax(0,5fr) minmax(0,6fr)' : 'minmax(0,1fr)',
      tabs: tabsD.map(([n], i) => ({ n, idx: '0' + (i + 1), bg: i === s.tab ? 'var(--btn-p-bg)' : 'transparent', fg: i === s.tab ? 'var(--btn-p-fg)' : 'var(--t3)', hv: i === s.tab ? 'var(--btn-p-fg)' : 'var(--t1)', sel: i === s.tab ? 'true' : 'false', on: () => this.setState({ tab: i }) })),
      tabT: tabsD[s.tab][0], tabB: tabsD[s.tab][1], tabIdx: '0' + (s.tab + 1) + ' / 04',
      isoArt: isDev ? this.isoSvg(sw(420, isoW), s.tab) : null,
      stats: (isPw ? [['132%', 'revision to ERCOT\'s 2030 peak forecast in four months (138,010 MW to 319,650 MW)', '▲'], ['0.953 to 1.039', 'settled range of the arrival ratio, 2013 to 2025', '↕'], ['5 of 12', 'years settled more than 3% away from 1.00', '↕'], ['~474 GW', 'large load interconnection queue, about 90% data centers', '▲']] : isEl ? [['+4.69°C', 'Niño 1+2 anomaly, Sep 2026 (record monthly reading)', '▲'], ['~38%', 'northern Peru grape crop decline, 2017/18', '▼'], ['~30%', 'northern Peru grape crop decline, 2023/24', '▼'], ['$169.3M', 'drop in Panama Canal toll revenue, FY2024', '▼']] : [['+11.2%', 'construction input prices, Sep 2025 to Sep 2026', '▲'], ['+2.2%', 'in September 2026 alone', '▲'], ['~4 yrs', 'largest year over year rise in nearly four years', '▲'], ['+28.3%', 'crude petroleum, September month over month', '▲']]).map(([v, l], i) => ({ v, l, k: (isPw ? ['Forecast revision', 'Settled range', 'Off target', 'Load queue'] : isEl ? ['Niño 1+2', 'Grapes 2017/18', 'Grapes 2023/24', 'Panama Canal'] : ['Input prices', 'September', 'Pace', 'Crude oil'])[i], fs: v.length > 9 ? 'clamp(20px,1.9vw,24px)' : 'clamp(30px,3.2vw,40px)' })),
      footCols: M ? 'minmax(0,2fr) repeat(3,minmax(0,1fr))' : S ? 'repeat(2,minmax(0,1fr))' : 'minmax(0,1fr)',
      footerChips: ['PRICE-EGGS', 'PRICE-MILK-US', 'CRUDE-OIL', 'GOLD'].map(x => ({ s: x, href: 'https://dexetera.xyz/token/' + x })),
    };
  }
}
