'use client';

import { useEffect, useRef } from 'react';

export function HeroStorm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 1, H = 1;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let running = true;
    let visible = true;
    let last = performance.now();
    let next = 1600;
    const bolts: any[] = [];
    const clouds: any[] = [];
    const TOP = 84; // header height + margin

    function light() {
      return document.documentElement.getAttribute('data-theme') === 'light';
    }

    function pal() {
      return light()
        ? { core: 'rgba(64,64,64,', up: '22,163,74', dn: '220,38,38', cloud: '120,122,128', cloudA: 0.10, blend: 'source-over' as GlobalCompositeOperation, glow: 0.10 }
        : { core: 'rgba(255,255,255,', up: '74,222,128', dn: '248,113,113', cloud: '70,72,78', cloudA: 0.42, blend: 'lighter' as GlobalCompositeOperation, glow: 0.14 };
    }

    function rnd(a: number, b: number) {
      return a + Math.random() * (b - a);
    }

    function buildClouds() {
      clouds.length = 0;
      const n = Math.max(8, Math.round(W / 110));
      for (let i = 0; i < n; i++) {
        clouds.push({
          x: rnd(-0.1, 1.1) * W,
          y: rnd(-0.08, 0.12) * H,
          r: rnd(140, 260),
          a: rnd(0.4, 1),
          v: rnd(3, 8) * (Math.random() < 0.5 ? -1 : 1)
        });
      }
    }

    // Midpoint displacement for natural lightning path
    function path(x0: number, y0: number, x1: number, y1: number, disp: number, depth: number): [number, number][] {
      let pts: [number, number][] = [[x0, y0], [x1, y1]];
      for (let d = 0; d < depth; d++) {
        const out: [number, number][] = [pts[0]];
        for (let i = 0; i < pts.length - 1; i++) {
          const a = pts[i], b = pts[i + 1];
          out.push(
            [(a[0] + b[0]) / 2 + rnd(-disp, disp), (a[1] + b[1]) / 2 + rnd(-disp * 0.25, disp * 0.25)],
            b
          );
        }
        pts = out;
        disp *= 0.55;
      }
      return pts;
    }

    function strike() {
      const side = Math.random() < 0.5 ? -1 : 1;
      const x = (0.5 + side * rnd(0.27, 0.45)) * W; // side lanes only
      const y1 = H * rnd(0.45, 0.78);
      const y0 = TOP + rnd(4, 22); // start below header
      const main = path(x, y0, x + side * rnd(-0.02, 0.06) * W, y1, (y1 - y0) * 0.22, 7);
      const br: [number, number][][] = [];
      if (Math.random() < 0.6) {
        const k = Math.floor(rnd(0.3, 0.6) * main.length);
        const s = main[k];
        const len = (y1 - y0) * rnd(0.18, 0.32);
        br.push(path(s[0], s[1], s[0] + rnd(-1, 1) * len * 0.8, s[1] + len, len * 0.25, 5));
      }
      bolts.push({
        main,
        br,
        x,
        y0,
        up: Math.random() < 0.5,
        t: 0,
        life: rnd(0.55, 0.8),
        re: rnd(0.11, 0.16)
      });
    }

    function alphaAt(b: any) {
      const t = b.t;
      if (t < 0.06) return 1;
      if (t < b.re) return 0.18; // subtle re-strike
      if (t < b.re + 0.05) return 0.85;
      return Math.max(0, 1 - (t - b.re - 0.05) / (b.life - b.re - 0.05));
    }

    function strokePath(c: CanvasRenderingContext2D, pts: [number, number][], w: number, style: string) {
      c.lineWidth = w;
      c.strokeStyle = style;
      c.beginPath();
      c.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) {
        c.lineTo(pts[i][0], pts[i][1]);
      }
      c.stroke();
    }

    function resize() {
      if (!canvas || !ctx || !hero) return;
      const r = hero.getBoundingClientRect();
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      buildClouds();
    }

    function frame(now: number) {
      if (!running || !ctx) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const p = pal();
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (!reduce) {
        next -= dt * 1000;
        if (next <= 0) {
          strike();
          next = rnd(3200, 6500);
        }
      }

      // Soft drifting cloud deck
      for (let i = 0; i < clouds.length; i++) {
        const c = clouds[i];
        c.x += c.v * dt;
        if (c.x < -c.r * 1.5) c.x = W + c.r;
        if (c.x > W + c.r * 1.5) c.x = -c.r;
        const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
        g.addColorStop(0, `rgba(${p.cloud},${p.cloudA * c.a})`);
        g.addColorStop(1, `rgba(${p.cloud},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, 6.2832);
        ctx.fill();
      }

      ctx.save();
      ctx.globalCompositeOperation = p.blend;

      for (let j = bolts.length - 1; j >= 0; j--) {
        const b = bolts[j];
        b.t += dt;
        const a = alphaAt(b);
        const tint = b.up ? p.up : p.dn;

        // Faint light inside the cloud
        const cy = b.y0 + 130;
        const cg = ctx.createRadialGradient(b.x, cy, 0, b.x, cy, 230);
        cg.addColorStop(0, `rgba(${tint},${p.glow * a})`);
        cg.addColorStop(1, `rgba(${tint},0)`);
        ctx.fillStyle = cg;
        ctx.fillRect(b.x - 240, cy - 240, 480, 480);

        // Draw top-down
        const n = Math.max(2, Math.ceil(b.main.length * Math.min(1, b.t / 0.08)));
        const seg = b.main.slice(0, n);
        strokePath(ctx, seg, 6, `rgba(${tint},${0.10 * a})`); // soft tinted halo
        strokePath(ctx, seg, 1.25, `${p.core}${0.9 * a})`); // hairline core

        if (n >= b.main.length) {
          for (let k = 0; k < b.br.length; k++) {
            strokePath(ctx, b.br[k], 0.8, `${p.core}${0.45 * a})`);
          }
        }

        if (b.t > b.life) bolts.splice(j, 1);
      }

      ctx.restore();
      requestAnimationFrame(frame);
    }

    function start() {
      if (!running && visible && !document.hidden) {
        running = true;
        last = performance.now();
        requestAnimationFrame(frame);
      }
    }

    resize();
    window.addEventListener('resize', resize);

    // Intersection observer to pause off-screen
    if ('IntersectionObserver' in window && hero) {
      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        if (visible) start();
        else running = false;
      }).observe(hero);
    }

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) running = false;
      else start();
    });

    requestAnimationFrame(frame);

    return () => {
      running = false;
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div ref={heroRef} className="absolute inset-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
