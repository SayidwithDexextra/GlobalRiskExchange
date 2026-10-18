'use client';

import type { CSSProperties, ReactNode } from 'react';
import { NET_NODES } from '@/lib/data';

type NetNode = {
  id: string;
  n: string;
  d: string;
  x: number;
  y: number;
  nw?: readonly [number, number];
  ok?: boolean;
  wideOnly?: boolean;
  tag?: string;
  dtag?: string;
};

const NODES = NET_NODES as readonly NetNode[];
const MONO = 'var(--font-mono)';
const EASE = 'cubic-bezier(.2,.7,.2,1)';

function fade(on: boolean): CSSProperties {
  return { opacity: on ? 1 : 0, transition: 'opacity 900ms ' + EASE };
}

export function NetworkSvg({
  w,
  dex,
  netI,
  hover,
  onHover,
}: {
  w: number;
  dex: boolean;
  netI: number;
  hover: string | null;
  onHover: (id: string | null) => void;
}) {
  const NW = w < 640;
  const MID = !NW;
  const ky = NW ? 0.7 : 1;
  const VB: [number, number] = NW ? [360, 640 * ky] : [1200, 600];
  const hub: [number, number] = NW ? [180, 96 * ky] : [600, 270];
  const bank: [number, number] = NW ? [180, 590 * ky] : [600, 480];
  const usdc: [number, number] = NW ? [50, 225 * ky] : [400, 500];
  const uma: [number, number] = NW ? [310, 225 * ky] : [800, 500];
  const nodes: NetNode[] = NW
    ? NODES.filter((n) => n.nw).map((n) => ({ ...n, x: n.nw![0], y: n.nw![1] * ky }))
    : MID
      ? NODES.filter((n) => !n.wideOnly)
      : [...NODES];
  const fs = NW ? 11 : 20;
  const N = nodes.length;
  const cyc = netI % (N + 2);
  const act = dex && cyc < N ? cyc : -1;
  const B = NW ? 26 : 46;
  const A = NW ? 8 : 14;
  const tw = (t: string, k?: number) => t.length * fs * (k || 0.62);

  const txt = (
    key: string,
    x: number,
    y: number,
    t: string,
    o: { anchor?: 'start' | 'middle' | 'end'; fs?: number; fill?: string; fw?: number; style?: CSSProperties },
  ) => (
    <text
      key={key}
      x={x}
      y={y}
      textAnchor={o.anchor || 'middle'}
      style={{
        fontFamily: MONO,
        fontSize: o.fs || fs * 0.85,
        letterSpacing: '0.06em',
        fill: o.fill || 'var(--t3)',
        fontWeight: o.fw || 400,
        ...(o.style || {}),
      }}
    >
      {t}
    </text>
  );

  const tag = (key: string, x: number, y: number, t: string, on: boolean, green: boolean) => {
    const tW = tw(t, 0.58) * 0.85 + 14;
    const tH = fs * 0.85 + 9;
    return (
      <g key={key} style={{ ...fade(on), pointerEvents: 'none' }}>
        <rect
          x={x - tW / 2}
          y={y - tH / 2}
          width={tW}
          height={tH}
          rx={3}
          fill="var(--bg)"
          stroke={green ? 'color-mix(in srgb,var(--green) 35%,transparent)' : 'var(--line2)'}
        />
        {txt(key + 't', x, y + fs * 0.3, t, { fill: green ? 'var(--green)' : 'var(--t4)', fs: fs * 0.78 })}
      </g>
    );
  };

  const lines: ReactNode[] = [];
  const top: ReactNode[] = [];
  const nodeEls: ReactNode[] = [];

  nodes.forEach((n, i) => {
    const dx = hub[0] - n.x;
    const dy = hub[1] - n.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const R = B * 1.15;
    const ex = hub[0] - ux * R;
    const ey = hub[1] - uy * R;
    const bx = n.x + dx * 0.58;
    const by = n.y + dy * 0.58;
    const L2 = Math.hypot(ex - n.x, ey - n.y);
    lines.push(
      <line
        key={'tl' + n.id}
        x1={n.x}
        y1={n.y}
        x2={n.ok ? ex : bx}
        y2={n.ok ? ey : by}
        stroke={n.ok ? 'var(--t3)' : 'var(--line4)'}
        strokeWidth={1}
        strokeDasharray={n.ok ? undefined : '4 4'}
        style={fade(!dex)}
      />,
    );
    if (!n.ok) {
      lines.push(
        <g key={'x' + n.id} style={fade(!dex)}>
          <line x1={bx - 4} y1={by - 4} x2={bx + 4} y2={by + 4} stroke="var(--t3)" strokeWidth={1.25} />
          <line x1={bx + 4} y1={by - 4} x2={bx - 4} y2={by + 4} stroke="var(--t3)" strokeWidth={1.25} />
        </g>,
      );
    }
    lines.push(
      <line
        key={'dl' + n.id}
        x1={n.x}
        y1={n.y}
        x2={ex}
        y2={ey}
        strokeWidth={1}
        style={{
          stroke: i === act ? 'color-mix(in srgb,var(--green) 75%,transparent)' : 'color-mix(in srgb,var(--t1) 25%,transparent)',
          strokeDasharray: L2,
          strokeDashoffset: dex ? 0 : L2,
          transition: 'stroke-dashoffset 900ms ' + EASE + ' ' + i * 60 + 'ms, stroke 400ms',
        }}
      />,
    );
    if (i === act) {
      lines.push(
        <circle
          key={'tv' + netI}
          r={2.5}
          fill="var(--green)"
          style={{
            ['--x0' as string]: n.x + 'px',
            ['--y0' as string]: n.y + 'px',
            ['--x1' as string]: ex + 'px',
            ['--y1' as string]: ey + 'px',
            transform: `translate(${ex}px,${ey}px)`,
            animation: 'dx-travel 1.3s cubic-bezier(.4,0,.2,1) both',
          }}
        />,
      );
    }
    if (!NW && n.tag) top.push(tag('tt' + n.id, bx, by + fs * 1.5, n.tag, !dex, false));
    if (!NW && n.dtag) top.push(tag('dt' + n.id, n.x + dx * 0.45, n.y + dy * 0.45, n.dtag, dex, true));
    const lit = dex && (i < cyc || i === act);
    const hov = hover === n.id;
    const above = n.y < hub[1] - 60;
    nodeEls.push(
      <g
        key={'n' + n.id}
        onMouseEnter={() => onHover(n.id)}
        onMouseLeave={() => onHover(null)}
        style={{ cursor: 'default' }}
      >
        <circle cx={n.x} cy={n.y} r={18} fill="transparent" />
        <circle
          cx={n.x}
          cy={n.y}
          r={NW ? 4 : MID ? 6 : 4}
          style={{
            fill: lit ? 'var(--green)' : dex ? 'var(--t-soft)' : n.ok ? 'var(--t3)' : 'var(--line4)',
            stroke: 'var(--bg)',
            strokeWidth: 2,
            transformBox: 'fill-box',
            transformOrigin: 'center',
            transform: hov ? 'scale(1.15)' : 'none',
            transition: 'fill 400ms, transform 200ms',
          }}
        />
        {txt('l', n.x, above ? n.y - fs * 1.2 : n.y + fs * 1.9, n.n.toUpperCase(), {
          fill: hov || dex ? 'var(--t-soft)' : 'var(--t3)',
          style: { transition: 'fill 400ms' },
        })}
      </g>,
    );
  });

  const corners: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const bracket = (cx: number, cy: number, b: number, a: number) =>
    corners
      .map(([sx, sy]) => `M${cx + sx * b},${cy + sy * b - sy * a} L${cx + sx * b},${cy + sy * b} L${cx + sx * b - sx * a},${cy + sy * b}`)
      .join(' ');

  const sides: [[number, number], string, string, string][] = [
    [usdc, NW ? 'USDC' : 'USDC COLLATERAL', 'Held in contracts, not by us', 'u'],
    [uma, 'UMA ORACLE', 'Settles from public data', 'm'],
  ];

  const hl = 'DEXETERA ORDER BOOK';
  const ly = hub[1] - B - fs * 0.9;
  const hn = nodes.find((n) => n.id === hover);
  let tip: React.ReactNode = null;
  if (hn) {
    const tW = tw(hn.d, 0.55) * 0.85 + 24;
    const tH = fs * 2.2;
    const below = hn.y < hub[1] - 60;
    const tx = Math.max(8, Math.min(VB[0] - tW - 8, hn.x - tW / 2));
    const ty = below ? hn.y + fs * 2.8 : hn.y - fs * 2.8 - tH;
    tip = (
      <g key="tip" style={{ pointerEvents: 'none' }}>
        <rect x={tx} y={ty} width={tW} height={tH} rx={6} fill="var(--card2)" stroke="var(--line3)" />
        {txt('t', tx + 12, ty + tH / 2 + fs * 0.3, hn.d, { anchor: 'start', fill: 'var(--t-soft)', fs: fs * 0.85 })}
      </g>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${VB[0]} ${VB[1]}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="netG">
          <stop offset="0%" stopColor="var(--t1)" stopOpacity="0.07" />
          <stop offset="100%" stopColor="var(--t1)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="netGG">
          <stop offset="0%" stopColor="var(--green)" stopOpacity="0.07" />
          <stop offset="100%" stopColor="var(--green)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={hub[0]} cy={hub[1]} r={NW ? 180 : 340} fill="url(#netG)" style={fade(!dex)} />
      <circle cx={hub[0]} cy={hub[1]} r={NW ? 180 : 340} fill="url(#netGG)" style={fade(dex)} />
      {lines}
      <g style={fade(!dex)}>
        <line x1={bank[0]} y1={hub[1] + B * 1.15} x2={bank[0]} y2={bank[1] - 8} stroke="var(--line4)" strokeDasharray="4 4" />
        <rect x={bank[0] - 4} y={bank[1] - 4} width={8} height={8} fill="var(--line2)" stroke="var(--t4)" />
        {txt('bl', bank[0], bank[1] + fs * 1.7, 'BANK BALANCE SHEET', { fill: 'var(--t2)', fw: 600 })}
        {txt('bd', bank[0], bank[1] + fs * 3.1, 'Holds all the risk, decides the payout', { fill: 'var(--t4)', fs: fs * 0.8 })}
      </g>
      {sides.map(([p, t, d, k], j) => {
        const dx = p[0] - hub[0];
        const dy = p[1] - hub[1];
        const len = Math.hypot(dx, dy) || 1;
        const sx = hub[0] + (dx / len) * B * 1.15;
        const sy = hub[1] + (dy / len) * B * 1.15;
        const L3 = Math.hypot(p[0] - sx, p[1] - sy);
        return (
          <g key={'sd' + k} style={fade(dex)}>
            <line
              x1={sx}
              y1={sy}
              x2={p[0]}
              y2={p[1]}
              strokeWidth={1}
              style={{
                stroke: 'color-mix(in srgb,var(--green) 60%,transparent)',
                strokeDasharray: L3,
                strokeDashoffset: dex ? 0 : L3,
                transition: 'stroke-dashoffset 900ms ' + EASE + ' ' + (300 + j * 120) + 'ms',
              }}
            />
            <circle cx={p[0]} cy={p[1]} r={4} fill="var(--green)" stroke="var(--bg)" strokeWidth={2} />
            {txt('t', p[0], p[1] + fs * 1.7, t, { fill: 'var(--t1)', fw: 600 })}
            {NW ? null : txt('d', p[0], p[1] + fs * 3.1, d, { fill: 'var(--t3)', fs: fs * 0.8 })}
          </g>
        );
      })}
      <path
        d={bracket(hub[0], hub[1], B, A)}
        fill="none"
        strokeWidth={1.25}
        style={{ stroke: dex ? 'color-mix(in srgb,var(--t1) 90%,transparent)' : 'var(--t4)', transition: 'stroke 900ms' }}
      />
      <circle
        cx={hub[0]}
        cy={hub[1]}
        r={NW ? 6 : 9}
        style={{
          fill: dex ? 'var(--t1)' : 'var(--line2)',
          stroke: dex ? 'var(--t1)' : 'var(--line4)',
          transition: 'fill 900ms, stroke 900ms',
        }}
      />
      <g style={fade(!dex)}>
        {txt('a', hub[0], ly, 'BANK SWAP DESK', { fill: 'var(--t2)', fw: 600, fs: fs * 0.95 })}
        {txt('b', hub[0], hub[1] + B + fs * 1.6, 'Prices the hedge, keeps the spread', { fill: 'var(--t4)', fs: fs * 0.82 })}
      </g>
      <g style={fade(dex)}>
        <circle cx={hub[0] - (tw(hl, 0.66) * 0.95) / 2 - 10} cy={ly - fs * 0.3} r={3} fill="var(--green)" />
        {txt('a', hub[0], ly, hl, { fill: 'color-mix(in srgb,var(--t1) 90%,transparent)', fw: 600, fs: fs * 0.95 })}
        {txt('b', hub[0], hub[1] + B + fs * 1.6, 'Bids and asks set the price', { fill: 'var(--t3)', fs: fs * 0.82 })}
      </g>
      {top}
      {nodeEls}
      {tip}
    </svg>
  );
}
