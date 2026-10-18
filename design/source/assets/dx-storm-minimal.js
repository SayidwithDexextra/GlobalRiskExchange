/* Dexetera hero storm (minimal). Thin hairline lightning from soft clouds.
   Usage: <canvas class="dx-storm"></canvas> in the hero, then dxStorm(heroEl, canvasEl).
   Follows [data-theme] on <html>. Respects prefers-reduced-motion. Pauses off-screen. */
(function () {
  function dxStorm(hero, cv) {
    var ctx = cv.getContext('2d');
    var W = 1, H = 1, DPR = Math.min(window.devicePixelRatio || 1, 2);
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var running = true, visible = true, last = performance.now(), next = 1600;
    var bolts = [], clouds = [], TOP = 84; /* header height + margin */

    function light() { return document.documentElement.getAttribute('data-theme') === 'light'; }
    function pal() {
      return light()
        ? { core: 'rgba(64,64,64,', up: '22,163,74', dn: '220,38,38', cloud: '120,122,128', cloudA: 0.10, blend: 'source-over', glow: 0.10 }
        : { core: 'rgba(255,255,255,', up: '74,222,128', dn: '248,113,113', cloud: '70,72,78', cloudA: 0.42, blend: 'lighter', glow: 0.14 };
    }
    function rnd(a, b) { return a + Math.random() * (b - a); }

    function buildClouds() {
      clouds = [];
      var n = Math.max(8, Math.round(W / 110));
      for (var i = 0; i < n; i++) clouds.push({ x: rnd(-0.1, 1.1) * W, y: rnd(-0.08, 0.12) * H, r: rnd(140, 260), a: rnd(0.4, 1), v: rnd(3, 8) * (Math.random() < 0.5 ? -1 : 1) });
    }

    /* midpoint displacement gives a natural, fine lightning path */
    function path(x0, y0, x1, y1, disp, depth) {
      var pts = [[x0, y0], [x1, y1]];
      for (var d = 0; d < depth; d++) {
        var out = [pts[0]];
        for (var i = 0; i < pts.length - 1; i++) {
          var a = pts[i], b = pts[i + 1];
          out.push([(a[0] + b[0]) / 2 + rnd(-disp, disp), (a[1] + b[1]) / 2 + rnd(-disp * 0.25, disp * 0.25)], b);
        }
        pts = out; disp *= 0.55;
      }
      return pts;
    }
    function strike() {
      var side = Math.random() < 0.5 ? -1 : 1;
      var x = (0.5 + side * rnd(0.27, 0.45)) * W;   /* side lanes only: the headline column stays clear */
      var y1 = H * rnd(0.45, 0.78);
      var y0 = TOP + rnd(4, 22);   /* start below the header so the menu stays clear */
      var main = path(x, y0, x + side * rnd(-0.02, 0.06) * W, y1, (y1 - y0) * 0.22, 7);
      var br = [];
      if (Math.random() < 0.6) {
        var k = Math.floor(rnd(0.3, 0.6) * main.length), s = main[k], len = (y1 - y0) * rnd(0.18, 0.32);
        br.push(path(s[0], s[1], s[0] + rnd(-1, 1) * len * 0.8, s[1] + len, len * 0.25, 5));
      }
      bolts.push({ main: main, br: br, x: x, y0: y0, up: Math.random() < 0.5, t: 0, life: rnd(0.55, 0.8), re: rnd(0.11, 0.16) });
    }
    function alphaAt(b) {
      var t = b.t;
      if (t < 0.06) return 1;
      if (t < b.re) return 0.18;               /* one subtle re-strike */
      if (t < b.re + 0.05) return 0.85;
      return Math.max(0, 1 - (t - b.re - 0.05) / (b.life - b.re - 0.05));
    }
    function stroke(pts, w, style) {
      ctx.lineWidth = w; ctx.strokeStyle = style; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.stroke();
    }

    function resize() {
      var r = hero.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      buildClouds();
    }
    function frame(now) {
      if (!running) return;
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      var p = pal();
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';

      if (!reduce) { next -= dt * 1000; if (next <= 0) { strike(); next = rnd(3200, 6500); } }

      /* soft drifting cloud deck */
      for (var i = 0; i < clouds.length; i++) {
        var c = clouds[i]; c.x += c.v * dt;
        if (c.x < -c.r * 1.5) c.x = W + c.r; if (c.x > W + c.r * 1.5) c.x = -c.r;
        var g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
        g.addColorStop(0, 'rgba(' + p.cloud + ',' + (p.cloudA * c.a) + ')'); g.addColorStop(1, 'rgba(' + p.cloud + ',0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, 6.2832); ctx.fill();
      }

      ctx.save(); ctx.globalCompositeOperation = p.blend;
      for (var j = bolts.length - 1; j >= 0; j--) {
        var b = bolts[j]; b.t += dt;
        var a = alphaAt(b), tint = b.up ? p.up : p.dn;
        /* faint light inside the cloud */
        var cy = b.y0 + 130; var cg = ctx.createRadialGradient(b.x, cy, 0, b.x, cy, 230);   /* centred low so it fades to nothing before the header */
        cg.addColorStop(0, 'rgba(' + tint + ',' + (p.glow * a) + ')'); cg.addColorStop(1, 'rgba(' + tint + ',0)');
        ctx.fillStyle = cg; ctx.fillRect(b.x - 240, cy - 240, 480, 480);
        /* draw top-down quickly */
        var n = Math.max(2, Math.ceil(b.main.length * Math.min(1, b.t / 0.08)));
        var seg = b.main.slice(0, n);
        stroke(seg, 6, 'rgba(' + tint + ',' + (0.10 * a) + ')');   /* soft tinted halo */
        stroke(seg, 1.25, p.core + (0.9 * a) + ')');                /* hairline core */
        if (n >= b.main.length) for (var k = 0; k < b.br.length; k++) stroke(b.br[k], 0.8, p.core + (0.45 * a) + ')');
        if (b.t > b.life) bolts.splice(j, 1);
      }
      ctx.restore();
      requestAnimationFrame(frame);
    }
    function start() { if (!running && visible && !document.hidden) { running = true; last = performance.now(); requestAnimationFrame(frame); } }

    hero.__dxStrike = strike;
    resize();
    addEventListener('resize', resize);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; visible ? start() : (running = false); }).observe(hero);
    document.addEventListener('visibilitychange', function () { document.hidden ? (running = false) : start(); });
    requestAnimationFrame(frame);
  }
  window.dxStorm = dxStorm;
})();
