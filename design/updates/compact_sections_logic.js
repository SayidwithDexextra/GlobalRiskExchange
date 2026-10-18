// Responsive values (from renderVals). M = width >= 900, L = width >= 1100
featWrap:    M ? 'nowrap' : 'wrap',
wallRows:    M ? '300px' : 'auto',                       // card band is a fixed 300px from 900px up
wallCols:    M ? 'minmax(0,4fr) minmax(0,6fr)' : 'minmax(0,1fr)',
smDisplay:   M ? 'grid' : 'flex',                         // small cards: 3x2 grid, or sideways scroll row on mobile
smOverflow:  M ? 'visible' : 'auto',
smFlex:      M ? '0 1 auto' : '0 0 220px',
smPadB:      M ? '0' : '4px',
netH:        w < 640 ? '420px' : w < 900 ? '320px' : '380px',
probCols:    L ? 'minmax(0,62fr) minmax(0,38fr)' : 'minmax(0,1fr)',
probRows:    L ? 'repeat(2,minmax(0,1fr))' : 'auto',
probStatCols:L ? 'repeat(2,minmax(0,1fr))' : M ? 'repeat(4,minmax(0,1fr))' : 'repeat(2,minmax(0,1fr))',

// Stat card data
probStats: [
        { v: '0.25 to 1%+', d: 'Typical cost hidden in a bank\'s spread on a bespoke hedge.', x: '~0.10% FEE', tint: 'radial-gradient(circle,color-mix(in srgb,var(--green) 8%,transparent),transparent 70%)' },
        { v: '~2%', d: 'Typical fee per trade on popular prediction markets.', x: '~0.10% FEE', tint: 'radial-gradient(circle,color-mix(in srgb,var(--blue) 6%,transparent),transparent 70%)' },
        { v: 'Platform only', d: 'Who decides which new markets get listed on most venues.', x: 'ANYONE LISTS', tint: 'radial-gradient(circle,color-mix(in srgb,var(--green) 8%,transparent),transparent 70%)' },
        { v: 'Institutions', d: 'Who gets access to a bank\'s hedging desk.', x: 'ANYONE TRADES', tint: 'radial-gradient(circle,color-mix(in srgb,var(--blue) 6%,transparent),transparent 70%)' },
      ]

// Network diagram SVG builder (mobile layout squashed 30% to fit the shorter stage)

  netSvg() {
    const h = this.hv, s = this.state, w = s.w, dex = s.netMode === 'dex', mono = "'JetBrains Mono',monospace";
    const NW = w < 640, MID = !NW, ky = NW ? 0.7 : 1;
    const VB = NW ? [360, 640 * ky] : [1200, 600], hub = NW ? [180, 96 * ky] : [600, 270];
    const bank = NW ? [180, 590 * ky] : [600, 480], usdc = NW ? [50, 225 * ky] : [400, 500], uma = NW ? [310, 225 * ky] : [800, 500];
    const nodes = NW ? this.netNodes.filter(n => n.nw).map(n => ({ ...n, x: n.nw[0], y: n.nw[1] * ky })) : MID ? this.netNodes.filter(n => !n.wideOnly) : this.netNodes;
    const fs = NW ? 11 : 20, N = nodes.length, cyc = s.netI % (N + 2), act = dex && cyc < N ? cyc : -1;
    const B = NW ? 26 : 46, A = NW ? 8 : 14, ease = 'cubic-bezier(.2,.7,.2,1)', fade = on => ({ opacity: on ? 1 : 0, transition: 'opacity 900ms ' + ease });
    const tw = (t, k) => t.length * fs * (k || 0.62);
    const txt = (key, x, y, t, o) => h('text', { key, x, y, textAnchor: o.anchor || 'middle', style: { fontFamily: mono, fontSize: o.fs || fs * 0.85, letterSpacing: '0.06em', fill: o.fill || 'var(--t3)', fontWeight: o.fw || 400, ...(o.style || {}) } }, t);
    const tag = (key, x, y, t, on, green) => { const tW = tw(t, 0.58) * 0.85 + 14, tH = fs * 0.85 + 9; return h('g', { key, style: fade(on), pointerEvents: 'none' },
      h('rect', { x: x - tW / 2, y: y - tH / 2, width: tW, height: tH, rx: 3, fill: 'var(--bg)', stroke: green ? 'color-mix(in srgb,var(--green) 35%,transparent)' : 'var(--line2)' }),
      txt(key + 't', x, y + fs * 0.3, t, { fill: green ? 'var(--green)' : 'var(--t4)', fs: fs * 0.78 })); };
    const els = [h('defs', { key: 'df' },
      h('radialGradient', { id: 'netG' }, h('stop', { offset: '0%', stopColor: 'var(--t1)', stopOpacity: 0.07 }), h('stop', { offset: '100%', stopColor: 'var(--t1)', stopOpacity: 0 })),
      h('radialGradient', { id: 'netGG' }, h('stop', { offset: '0%', stopColor: 'var(--green)', stopOpacity: 0.07 }), h('stop', { offset: '100%', stopColor: 'var(--green)', stopOpacity: 0 })))];
    els.push(h('circle', { key: 'lg', cx: hub[0], cy: hub[1], r: NW ? 180 : 340, fill: 'url(#netG)', style: fade(!dex) }));
    els.push(h('circle', { key: 'lgg', cx: hub[0], cy: hub[1], r: NW ? 180 : 340, fill: 'url(#netGG)', style: fade(dex) }));
    const top = [], nodeEls = [];
    nodes.forEach((n, i) => {
      const dx = hub[0] - n.x, dy = hub[1] - n.y, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, R = B * 1.15;
      const ex = hub[0] - ux * R, ey = hub[1] - uy * R, bx = n.x + dx * 0.58, by = n.y + dy * 0.58, L2 = Math.hypot(ex - n.x, ey - n.y);
      els.push(h('line', { key: 'tl' + n.id, x1: n.x, y1: n.y, x2: n.ok ? ex : bx, y2: n.ok ? ey : by, stroke: n.ok ? 'var(--t3)' : 'var(--line4)', strokeWidth: 1, strokeDasharray: n.ok ? null : '4 4', style: fade(!dex) }));
      if (!n.ok) els.push(h('g', { key: 'x' + n.id, style: fade(!dex) }, h('line', { x1: bx - 4, y1: by - 4, x2: bx + 4, y2: by + 4, stroke: 'var(--t3)', strokeWidth: 1.25 }), h('line', { x1: bx + 4, y1: by - 4, x2: bx - 4, y2: by + 4, stroke: 'var(--t3)', strokeWidth: 1.25 })));
      els.push(h('line', { key: 'dl' + n.id, x1: n.x, y1: n.y, x2: ex, y2: ey, strokeWidth: 1, style: { stroke: i === act ? 'color-mix(in srgb,var(--green) 75%,transparent)' : 'color-mix(in srgb,var(--t1) 25%,transparent)', strokeDasharray: L2, strokeDashoffset: dex ? 0 : L2, transition: 'stroke-dashoffset 900ms ' + ease + ' ' + (i * 60) + 'ms, stroke 400ms' } }));
      if (i === act) els.push(h('circle', { key: 'tv' + s.netI, r: 2.5, fill: 'var(--green)', style: { '--x0': n.x + 'px', '--y0': n.y + 'px', '--x1': ex + 'px', '--y1': ey + 'px', transform: 'translate(' + ex + 'px,' + ey + 'px)', animation: 'dx-travel 1.3s cubic-bezier(.4,0,.2,1) both' } }));
      if (!NW && n.tag) top.push(tag('tt' + n.id, bx, by + fs * 1.5, n.tag, !dex, false));
      if (!NW && n.dtag) top.push(tag('dt' + n.id, n.x + dx * 0.45, n.y + dy * 0.45, n.dtag, dex, true));
      const lit = dex && (i < cyc || i === act), hov = s.netHover === n.id, above = n.y < hub[1] - 60;
      nodeEls.push(h('g', { key: 'n' + n.id, onMouseEnter: () => this.setState({ netHover: n.id }), onMouseLeave: () => this.setState({ netHover: null }), style: { cursor: 'default' } },
        h('circle', { cx: n.x, cy: n.y, r: 18, fill: 'transparent' }),
        h('circle', { cx: n.x, cy: n.y, r: NW ? 4 : MID ? 6 : 4, style: { fill: lit ? 'var(--green)' : dex ? 'var(--t-soft)' : n.ok ? 'var(--t3)' : 'var(--line4)', stroke: 'var(--bg)', strokeWidth: 2, transformBox: 'fill-box', transformOrigin: 'center', transform: hov ? 'scale(1.15)' : 'none', transition: 'fill 400ms, transform 200ms' } }),
        txt('l', n.x, above ? n.y - fs * 1.2 : n.y + fs * 1.9, n.n.toUpperCase(), { fill: hov || dex ? 'var(--t-soft)' : 'var(--t3)', style: { transition: 'fill 400ms' } })));
    });
    const br = (cx, cy, b, a, col) => h('path', { d: [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy]) => 'M' + (cx + sx * b) + ',' + (cy + sy * b - sy * a) + ' L' + (cx + sx * b) + ',' + (cy + sy * b) + ' L' + (cx + sx * b - sx * a) + ',' + (cy + sy * b)).join(' '), fill: 'none', strokeWidth: 1.25, style: { stroke: col, transition: 'stroke 900ms' } });
    els.push(h('g', { key: 'bk', style: fade(!dex) },
      h('line', { x1: bank[0], y1: hub[1] + B * 1.15, x2: bank[0], y2: bank[1] - 8, stroke: 'var(--line4)', strokeDasharray: '4 4' }),
      h('rect', { x: bank[0] - 4, y: bank[1] - 4, width: 8, height: 8, fill: 'var(--line2)', stroke: 'var(--t4)' }),
      txt('bl', bank[0], bank[1] + fs * 1.7, 'BANK BALANCE SHEET', { fill: 'var(--t2)', fw: 600 }),
      txt('bd', bank[0], bank[1] + fs * 3.1, 'Holds all the risk, decides the payout', { fill: 'var(--t4)', fs: fs * 0.8 })));
    [[usdc, NW ? 'USDC' : 'USDC COLLATERAL', 'Held in contracts, not by us', 'u'], [uma, 'UMA ORACLE', 'Settles from public data', 'm']].forEach(([p, t, d, k], j) => {
      const dx = p[0] - hub[0], dy = p[1] - hub[1], len = Math.hypot(dx, dy), sx = hub[0] + dx / len * B * 1.15, sy = hub[1] + dy / len * B * 1.15, L3 = Math.hypot(p[0] - sx, p[1] - sy);
      els.push(h('g', { key: 'sd' + k, style: fade(dex) },
        h('line', { x1: sx, y1: sy, x2: p[0], y2: p[1], strokeWidth: 1, style: { stroke: 'color-mix(in srgb,var(--green) 60%,transparent)', strokeDasharray: L3, strokeDashoffset: dex ? 0 : L3, transition: 'stroke-dashoffset 900ms ' + ease + ' ' + (300 + j * 120) + 'ms' } }),
        h('circle', { cx: p[0], cy: p[1], r: 4, fill: 'var(--green)', stroke: 'var(--bg)', strokeWidth: 2 }),
        txt('t', p[0], p[1] + fs * 1.7, t, { fill: 'var(--t1)', fw: 600 }),
        NW ? null : txt('d', p[0], p[1] + fs * 3.1, d, { fill: 'var(--t3)', fs: fs * 0.8 })));
    });
    els.push(br(hub[0], hub[1], B, A, dex ? 'color-mix(in srgb,var(--t1) 90%,transparent)' : 'var(--t4)'));
    els.push(h('circle', { key: 'hc', cx: hub[0], cy: hub[1], r: NW ? 6 : 9, style: { fill: dex ? 'var(--t1)' : 'var(--line2)', stroke: dex ? 'var(--t1)' : 'var(--line4)', transition: 'fill 900ms, stroke 900ms' } }));
    const hl = 'DEXETERA ORDER BOOK', ly = hub[1] - B - fs * 0.9;
    els.push(h('g', { key: 'ht', style: fade(!dex) }, txt('a', hub[0], ly, 'BANK SWAP DESK', { fill: 'var(--t2)', fw: 600, fs: fs * 0.95 }), txt('b', hub[0], hub[1] + B + fs * 1.6, 'Prices the hedge, keeps the spread', { fill: 'var(--t4)', fs: fs * 0.82 })));
    els.push(h('g', { key: 'hd', style: fade(dex) }, h('circle', { cx: hub[0] - tw(hl, 0.66) * 0.95 / 2 - 10, cy: ly - fs * 0.3, r: 3, fill: 'var(--green)' }), txt('a', hub[0], ly, hl, { fill: 'color-mix(in srgb,var(--t1) 90%,transparent)', fw: 600, fs: fs * 0.95 }), txt('b', hub[0], hub[1] + B + fs * 1.6, 'Live bids and asks set the price', { fill: 'var(--t3)', fs: fs * 0.82 })));
    els.push(...top, ...nodeEls);
    const hn = nodes.find(n => n.id === s.netHover);
    if (hn) { const tW = tw(hn.d, 0.55) * 0.85 + 24, tH = fs * 2.2, below = hn.y < hub[1] - 60, tx = Math.max(8, Math.min(VB[0] - tW - 8, hn.x - tW / 2)), ty = below ? hn.y + fs * 2.8 : hn.y - fs * 2.8 - tH;
      els.push(h('g', { key: 'tip', pointerEvents: 'none' }, h('rect', { x: tx, y: ty, width: tW, height: tH, rx: 6, fill: 'var(--card2)', stroke: 'var(--line3)' }), txt('t', tx + 12, ty + tH / 2 + fs * 0.3, hn.d, { anchor: 'start', fill: 'var(--t-soft)', fs: fs * 0.85 }))); }
    return h('svg', { viewBox: '0 0 ' + VB[0] + ' ' + VB[1], preserveAspectRatio: 'xMidYMid meet', style: { width: '100%', height: '100%', display: 'block', overflow: 'visible' } }, els);
  }
