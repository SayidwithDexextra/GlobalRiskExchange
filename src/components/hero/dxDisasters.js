/*
 * Dexetera hero disaster layer. Port of the Claude Design "Dexetera Landing v2" hero (startDz).
 * One photographic storm image at a time (rain adds live falling streaks) fades in at the side of the hero, behind the copy,
 * rocks and dashboard. Lightning (dx-storm) is separate and untouched.
 *
 * startDisasters(layer, opts) -> stop()
 *   layer: an absolutely positioned, overflow-hidden div inside the hero stage (inset 0)
 *   opts.base:   image path prefix, default "/assets/dx-"  ->  /assets/dx-tornado.webp etc.
 *   opts.top:    header height in px, default 84
 *   opts.copy / opts.dash / opts.rock: optional elements; auto-detected when omitted
 */
export function startDisasters(L, opts) {
  opts = opts || {};
  if (!L || L.__dxOn) return () => {};
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  L.__dxOn = 1;
  const BASE = opts.base || '/assets/dx-', TOP = opts.top == null ? 84 : opts.top;
  const R = (a, b) => a + Math.random() * (b - a), html = document.documentElement;
  const stage = L.parentElement;

  const findCopy = () => opts.copy || stage.querySelector('[data-hero-copy]') || (() => {
    const h1 = stage.querySelector('h1'); if (!h1) return null; let e = h1;
    while (e.parentElement && e.parentElement !== stage) e = e.parentElement; return e; })();
  const findDash = (cp) => opts.dash || stage.querySelector('[data-hero-dash]') || (() => {
    const lr = stage.getBoundingClientRect(), cb = cp ? cp.getBoundingClientRect().bottom : lr.top + lr.height * 0.5;
    let best = null, bt = Infinity;
    stage.querySelectorAll(':scope > *, :scope > * > *').forEach(el => {
      if (el === L || el === cp || (cp && (el.contains(cp) || cp.contains(el)))) return;
      const cs = getComputedStyle(el); if (cs.position === 'absolute' && cs.inset === '0px') return;
      if (/hero_rocks/.test(cs.backgroundImage)) return;
      const b = el.getBoundingClientRect(); if (b.width < lr.width * 0.4 || b.top < cb - 1) return;
      if (b.top < bt) { bt = b.top; best = el; } });
    return best; })();
  const findRock = () => opts.rock || stage.querySelector('[data-hero-rock]') || (() => {
    for (const el of stage.querySelectorAll('div')) if (/hero_rocks/.test(getComputedStyle(el).backgroundImage)) return el; return null; })();

  const theme = () => { const lt = html.getAttribute('data-theme') === 'light';
    L.style.mixBlendMode = lt ? 'multiply' : 'screen'; L.style.filter = lt ? 'invert(1)' : 'none'; L.style.opacity = lt ? '0.5' : '1'; };
  theme(); const mo = new MutationObserver(theme); mo.observe(html, { attributes: true, attributeFilter: ['data-theme'] });

  const defs = { tornado: [270, 400, 0.6], hurricane: [480, 480, 0.35], wind: [700, 460, 0.45], wildfire: [270, 400, 0.55], surge: [440, 290, 0.32], rain: [480, 320, 0.6] };
  const imgs = {}; let lastK = '', timer = 0, anims = [], dead = false;
  const CSS = 'position:absolute;left:0;top:0;opacity:0;max-width:none;will-change:transform,opacity;pointer-events:none;user-select:none';
  const load = () => Object.keys(defs).forEach(k => { const im = new Image(); im.decoding = 'async'; im.alt = ''; im.src = BASE + k + '.webp';
    if (k !== 'rain') { im.style.cssText = CSS; imgs[k] = im; return; }
    // Rain: the cloud photo plus live falling streaks drawn under its base.
    const box = document.createElement('div'); box.style.cssText = CSS; box.__img = im;
    im.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;max-width:none';
    const cv = document.createElement('canvas'); box.__cv = cv;
    cv.style.cssText = 'position:absolute;left:27%;top:44%;width:46%;height:50%;-webkit-mask-image:linear-gradient(to bottom,transparent,#000 12%,#000 45%,transparent),linear-gradient(to right,transparent,#000 18%,#000 82%,transparent);mask-image:linear-gradient(to bottom,transparent,#000 12%,#000 45%,transparent),linear-gradient(to right,transparent,#000 18%,#000 82%,transparent);-webkit-mask-composite:source-in;mask-composite:intersect';
    box.appendChild(im); box.appendChild(cv); imgs[k] = box; });
  let rainRaf = 0;
  const rainStart = (box) => {
    const cv = box.__cv, dpr = Math.min(2, window.devicePixelRatio || 1), cw = cv.clientWidth, ch = cv.clientHeight;
    if (!cw || !ch) return; cv.width = cw * dpr; cv.height = ch * dpr;
    const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.lineCap = 'round';
    const n = Math.round(cw * 0.55), drops = [];
    for (let i = 0; i < n; i++) drops.push({ x: R(0, cw), y: R(-ch, ch), l: R(10, 26), v: R(520, 820), a: R(0.12, 0.42), w: R(0.6, 1.3) });
    let t0 = performance.now();
    const tick = (t) => { const dt = Math.min(0.05, (t - t0) / 1000); t0 = t; c.clearRect(0, 0, cw, ch);
      for (const d of drops) { d.y += d.v * dt; d.x -= d.v * dt * 0.06; if (d.y - d.l > ch) { d.y = R(-30, 0); d.x = R(0, cw + 20); }
        c.strokeStyle = 'rgba(235,240,245,' + d.a + ')'; c.lineWidth = d.w; c.beginPath(); c.moveTo(d.x, d.y); c.lineTo(d.x + d.l * 0.06, d.y - d.l); c.stroke(); }
      rainRaf = box.isConnected ? requestAnimationFrame(tick) : 0; };
    cancelAnimationFrame(rainRaf); rainRaf = requestAnimationFrame(tick);
  };
  const geo = () => {
    const W = L.clientWidth, H = L.clientHeight, cp = findCopy(), dd = findDash(cp), rk = findRock(), lr = L.getBoundingClientRect();
    let cl = W * 0.27, cr = W * 0.73, hTop = 160;
    if (cp) { cp.querySelectorAll('h1,p,a,button').forEach(c => { const b = c.getBoundingClientRect(); if (!b.width) return; cl = Math.min(cl, b.left - lr.left); cr = Math.max(cr, b.right - lr.left); });
      const h1 = cp.querySelector('h1'); if (h1) hTop = h1.getBoundingClientRect().top - lr.top; }
    const rTop = rk ? rk.getBoundingClientRect().top - lr.top : H * 0.6;
    const dTop = dd ? dd.getBoundingClientRect().top - lr.top : H * 0.6;
    return { W, cl: cl - 24, cr: cr + 24, dTop, hTop, rTop };
  };
  const spawn = () => {
    timer = 0; if (dead || document.hidden) return;
    const ks = Object.keys(defs); let k; do { k = ks[Math.floor(Math.random() * ks.length)]; } while (k === lastK);
    const im = imgs[k], src = im && (im.__img || im); if (!im || !src.complete || !src.naturalWidth) { timer = setTimeout(spawn, 1500); return; }
    lastK = k;
    const g = geo(), mob = g.W < 640, sc = mob ? 0.6 : 1, d = defs[k], w = d[0] * sc, hh = d[1] * sc, op = d[2] * (mob ? 2 / 3 : 1), side = Math.random() < 0.5 ? -1 : 1;
    const edge = (vis) => side < 0 ? Math.min(-w * (1 - vis), g.cl - w) : Math.max(g.W - w * vis, g.cr);
    const yIn = () => TOP + Math.max(0, g.dTop - TOP - hh) * R(0.1, 0.6);
    let x, y, tf;
    if (mob) { x = side < 0 ? R(-w * 0.3, g.W * 0.12) : g.W - w + R(-g.W * 0.12, w * 0.3); y = TOP - hh * 0.2; }
    if (k === 'tornado' || k === 'wildfire') {
      if (!mob) { x = side < 0 ? Math.min(g.cl * 0.5 - w / 2, g.cl - w) : Math.max(g.cr + (g.W - g.cr) * 0.5 - w / 2, g.cr); y = yIn(); }
      tf = k === 'tornado'
        ? [[0, 0, 0, 'rotate(-1.5deg)'], [0.35, 0.35, 0, 'rotate(1.5deg)'], [0.7, 0.7, 0, 'rotate(-1deg)'], [1, 1, 0, 'rotate(1.5deg)']].map(f => [f[0], side * 30 * f[1], 0, f[3]])
        : [[0, 0, 0, 'scale(1)'], [1, 0, -20, 'scale(1.06)']];
    } else if (k === 'hurricane') {
      if (!mob) { x = edge(0.65); y = TOP - 60; }
      tf = [[0, 0, 0, 'rotate(0deg)'], [1, 0, 0, 'rotate(-8deg)']];
    } else if (k === 'rain') {
      if (!mob) { x = side < 0 ? Math.min(g.cl * 0.5 - w / 2, g.cl - w) : Math.max(g.cr + (g.W - g.cr) * 0.5 - w / 2, g.cr); y = TOP - hh * 0.12; }
      tf = [[0, 0, 0, ''], [1, side * 40, 0, '']];
    } else if (k === 'wind') {
      if (!mob) { x = edge(0.75); y = TOP + R(0, 60); }
      tf = [[0, 0, 0, ''], [1, side * 80, 0, '']];
    } else {
      if (!mob) { x = side < 0 ? Math.min(g.cl * 0.5 - w / 2, g.cl - w) : Math.max(g.cr + (g.W - g.cr) * 0.5 - w / 2, g.cr); y = Math.max(TOP, Math.min(g.dTop, g.rTop) - hh * 0.85); }
      tf = [[0, 0, 0, ''], [0.5, 0, -24, ''], [1, 0, 0, '']];
    }
    if (!mob) { const dxs = tf.map(f => f[1]), gw = w * (k === 'wildfire' ? 1.06 : 1) + (k === 'tornado' ? hh * 0.03 : 0);
      x = side < 0 ? Math.min(x, g.cl - gw - Math.max(...dxs)) : Math.max(x, g.cr - Math.min(...dxs) + (gw - w)); }
    L.style.webkitMaskImage = L.style.maskImage = mob
      ? 'linear-gradient(to bottom,transparent ' + (TOP - 10) + 'px,#000 ' + (TOP + 20) + 'px,#000 ' + (g.hTop - 20) + 'px,transparent ' + (g.hTop + 4) + 'px)'
      : 'linear-gradient(to bottom,transparent ' + (TOP - 4) + 'px,#000 ' + (TOP + 40) + 'px)';
    im.style.width = w + 'px'; im.style.height = hh + 'px'; im.style.transformOrigin = k === 'wildfire' ? '50% 100%' : '50% 50%';
    L.appendChild(im); if (k === 'rain') rainStart(im);
    const fi = 2500, hold = R(4000, 6000), fo = 3000, D = fi + hold + fo;
    anims = [
      im.animate([{ offset: 0, opacity: 0 }, { offset: fi / D, opacity: op }, { offset: (fi + hold) / D, opacity: op }, { offset: 1, opacity: 0 }], { duration: D, easing: 'linear', fill: 'both' }),
      im.animate(tf.map(f => ({ offset: f[0], transform: 'translate(' + (x + f[1]).toFixed(1) + 'px,' + (y + f[2]).toFixed(1) + 'px)' + (f[3] ? ' ' + f[3] : ''), easing: 'ease-in-out' })), { duration: D, fill: 'both' }),
    ];
    L.__dxLast = { k, x, y, w, h: hh, op, g };
    anims[0].onfinish = () => { im.remove(); anims = []; if (!dead) timer = setTimeout(spawn, Math.max(800, R(10000, 14000) - D)); };
  };
  const onVis = () => {
    if (document.hidden) anims.forEach(a => a.pause());
    else { anims.forEach(a => a.play()); if (!anims.length && !timer) timer = setTimeout(spawn, 2000); }
  };
  document.addEventListener('visibilitychange', onVis);
  let t1 = 0; const raf = requestAnimationFrame(() => requestAnimationFrame(() => { t1 = setTimeout(load, opts.loadDelay == null ? 1200 : opts.loadDelay); timer = setTimeout(spawn, opts.firstDelay == null ? 3500 : opts.firstDelay); }));
  L.__dxSpawn = spawn;
  return () => { dead = true; cancelAnimationFrame(raf); cancelAnimationFrame(rainRaf); clearTimeout(t1); clearTimeout(timer); anims.forEach(a => a.cancel()); mo.disconnect();
    document.removeEventListener('visibilitychange', onVis); Object.values(imgs).forEach(i => i.remove()); L.__dxOn = 0; };
}
