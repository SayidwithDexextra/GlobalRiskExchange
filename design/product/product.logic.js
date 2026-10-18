// Product section logic, copied verbatim from design/source/Dexetera Landing v2.dc.html (Component class).
// Header helpers and the full constructor are included because the product data is seeded there (see the RNG order note in the spec).
data-dc-script>
class Component extends DCLogic {
  hv(t, p, ...c) { if (p) { let st = null; for (const k of ['fill', 'stroke', 'stopColor']) { const v = p[k]; if (typeof v === 'string' && /var\(|color-mix/.test(v)) { st = st || {}; st[k] = v; } } if (st) p = { ...p, style: { ...st, ...(p.style || {}) } }; } return React.createElement(t, p, ...c); }

// ===== constructor =====

  constructor(p) {
    super(p);
    let seed = 11;
    this.rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const r = this.rnd;
    const walk = (base, n, drift, vol) => { let v = base, a = []; for (let i = 0; i < n; i++) { v *= 1 + drift + (r() - 0.5) * vol; a.push(v); } const f = base / a[n - 1]; return a.map(x => x * f); };
    this.walk = walk;
    let v = 2.6, cs = [];
    for (let i = 0; i < 44; i++) { const o = v; v = v * (1 + (r() - 0.46) * 0.014); cs.push({ o, c: v, h: Math.max(o, v) * (1 + r() * 0.005), l: Math.min(o, v) * (1 - r() * 0.005) }); }
    const f = 2.715 / v; cs = cs.map(k => ({ o: k.o * f, c: k.c * f, h: k.h * f, l: k.l * f }));
    this.open24 = cs[20].c;
    this.mk = [
      { id: 'GPU-H100', name: 'GPU compute, H100', unit: '$/hr', cat: 'Compute', base: 2.0, dec: 2, settle: '31 MAR 2027', ab: 'GP' },
      { id: 'PRICE-EGGS', name: 'Eggs, Grade A', unit: '$/dozen', cat: 'Commodities', base: 2.715, dec: 3, settle: '31 DEC 2026', live: true },
      { id: 'ERCOT-N', name: 'ERCOT North power', unit: '$/MWh', cat: 'Energy', base: 38.4, dec: 2, settle: '30 JUN 2027' },
      { id: 'FREIGHT-FEU', name: 'Asia to US freight', unit: '$/FEU', cat: 'Freight', base: 2140, dec: 0, settle: '31 JAN 2027' },
      { id: 'DRAM-DDR5', name: 'DRAM DDR5 spot', unit: '$/Gb', cat: 'Compute', base: 4.85, dec: 2, settle: '31 MAR 2027' },
      { id: 'US-CPI-YOY', name: 'US CPI, year on year', unit: '%', cat: 'Macro', base: 2.9, dec: 2, settle: '15 JAN 2027', pct: true },
      { id: 'BTC-MINE-M', name: 'BTC mining margin', unit: 'BTC / POWER', cat: 'Ratio', base: 48.2, dec: 2, settle: '31 MAR 2027' },
    ];
    const featS = Array.from({ length: 90 }, (_, i) => { const t = i / 89; return 1.72 + 0.28 * (t * t * (3 - 2 * t)) + 0.035 * Math.sin(t * 11) + 0.02 * Math.sin(t * 23 + 1) - (0.035 * Math.sin(11) + 0.02 * Math.sin(24)) * t; });
    this.featVol = featS.map((_, i) => 0.2 + 0.35 * (i / 89) + r() * 0.45);
    const series = this.mk.map((m, i) => i === 0 ? featS : walk(m.base, 40, i % 3 === 2 ? -0.003 : 0.0025, 0.03));
    this.tbl = Array.from({ length: 10 }, (_, i) => walk(10, 24, i % 3 === 1 ? -0.004 : 0.004, 0.05));
    this.gpuNoise = (() => { let a = [], x = 0; for (let i = 0; i < 60; i++) { x = x * 0.8 + (r() - 0.5) * 0.9; a.push(x); } return a; })();
    this.bars = Array.from({ length: 30 }, (_, i) => 0.25 + 0.55 * (i / 29) + r() * 0.3);
    this.tagLines = [
      { label: 'EGGS · BLS', unit: '/ dozen', live: true, bar: 'EGGS', k: 9 },
      { label: 'GPU H100 · RENTAL', num: '$2.00', unit: '/ hr', chg: 1.2, bar: 'GPU-H100', k: 29 },
      { label: 'ERCOT NORTH · POWER', num: '$41.80', unit: '/ MWh', chg: 3.42, bar: 'ERCOT-N', k: 52 },
      { label: 'ASIA TO US · FREIGHT', num: '$2,140', unit: '/ FEU', chg: -2.15, bar: 'FREIGHT-FEU', k: 77 },
      { label: 'DRAM DDR5 · SPOT', num: '$4.74', unit: '/ Gb', chg: 0.85, bar: 'DRAM-DDR5', k: 103 },
      { label: 'BTC MINING · MARGIN', num: '0.42x', unit: '', chg: -1.6, bar: 'BTC-MINE', k: 130 },
    ];
    this.litLabels = ['NdPr OXIDE', 'NAND SPOT', 'US CPI', 'FARM MARGIN', 'COLO SPARK', 'EGG INDEX', 'HBM SPOT', 'JET FUEL', 'PJM WEST', 'UREA NOLA', 'COBALT', 'SOLAR WAFER', 'LITHIUM', 'COCOA', 'COLO RENT', 'DIESEL', 'CORN BASIS', 'HELIUM'];
    this.tailNoise = Array.from({ length: 160 }, () => r());
    this.netRef = React.createRef(); this.netNodes = [
      { id: 'imp', n: 'Importer', d: 'Pays for goods priced in freight it cannot hedge.', x: 170, y: 130, nw: [110, 380], tag: 'BESPOKE TERMS', dtag: 'OPEN LISTING' },
      { id: 'dc', n: 'Data center', d: 'Large power buyer. Big enough for a bank desk.', x: 370, y: 70, ok: true },
      { id: 'farm', n: 'Farmer', d: 'Exposed to crop and fertilizer prices every season.', x: 120, y: 330, nw: [40, 510], tag: 'CREDIT CHECK', dtag: 'ANYONE TRADES' },
      { id: 'mine', n: 'Miner', d: 'Margin swings with power cost and BTC price.', x: 240, y: 500, wideOnly: true },
      { id: 'air', n: 'Airline', d: 'Fuel is its largest variable cost.', x: 840, y: 80, dtag: 'ONE SIGNATURE' },
      { id: 'fund', n: 'Fund', d: 'Has a credit line and a dealer. Gets a quote.', x: 1060, y: 160, nw: [250, 380], ok: true },
      { id: 'ret', n: 'Retail trader', d: 'Wants a view on real prices. No access to a desk.', x: 1070, y: 370, nw: [320, 510], tag: 'GEOGRAPHY', dtag: '~0.10% FEE' },
      { id: 'smb', n: 'Small business', d: 'Too small for a bank minimum ticket.', x: 980, y: 510, wideOnly: true, tag: '$ MINIMUMS' },
    ];
    this.dashRef = React.createRef(); this.heroRef = React.createRef(); this.copyRef = React.createRef(); this.pillRef = React.createRef(); this.rockLRef = React.createRef(); this.rockRRef = React.createRef();
    this.dBars = (() => { let x = 0.5; return Array.from({ length: 120 }, (_, i) => { x = Math.min(1, Math.max(0.18, x * 0.7 + 0.15 + (r() - 0.5) * 0.5)); const hi = (i >= 30 && i <= 46) || (i >= 82 && i <= 96); return { h: Math.round((hi ? Math.min(1, x + 0.15) : x) * 100) + '%', c: hi ? 'var(--t-soft)' : 'var(--line2)' }; }); })();
    this.whoA = walk(100, 30, 0.004, 0.08); this.whoB = walk(60, 30, 0.001, 0.05);
    this.state = { w: 1440, tagI: 0, tagPrev: null, tagN: 0, lit: [{ k: 9, label: 'EGGS', tag: true }], litN: 0, cs, flash: 0, flashRow: -1, series, heroHover: null, prodHover: null, tab: 'Market', lev: '5x', side: 'long', size: '1,000', filter: 'All', step: 0, gpu: 2, fees: 0, faq: 0, ownerFees: 1284.2, menu: false, hoverTk: false, scrolled: false, hin: false, myOpen: true, h: 800, rm: false, netMode: 'today', netManual: false, netI: 0, netHover: null, book: this.makeBook(2.715), trades: this.seedTrades(2.715) };
    { const r = this.rnd; const a = [[3580,3610,3520,3600,0.39],[3600,3650,3560,3600,0.32],[3600,3740,3560,3690,0.85],[3690,3760,3670,3710,0.42],[3710,3790,3700,3750,0.62],[3750,3810,3700,3750,0.24],[3750,3850,3710,3790,0.61],[3790,3890,3730,3830,0.51],[3830,3880,3780,3850,0.41],[3850,3870,3770,3800,0.53],[3800,3920,3750,3880,0.87],[3880,3900,3720,3760,0.92],[3760,3810,3700,3790,0.36],[3790,3820,3740,3780,0.57],[3780,3820,3760,3780,0.34],[3780,3830,3750,3800,0.41],[3800,3920,3780,3880,0.88],[3880,3970,3840,3920,0.6],[3920,4010,3880,3970,0.76],[3970,4050,3950,4000,0.54],[4000,4080,3970,4050,0.71],[4050,4180,4000,4160,0.73],[4160,4180,4140,4150,0.59],[4150,4210,4130,4170,0.45],[4170,4280,4110,4260,0.92],[4260,4350,4210,4300,0.7],[4300,4320,4290,4300,0.29],[4300,4310,4140,4180,0.83],[4180,4250,4140,4220,0.47],[4220,4240,4170,4200,0.6],[4200,4230,4070,4080,1],[4080,4160,4070,4100,0.61],[4100,4120,3990,4050,0.63],[4050,4150,4030,4130,0.64],[4130,4180,4080,4170,0.63],[4170,4270,4160,4240,0.56],[4240,4350,4200,4330,0.92],[4330,4380,4230,4280,0.77],[4280,4490,4250,4440,1],[4440,4520,4410,4470,0.42],[4470,4530,4420,4500,0.53],[4500,4540,4420,4470,0.45],[4470,4530,4450,4500,0.45],[4500,4570,4460,4510,0.55],[4510,4530,4450,4490,0.34],[4490,4520,4380,4420,0.79],[4420,4590,4400,4560,0.99],[4560,4600,4510,4550,0.44],[4550,4720,4520,4670,1],[4670,4710,4630,4690,0.36],[4690,4880,4670,4860,1],[4860,4920,4810,4910,0.72],[4910,5060,4850,5000,0.85],[5000,5010,4940,4990,0.46],[4990,5040,4890,4900,0.66],[4900,4920,4750,4760,0.84],[4760,4800,4690,4750,0.31],[4750,4780,4710,4760,0.33],[4760,4920,4730,4860,0.89],[4860,4990,4830,4960,0.68],[4960,5010,4890,4950,0.3],[4950,5130,4930,5090,0.91],[5090,5140,5070,5100,0.27],[5100,5140,5020,5060,0.55],[5060,5140,5030,5130,0.63],[5130,5140,5040,5050,0.71],[5050,5110,4990,5090,0.65],[5090,5290,5040,5260,1],[5260,5360,5220,5310,0.63],[5310,5430,5310,5400,0.78]].map(([o, h, l, c, v]) => ({ o, h, l, c, v })); let p = a[a.length - 1].c;
      this.btcSz = Array.from({ length: 18 }, () => 0.002 + r() * 0.06); const now = Date.now();
      Object.assign(this.state, { btc: a, btcTrades: Array.from({ length: 14 }, (_, i) => ({ p: p + Math.round((r() - 0.5) * 4) * 10, s: Math.round(1 + r() * 40), up: r() > 0.5, t: now - i * 3700 })), btcHover: null, bookTab: 'book', posTab: 'Positions', tiTab: 'Margin Used', bsize: '', appW: 0 });
      this.appRef = React.createRef(); this.simS = [0, 1, 2].map(i => this.walk(10, 16, 0.003 + i * 0.002, 0.04)); }
  }
// ===== makeBook =====

  makeBook(mid) {
    const r = this.rnd, t = 0.001, m = Math.round(mid * 1000) / 1000;
    let ca = 0, cb = 0; const asks = [], bids = [];
    for (let i = 0; i < 8; i++) { const sa = Math.round(300 + r() * 3200); ca += sa; asks.push({ p: m + t * (i + 1), s: sa, t: ca }); const sb = Math.round(300 + r() * 3200); cb += sb; bids.push({ p: m - t * i, s: sb, t: cb }); }
    return { asks, bids, max: Math.max(ca, cb) };
  }
// ===== seedTrades =====

  seedTrades(m) { const r = this.rnd, now = Date.now(); return Array.from({ length: 9 }, (_, i) => ({ p: m + (r() - 0.5) * 0.004, s: Math.round(50 + r() * 900), up: r() > 0.5, t: now - i * 4100 })); }
// ===== componentDidMount =====

  componentDidMount() {
    { const go = () => { const cv = document.querySelector('canvas.dx-storm'); if (!cv || !window.dxStorm) return setTimeout(go, 100); if (!cv.__dx) { cv.__dx = 1; window.dxStorm(cv.parentElement, cv); } }; go(); }
    this.reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.onResize = () => this.setState({ w: window.innerWidth, h: window.innerHeight, appW: this.appRef.current ? this.appRef.current.clientWidth : 0 }, () => this.onScroll && this.onScroll());
    this.onResize(); window.addEventListener('resize', this.onResize);
    if (!this.reduce) {
      this.tick = setInterval(() => this.doTick(), 1500);
      this.stepT = setInterval(() => { if (Date.now() - (this.stepClick || 0) > 8000) this.setState(s => ({ step: (s.step + 1) % 4 })); }, 4000);
    }
    setTimeout(() => this.setupReveal(), 60);
    this.onScroll = () => { if (this.raf) return; this.raf = requestAnimationFrame(() => {
      this.raf = 0; const y = window.scrollY || 0, sc = y > 24;
      if (sc !== this.state.scrolled) this.setState({ scrolled: sc });
      const hero = this.heroRef.current, dd = this.dashRef.current, cp = this.copyRef.current, l = this.rockLRef.current, r = this.rockRRef.current, pl = this.pillRef.current;
      if (!hero || !dd) return;
      const vh = window.innerHeight;
      if (this.reduce || window.innerWidth <= 768) { [dd, cp, l, r].forEach(e => { if (e) e.style.transform = ''; }); if (cp) cp.style.opacity = ''; return; }
      const p = Math.min(1, Math.max(0, (y - hero.offsetTop) / Math.max(1, hero.offsetHeight - vh)));
      const fit = Math.max(0.82, Math.min(1, (vh - 104) / dd.offsetHeight)), end = Math.max(88, 72 + (vh - 72 - dd.offsetHeight * fit) / 2), delta = Math.max(0, dd.offsetTop - end);
      dd.style.transformOrigin = '50% 0';
      dd.style.transform = 'translateY(' + (-delta * p).toFixed(1) + 'px) scale(' + (1 - (1 - fit) * p).toFixed(4) + ')';
      if (cp) { cp.style.opacity = String(1 - Math.min(1, p / 0.7)); cp.style.transform = 'translateY(' + (-120 * p).toFixed(1) + 'px)'; }
      const s2 = 1 + 0.12 * p;
      if (l) l.style.transform = 'translateX(' + (-28 * p).toFixed(2) + '%) scale(' + s2 + ')';
      if (r) r.style.transform = 'translateX(' + (28 * p).toFixed(2) + '%) scale(' + s2 + ')';
      if (pl) pl.style.opacity = String(Math.max(0, 1 - p / 0.15));
    }); };
    window.addEventListener('scroll', this.onScroll, { passive: true }); this.onScroll();
    this.netT = setInterval(() => { if (this.state.netMode === 'dex' && !this.reduce) this.setState(s => ({ netI: s.netI + 1 })); }, 1600);
    if ('IntersectionObserver' in window && this.netRef.current) { this.netIo = new IntersectionObserver(es => { if (es[0].isIntersecting) { this.netIo.disconnect(); this.netAuto = setTimeout(() => { if (!this.state.netManual) this.setState({ netMode: 'dex' }); }, 2200); } }, { threshold: 0.4 }); this.netIo.observe(this.netRef.current); }
    if (this.reduce) this.setState({ hin: true, rm: true }); else requestAnimationFrame(() => requestAnimationFrame(() => this.setState({ hin: true })));
  }
// ===== componentWillUnmount =====

  componentWillUnmount() { clearInterval(this.tick); clearInterval(this.stepT); clearTimeout(this.ft); clearTimeout(this.revealT); window.removeEventListener('resize', this.onResize); window.removeEventListener('scroll', this.onScroll); clearInterval(this.netT); clearTimeout(this.netAuto); this.netIo && this.netIo.disconnect(); cancelAnimationFrame(this.raf); this.io && this.io.disconnect(); }
// ===== doTick =====

  doTick() {
    this.setState(s => {
      const r = this.rnd, last = s.cs[s.cs.length - 1], m = last.c * (1 + (r() - 0.5) * 0.004);
      this.tn = (this.tn || 0) + 1;
      const bl = s.btc[s.btc.length - 1], bm = Math.min(5430, Math.max(5380, bl.c + (r() < 0.5 ? -10 : 10)));
      const btc = s.btc.slice(); btc[btc.length - 1] = { ...bl, c: bm, h: Math.max(bl.h, bm), l: Math.min(bl.l, bm) };
      const btcTrades = [{ p: bm, s: Math.round(1 + r() * 40), up: bm >= bl.c, t: Date.now() }].concat(s.btcTrades.slice(0, 13));
      let cs = s.cs.slice();
      if (this.tn % 6 === 0) { cs = cs.slice(1); cs.push({ o: last.c, c: m, h: Math.max(last.c, m), l: Math.min(last.c, m) }); }
      else cs[cs.length - 1] = { ...last, c: m, h: Math.max(last.h, m), l: Math.min(last.l, m) };
      const series = s.series.map((a, i) => i < 2 || r() < 0.5 ? a : a.slice(1).concat(a[a.length - 1] * (1 + (r() - 0.5) * 0.012)));
      const trades = [{ p: m, s: Math.round(50 + r() * 900), up: m >= last.c, t: Date.now() }].concat(s.trades.slice(0, 8));
      return { btc, btcTrades, cs, flash: m >= last.c ? 1 : -1, flashRow: Math.floor(r() * 16), book: this.makeBook(m), series, trades, ownerFees: s.ownerFees + 0.4 + r() * 2.6 };
    });
    clearTimeout(this.ft); this.ft = setTimeout(() => this.setState({ flash: 0, flashRow: -1 }), 450);
  }
// ===== mono =====

  mono() { return { fontFamily: "'JetBrains Mono',monospace" }; }
// ===== candle =====

  candle(cs, key, height, opt = {}) {
    const h = this.hv, s = this.state, mono = this.mono();
    const hi = Math.max(...cs.map(k => k.h)), lo = Math.min(...cs.map(k => k.l)), pad = (hi - lo) * 0.12, top = opt.range ? opt.range[1] : hi + (hi - lo) * (opt.padT ?? 0.12), bot = opt.range ? opt.range[0] : lo - pad * (opt.padB ?? 1);
    const W = 1000, H = 400, n = cs.length, cw = W / n, Y = v => (top - v) / (top - bot) * H, pct = v => (top - v) / (top - bot) * 100;
    const levels = opt.levels || [0.1, 0.3, 0.5, 0.7, 0.9].map(t => top - (top - bot) * t);
    const idx = s[key] ?? n - 1, k = cs[idx], lastC = cs[n - 1].c, up = cs[n - 1].c >= cs[n - 1].o;
    const els = [];
    levels.forEach((l, i) => els.push(h('line', { key: 'g' + i, x1: 0, x2: W, y1: Y(l), y2: Y(l), stroke: 'var(--hair)', vectorEffect: 'non-scaling-stroke' })));
    for (let i = 4; i < n; i += 8) els.push(h('line', { key: 'v' + i, x1: i * cw, x2: i * cw, y1: 0, y2: H, stroke: 'var(--row)', vectorEffect: 'non-scaling-stroke' }));
    if (opt.vol) cs.forEach((c, i) => els.push(h('rect', { key: 'vo' + i, x: i * cw + cw * 0.2, width: cw * 0.6, y: H - (c.v || 0.3) * H * 0.14, height: (c.v || 0.3) * H * 0.14, fill: c.c >= c.o ? 'var(--green)' : 'var(--red)', opacity: 0.2 })));
    cs.forEach((c, i) => {
      const col = c.c >= c.o ? 'var(--green)' : 'var(--red)', x = i * cw + cw / 2;
      els.push(h('line', { key: 'w' + i, x1: x, x2: x, y1: Y(c.h), y2: Y(c.l), stroke: col, vectorEffect: 'non-scaling-stroke' }));
      els.push(h('rect', { key: 'b' + i, x: i * cw + cw * 0.2, width: cw * 0.6, y: Y(Math.max(c.o, c.c)), height: Math.max(2, Math.abs(Y(c.o) - Y(c.c))), fill: col }));
    });
    const onMove = e => { const b = e.currentTarget.getBoundingClientRect(); const i = Math.max(0, Math.min(n - 1, Math.floor((e.clientX - b.left) / b.width * n))); if (i !== this.state[key]) this.setState({ [key]: i }); };
    const f3 = opt.fmt || (v => v.toFixed(3)), AX = opt.axis || 54;
    return h('div', { style: { position: 'relative', width: '100%', height } },
      h('div', { onMouseMove: onMove, onMouseLeave: () => this.setState({ [key]: null }), style: { position: 'absolute', left: 0, top: 0, bottom: 0, right: AX, cursor: 'crosshair' } },
        h('svg', { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'none', style: { position: 'absolute', inset: 0, width: '100%', height: '100%' } }, els),
        h('div', { style: { position: 'absolute', top: 0, bottom: 0, left: ((idx + 0.5) / n * 100) + '%', borderLeft: '1px dashed var(--line4)', pointerEvents: 'none' } }),
        h('div', { style: { position: 'absolute', left: 0, right: 0, top: pct(k.c) + '%', borderTop: '1px dashed var(--line4)', pointerEvents: 'none' } }),
        opt.ref ? h('div', { style: { ...mono, position: 'absolute', left: 0, right: 0, top: pct(opt.ref.v) + '%', borderTop: '1px dashed var(--line4)', pointerEvents: 'none' } }, h('span', { style: { position: 'absolute', left: 6, bottom: 3, fontSize: 9, color: 'var(--t3)', whiteSpace: 'nowrap' } }, opt.ref.label)) : null,
        opt.noOhlc ? null : h('div', { style: { ...mono, position: 'absolute', left: 6, top: 4, fontSize: 10, color: 'var(--t4)', display: 'flex', gap: 10, pointerEvents: 'none', background: 'color-mix(in srgb,var(--card) 80%,transparent)', padding: '2px 4px', borderRadius: 4 } },
          [['O', k.o], ['H', k.h], ['L', k.l], ['C', k.c]].map(([a, b]) => h('span', { key: a }, a + ' ', h('span', { style: { color: k.c >= k.o ? 'var(--green)' : 'var(--red)' } }, f3(b)))))),
      h('div', { style: { position: 'absolute', right: 0, top: 0, bottom: 0, width: AX, borderLeft: '1px solid var(--hair)', pointerEvents: 'none' } },
        levels.map((l, i) => h('div', { key: i, style: { ...mono, position: 'absolute', left: 7, top: pct(l) + '%', transform: 'translateY(-50%)', fontSize: 9, color: 'var(--t4)' } }, (opt.lvFmt || f3)(l))),
        h('div', { style: { ...mono, position: 'absolute', left: 0, right: 0, top: pct(lastC) + '%', transform: 'translateY(-50%)', fontSize: 9, fontWeight: 600, padding: '2px 6px', background: up ? 'var(--green)' : 'var(--red)', color: 'var(--bg)', transition: 'top .3s' } }, f3(lastC)),
        s[key] != null ? h('div', { style: { ...mono, position: 'absolute', left: 0, right: 0, top: pct(k.c) + '%', transform: 'translateY(-50%)', fontSize: 9, padding: '2px 6px', background: 'var(--line2)', color: 'var(--t1)' } }, f3(k.c)) : null));
  }
// ===== tabStyle =====

  tabStyle(on) { return on ? { bg: 'color-mix(in srgb,var(--t1) 6%,transparent)', border: 'color-mix(in srgb,var(--violet) 25%,transparent)', color: 'var(--t1)' } : { bg: 'transparent', border: 'transparent', color: 'var(--t3)' }; }
// ===== bookRows =====

  bookRows(rows, max, off) { const s = this.state; return rows.map((o, i) => ({ p: o.p.toFixed(3), s: o.s.toLocaleString('en-US'), t: o.t.toLocaleString('en-US'), depth: (o.t / max * 100).toFixed(1) + '%', bg: s.flashRow === i + off ? 'color-mix(in srgb,var(--t1) 6%,transparent)' : 'transparent' })); }
// ===== money =====

  money(v, dec = 0) { const r = dec ? v : Math.round(v); if (Math.abs(r) < 0.5) return '$0'; return (r > 0 ? '+' : '−') + '$' + Math.abs(r).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
// ===== appTicker =====

  appTicker(items) {
    const h = this.hv;
    const it = (t, k) => h('span', { key: k, style: { display: 'inline-flex', alignItems: 'center', gap: 10, padding: '0 24px', whiteSpace: 'nowrap' } }, h('span', { style: { color: 'var(--t-soft)' } }, t[0]), h('span', { style: { color: 'var(--t1)' } }, t[1]), h('span', { style: { color: t[2] < 0 ? 'var(--red)' : 'var(--green)' } }, (t[2] >= 0 ? '+' : '') + t[2].toFixed(2) + '%'));
    return h('div', { style: { display: 'flex', width: 'max-content', height: 46, alignItems: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, animation: 'dx-ticker 70s linear infinite' } }, items.concat(items).map(it));
  }
// ===== appVals =====

  appVals(s, w, egg) {
    const b = s.btc, n = b.length, last = b[n - 1].c, prevC = b[n - 2].c, chg = (last / prevC - 1) * 100, up = chg >= 0;
    const usd = (v, d = 2) => '$' + v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
    const num = v => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const aSz = [120, 85, 240, 60, 310, 180, 420, 95, 600], bSz = [150, 90, 260, 40, 380, 210, 500, 130, 560];
    let ca = 0, cb = 0; const A = [], Bd = [];
    aSz.forEach((sa, i) => { const pa = last + 10 * (i + 1), sz = bSz[i], pb = last - 10 * (i + 1); ca += sa; A.push({ p: pa, s: sa, t: ca }); cb += sz; Bd.push({ p: pb, s: sz, t: cb }); });
    const mx = Math.max(ca, cb), row = (o, i, off) => ({ p: usd(o.p), s: String(o.s), t: usd(o.p * o.s), depth: (o.t / mx * 100).toFixed(1) + '%', bg: s.flashRow === i + off ? 'color-mix(in srgb,var(--t1) 5%,transparent)' : 'transparent' });
    const k = b[s.btcHover ?? n - 1], kd = k.c - k.o, kup = kd >= 0;
    const two = x => String(x).padStart(2, '0'), d = new Date();
    const cw = s.appW || (Math.min(1680, w - 48) - 2), D = cw >= 1330, sc = D ? 1 : Math.min(1, cw / 1280);
    const t0 = s.btcTrades[0];
    const nPl = 12 * (last - 4620), money0 = v => (v >= 0 ? '+$' : '−$') + Math.abs(Math.round(v)).toLocaleString('en-US');
    const pos = [
      { ic: 'N', name: 'Niño 3.4', sub: 'NINO34-DEC26', size: '12', entry: '$4,620.00', mark: usd(last), pnl: money0(nPl), pct: (nPl >= 0 ? '+' : '−') + Math.abs((last / 4620 - 1) * 100).toFixed(1) + '%', pc: nPl >= 0 ? 'var(--green)' : 'var(--red)', liq: '$2,980.00' },
      { ic: 'N', name: 'Niño 1+2', sub: 'NINO12-DEC26', size: '5', entry: '$6,100.00', mark: '$7,400.00', pnl: '+$6,500', pct: '+21.3%', pc: 'var(--green)', liq: '$3,950.00' },
      { ic: 'E', name: 'Average egg price', sub: 'PRICE-EGGS', size: '4.2', entry: '$2.5377', mark: '$2.7180', pnl: '+$0.76', pct: '+7.10%', pc: 'var(--green)', liq: '$0.00' },
    ];
    const ls = on => on ? { bg: 'color-mix(in srgb,var(--emerald) 8%,transparent)', border: 'var(--green)', color: 'var(--green)', dotD: 'none', arD: 'inline' } : { bg: 'var(--card2)', border: 'var(--line2)', color: 'var(--t3)', dotD: 'inline-block', arD: 'none' };
    const addQ = v => () => this.setState(st => { const cur = parseFloat(String(st.bsize).replace(/,/g, '')) || 0; return { bsize: (cur + v).toLocaleString('en-US') }; });
    const tiV = { 'Margin Used': '31.1900', 'Reserved': '12.4000', 'Available': '24.5800' };
    const posN = { Positions: 5, 'Open Orders': 12, 'Trade History': 0, 'Order History': 50 };
    return {
      appRef: this.appRef, appScale: D ? 'none' : 'scale(' + sc.toFixed(4) + ')', appInnerW: D ? '100%' : '1280px', appH: Math.round(803 * sc) + 'px',
      btcTicker: this.appTicker([['NINO34-DEC26', usd(last), +chg.toFixed(2)], ['ETHEREUM', '$2,430.15', -1.49], ['GOLD', '$2,412.30', 0.31], ['NASDAQ', '$29,686.80', 0], ['PRICE-EGGS', '$' + egg.toFixed(3), 0.12], ['PRICE-MILK-US', '$4.52', 0], ['SILVER', '$75.96', 0.21], ['500', '$7,594.21', 0.08]]),
      btcStats: [['MARK', usd(last)], ['LAST', usd(t0.p), t0.up ? 'var(--green)' : 'var(--red)'], ['24H CHG', (up ? '+' : '') + chg.toFixed(1) + '%', up ? 'var(--green)' : 'var(--red)'], ['24H HIGH', usd(b[n - 1].h, 0)], ['24H LOW', usd(b[n - 1].l, 0)], ['BID', usd(Bd[0].p), 'var(--green)'], ['ASK', usd(A[0].p), 'var(--red)'], ['SPREAD', '$20.00'], ['VOLUME', '$184K'], ['TRADES', '1,412']].map(([l, v, c]) => ({ l, v, c: c || 'var(--t1)' })),
      btcChart: this.candle(b, 'btcHover', 240, { fmt: num, lvFmt: v => v.toLocaleString('en-US'), axis: 72, noOhlc: true, vol: true, levels: [5500, 5000, 4500, 4000, 3500], range: [2850, 5800], ref: { v: 3000, label: 'Neutral (0.0 °C)' } }),
      btcLeg: { o: num(k.o), h: num(k.h), l: num(k.l), c: num(k.c), chg: (kup ? '+' : '−') + num(Math.abs(kd)) + ' (' + (kup ? '+' : '−') + Math.abs(kd / k.o * 100).toFixed(2) + '%)', col: kup ? 'var(--green)' : 'var(--red)' },
      clock: two(d.getUTCHours()) + ':' + two(d.getUTCMinutes()) + ':' + two(d.getUTCSeconds()) + ' UTC',
      bookTabs: [['book', 'BOOK'], ['trades', 'TRADES']].map(([id, label]) => ({ label, on: () => this.setState({ bookTab: id }), bg: s.bookTab === id ? 'var(--line2)' : 'transparent', color: s.bookTab === id ? 'var(--t1)' : 'var(--t2)' })),
      showBook: s.bookTab === 'book', showTrades: s.bookTab === 'trades',
      btcAsks: A.slice().reverse().map((o, i) => row(o, i, 0)), btcBids: Bd.map((o, i) => row(o, i, 9)), askCount: A.length + ' orders', bidCount: Bd.length + ' orders', spreadTxt: '$20.00 · ' + (20 / last * 100).toFixed(2) + '%',
      btcTr: s.btcTrades.map(t => { const x = new Date(t.t); return { p: usd(t.p), s: String(t.s), t: two(x.getHours()) + ':' + two(x.getMinutes()) + ':' + two(x.getSeconds()), color: t.up ? 'var(--green)' : 'var(--red)' }; }),
      curPrice: usd(last), curChg: (up ? '↑ ' : '↓ ') + Math.abs(chg).toFixed(2) + '%', curChgColor: up ? 'var(--green)' : 'var(--red)',
      tiTabs: Object.keys(tiV).map(t => ({ label: t, on: () => this.setState({ tiTab: t }), bg: s.tiTab === t ? 'var(--line2)' : 'transparent', color: s.tiTab === t ? 'var(--t1)' : 'var(--t3)' })), tiLabel: s.tiTab + ':', tiVal: tiV[s.tiTab],
      mkTabs: ['Market', 'Limit'].map(t => ({ label: t, on: () => this.setState({ tab: t }), bg: s.tab === t ? 'var(--ln)' : 'transparent', color: s.tab === t ? 'var(--t1)' : 'var(--t3)', dot: s.tab === t ? 'var(--green)' : 'var(--t4)' })),
      lsL: ls(s.side === 'long'), lsS: ls(s.side !== 'long'),
      bsize: s.bsize, onBSize: e => this.setState({ bsize: e.target.value.replace(/[^0-9.,]/g, '').slice(0, 12) }),
      quick: [['+$100', 100], ['+$500', 500], ['+$1K', 1000], ['+$5K', 5000]].map(([label, v]) => ({ label, on: addQ(v), color: 'var(--t3)' })).concat({ label: 'Max', on: () => this.setState({ bsize: '24.58' }), color: 'var(--blue)' }),
      posTabs: Object.keys(posN).map(t => ({ label: t, n: posN[t], on: () => this.setState({ posTab: t }), border: s.posTab === t ? 'var(--line2)' : 'transparent', bg: s.posTab === t ? 'var(--card2)' : 'transparent', color: s.posTab === t ? 'var(--t1)' : 'var(--t-soft)' })),
      showPos: s.posTab === 'Positions', posEmptyOn: s.posTab !== 'Positions', posEmpty: posN[s.posTab] ? 'Open the app to view ' + s.posTab.toLowerCase() : 'No ' + s.posTab.toLowerCase() + ' yet', btcPos: pos,
      simMk: [['Niño 1+2', 'Climate'], ['PRICE-EGGS', 'Commodities'], ['Silver', 'Precious Metals']].map(([nm, c], i) => ({ n: nm, c, spark: this.area(this.simS[i], 'var(--green)', 'sim' + i, { sw: 1.25 }) })),
    };
  }
// ===== renderVals (excerpt: where appVals is merged) =====

  renderVals() {
    const s = this.state, w = s.w, L = w >= 1100, M = w >= 900, S = w >= 640;
    const cs = s.cs, last = cs[cs.length - 1].c, chg = (last / this.open24 - 1) * 100;
    const tk = [['PRICE-EGGS', '$' + last.toFixed(3), +chg.toFixed(2)], ['PRICE-MILK-US', '$4.12', 0.24], ['CRUDE-OIL', '$71.84', -0.62], ['GOLD', '$2,412.30', 0.31], ['SILVER', '$29.84', 0.48], ['NASDAQ', '$18,240.11', -0.12], ['GPU-H100', '$2.00', 0], ['ERCOT-N', '$38.40', 1.12], ['DRAM-DDR5', '$4.85', -0.41], ['FREIGHT-FEU', '$2,140', 0.66], ['BTC', '$64,210.00', 0.86], ['ETH', '$3,120.45', -0.33]];
    const sizeN = parseFloat(String(s.size).replace(/[^0-9.]/g, '')) || 0, lev = parseInt(s.lev), long = s.side === 'long';
    const liq = long ? last * (1 - 0.9 / lev) : last * (1 + 0.9 / lev);
    const b = s.book;
    const c4 = M ? 'repeat(4,minmax(0,1fr))' : S ? 'repeat(2,minmax(0,1fr))' : 'minmax(0,1fr)';
    return {
      ...this.heroVals(s, w, last, chg), wide: M, narrow: !M, menuOpen: s.menu && w <= 1100, toggleMenu: () => this.setState({ menu: !s.menu }),
      heroCols: w >= 1024 ? 'minmax(0,5fr) minmax(0,7fr)' : 'minmax(0,1fr)', 
      termCols: S ? 'minmax(0,1fr) 210px' : 'minmax(0,1fr)', 
...
ee: '$' + (sizeN * lev * 0.001).toFixed(2), btn: (long ? 'Long' : 'Short') + ' PRICE-EGGS', btnBg: long ? 'var(--green)' : 'var(--red)' },
      stats: [{ label: 'Markets live', value: '9', sub: 'ON MAINNET' }, { label: 'Fee per trade', value: '~0.10%', sub: 'VS ~2%' }, { label: 'Settlement', value: 'UMA', sub: 'OPTIMISTIC ORACLE' }, { label: 'Custody', value: 'Your wallet', sub: 'USDC' }, { label: 'Gas', value: '$0', sub: 'GASLESS' }].map((x, i) => ({ ...x, span: !M && i === 0 ? 'span 2' : 'auto', bb: M ? 'none' : '1px solid var(--hair)' })),
      ...this.restVals(s, M, S, L, last), ...this.appVals(s, w, last),
      netRef: this.netRef, netSvg: this.netSvg(), netH: w < 640 ? '420px' : w < 900 ? '320px' : '380px', probCols: L ? 'minmax(0,62fr) minmax(0,38fr)' : 'minmax(0,1fr)', probRows: L ? 'repeat(2,minmax(0,1fr))' : 'auto', probStatCols: L ? 'repeat(2,minmax(0,1fr))' : M ? 'repeat(4,minmax(0,1fr))' : 'repeat(2,minmax(0,1fr))',
      netToday: () => { clearTimeout(this.netAuto); th