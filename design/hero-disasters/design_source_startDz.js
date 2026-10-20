  startDz() {
    const L = this.dzRef.current; if (!L || L.__on) return; L.__on = 1;
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const R = (a, b) => a + Math.random() * (b - a), html = document.documentElement, TOP = 84;
    const theme = () => { const lt = html.getAttribute('data-theme') === 'light'; L.style.mixBlendMode = lt ? 'multiply' : 'screen'; L.style.filter = lt ? 'invert(1)' : 'none'; L.style.opacity = lt ? '0.5' : '1'; };
    theme(); new MutationObserver(theme).observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    const defs = { tornado: [270, 400, 0.6], hurricane: [480, 480, 0.35], wind: [700, 460, 0.45], wildfire: [270, 400, 0.55], surge: [440, 290, 0.32] };
    const imgs = {}; let lastK = '', timer = 0, anims = [];
    const load = () => Object.keys(defs).forEach(k => { const im = new Image(); im.decoding = 'async'; im.alt = ''; im.src = 'assets/dx-' + k + '.webp';
      im.style.cssText = 'position:absolute;left:0;top:0;opacity:0;max-width:none;will-change:transform,opacity;pointer-events:none;user-select:none'; imgs[k] = im; });
    const geo = () => {
      const W = L.clientWidth, H = L.clientHeight, cp = this.copyRef.current, dd = this.dashRef.current, rk = this.rockLRef.current, lr = L.getBoundingClientRect();
      let cl = W * 0.27, cr = W * 0.73, hTop = 160;
      if (cp) { cp.querySelectorAll('h1,p,a,button').forEach(c => { const b = c.getBoundingClientRect(); if (!b.width) return; cl = Math.min(cl, b.left - lr.left); cr = Math.max(cr, b.right - lr.left); });
        const h1 = cp.querySelector('h1'); if (h1) hTop = cp.offsetTop + h1.offsetTop; }
      const rTop = rk ? rk.getBoundingClientRect().top - lr.top : H * 0.6;
      return { W, cl: cl - 24, cr: cr + 24, dTop: dd ? dd.offsetTop : H * 0.6, hTop, rTop };
    };
    const spawn = () => {
      timer = 0; if (document.hidden) return;
      const ks = Object.keys(defs); let k; do { k = ks[Math.floor(Math.random() * ks.length)]; } while (k === lastK);
      const im = imgs[k]; if (!im || !im.complete || !im.naturalWidth) { timer = setTimeout(spawn, 1500); return; }
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
      } else if (k === 'wind') {
        if (!mob) { x = edge(0.75); y = TOP + R(0, 60); }
        tf = [[0, 0, 0, 'none'], [1, side * 80, 0, 'none']];
      } else {
        if (!mob) { x = side < 0 ? Math.min(g.cl * 0.5 - w / 2, g.cl - w) : Math.max(g.cr + (g.W - g.cr) * 0.5 - w / 2, g.cr); y = Math.max(TOP, Math.min(g.dTop, g.rTop) - hh * 0.85); }
        tf = [[0, 0, 0, 'none'], [0.5, 0, -24, 'none'], [1, 0, 0, 'none']];
      }
      if (!mob) { const dxs = tf.map(f => f[1]), gw = w * (k === 'wildfire' ? 1.06 : 1) + (k === 'tornado' ? hh * 0.03 : 0);
        x = side < 0 ? Math.min(x, g.cl - gw - Math.max(...dxs)) : Math.max(x, g.cr - Math.min(...dxs) + (gw - w)); }
      L.style.webkitMaskImage = L.style.maskImage = mob
        ? 'linear-gradient(to bottom,transparent ' + (TOP - 10) + 'px,#000 ' + (TOP + 20) + 'px,#000 ' + (g.hTop - 20) + 'px,transparent ' + (g.hTop + 4) + 'px)'
        : 'linear-gradient(to bottom,transparent ' + (TOP - 4) + 'px,#000 ' + (TOP + 40) + 'px)';
      im.style.width = w + 'px'; im.style.height = hh + 'px'; im.style.transformOrigin = k === 'wildfire' ? '50% 100%' : '50% 50%';
      L.appendChild(im);
      const fi = 2500, hold = R(4000, 6000), fo = 3000, D = fi + hold + fo;
      anims = [
        im.animate([{ offset: 0, opacity: 0 }, { offset: fi / D, opacity: op }, { offset: (fi + hold) / D, opacity: op }, { offset: 1, opacity: 0 }], { duration: D, easing: 'linear', fill: 'both' }),
        im.animate(tf.map(f => ({ offset: f[0], transform: 'translate(' + (x + f[1]).toFixed(1) + 'px,' + (y + f[2]).toFixed(1) + 'px) ' + f[3], easing: 'ease-in-out' })), { duration: D, fill: 'both' }),
      ];
      anims[0].onfinish = () => { im.remove(); anims = []; timer = setTimeout(spawn, Math.max(800, R(10000, 14000) - D)); };
    };
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) anims.forEach(a => a.pause());
      else { anims.forEach(a => a.play()); if (!anims.length && !timer) timer = setTimeout(spawn, 2000); }
    });
    requestAnimationFrame(() => requestAnimationFrame(() => { setTimeout(load, 1200); timer = setTimeout(spawn, 3500); }));
  }
  componentDidMount() {
