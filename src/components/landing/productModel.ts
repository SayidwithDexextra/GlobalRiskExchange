// NINO34 product data and pure derivations, ported from design/product/product.logic.js.

export type Candle = { o: number; h: number; l: number; c: number; v: number };
export type Trade = { p: number; s: number; up: boolean; t: number };
export type BookTab = 'book' | 'trades';
export type PosTab = 'Positions' | 'Open Orders' | 'Trade History' | 'Order History';
export type TiTab = 'Margin Used' | 'Reserved' | 'Available';
export type Side = 'long' | 'short';
export type MkTab = 'Market' | 'Limit';

export type BookRow = { p: string; s: string; t: string; depth: string; bg: string };
export type Stat = { l: string; v: string; c: string };

export const SANS = 'var(--font-manrope), Manrope, sans-serif';
export const MONO = "var(--font-jetbrains), 'JetBrains Mono', ui-monospace, monospace";
export const SERIF = 'Georgia, serif';

export const NINO_CANDLES: Candle[] = [
  { o: 3580, h: 3610, l: 3520, c: 3600, v: 0.39 },
  { o: 3600, h: 3650, l: 3560, c: 3600, v: 0.32 },
  { o: 3600, h: 3740, l: 3560, c: 3690, v: 0.85 },
  { o: 3690, h: 3760, l: 3670, c: 3710, v: 0.42 },
  { o: 3710, h: 3790, l: 3700, c: 3750, v: 0.62 },
  { o: 3750, h: 3810, l: 3700, c: 3750, v: 0.24 },
  { o: 3750, h: 3850, l: 3710, c: 3790, v: 0.61 },
  { o: 3790, h: 3890, l: 3730, c: 3830, v: 0.51 },
  { o: 3830, h: 3880, l: 3780, c: 3850, v: 0.41 },
  { o: 3850, h: 3870, l: 3770, c: 3800, v: 0.53 },
  { o: 3800, h: 3920, l: 3750, c: 3880, v: 0.87 },
  { o: 3880, h: 3900, l: 3720, c: 3760, v: 0.92 },
  { o: 3760, h: 3810, l: 3700, c: 3790, v: 0.36 },
  { o: 3790, h: 3820, l: 3740, c: 3780, v: 0.57 },
  { o: 3780, h: 3820, l: 3760, c: 3780, v: 0.34 },
  { o: 3780, h: 3830, l: 3750, c: 3800, v: 0.41 },
  { o: 3800, h: 3920, l: 3780, c: 3880, v: 0.88 },
  { o: 3880, h: 3970, l: 3840, c: 3920, v: 0.6 },
  { o: 3920, h: 4010, l: 3880, c: 3970, v: 0.76 },
  { o: 3970, h: 4050, l: 3950, c: 4000, v: 0.54 },
  { o: 4000, h: 4080, l: 3970, c: 4050, v: 0.71 },
  { o: 4050, h: 4180, l: 4000, c: 4160, v: 0.73 },
  { o: 4160, h: 4180, l: 4140, c: 4150, v: 0.59 },
  { o: 4150, h: 4210, l: 4130, c: 4170, v: 0.45 },
  { o: 4170, h: 4280, l: 4110, c: 4260, v: 0.92 },
  { o: 4260, h: 4350, l: 4210, c: 4300, v: 0.7 },
  { o: 4300, h: 4320, l: 4290, c: 4300, v: 0.29 },
  { o: 4300, h: 4310, l: 4140, c: 4180, v: 0.83 },
  { o: 4180, h: 4250, l: 4140, c: 4220, v: 0.47 },
  { o: 4220, h: 4240, l: 4170, c: 4200, v: 0.6 },
  { o: 4200, h: 4230, l: 4070, c: 4080, v: 1 },
  { o: 4080, h: 4160, l: 4070, c: 4100, v: 0.61 },
  { o: 4100, h: 4120, l: 3990, c: 4050, v: 0.63 },
  { o: 4050, h: 4150, l: 4030, c: 4130, v: 0.64 },
  { o: 4130, h: 4180, l: 4080, c: 4170, v: 0.63 },
  { o: 4170, h: 4270, l: 4160, c: 4240, v: 0.56 },
  { o: 4240, h: 4350, l: 4200, c: 4330, v: 0.92 },
  { o: 4330, h: 4380, l: 4230, c: 4280, v: 0.77 },
  { o: 4280, h: 4490, l: 4250, c: 4440, v: 1 },
  { o: 4440, h: 4520, l: 4410, c: 4470, v: 0.42 },
  { o: 4470, h: 4530, l: 4420, c: 4500, v: 0.53 },
  { o: 4500, h: 4540, l: 4420, c: 4470, v: 0.45 },
  { o: 4470, h: 4530, l: 4450, c: 4500, v: 0.45 },
  { o: 4500, h: 4570, l: 4460, c: 4510, v: 0.55 },
  { o: 4510, h: 4530, l: 4450, c: 4490, v: 0.34 },
  { o: 4490, h: 4520, l: 4380, c: 4420, v: 0.79 },
  { o: 4420, h: 4590, l: 4400, c: 4560, v: 0.99 },
  { o: 4560, h: 4600, l: 4510, c: 4550, v: 0.44 },
  { o: 4550, h: 4720, l: 4520, c: 4670, v: 1 },
  { o: 4670, h: 4710, l: 4630, c: 4690, v: 0.36 },
  { o: 4690, h: 4880, l: 4670, c: 4860, v: 1 },
  { o: 4860, h: 4920, l: 4810, c: 4910, v: 0.72 },
  { o: 4910, h: 5060, l: 4850, c: 5000, v: 0.85 },
  { o: 5000, h: 5010, l: 4940, c: 4990, v: 0.46 },
  { o: 4990, h: 5040, l: 4890, c: 4900, v: 0.66 },
  { o: 4900, h: 4920, l: 4750, c: 4760, v: 0.84 },
  { o: 4760, h: 4800, l: 4690, c: 4750, v: 0.31 },
  { o: 4750, h: 4780, l: 4710, c: 4760, v: 0.33 },
  { o: 4760, h: 4920, l: 4730, c: 4860, v: 0.89 },
  { o: 4860, h: 4990, l: 4830, c: 4960, v: 0.68 },
  { o: 4960, h: 5010, l: 4890, c: 4950, v: 0.3 },
  { o: 4950, h: 5130, l: 4930, c: 5090, v: 0.91 },
  { o: 5090, h: 5140, l: 5070, c: 5100, v: 0.27 },
  { o: 5100, h: 5140, l: 5020, c: 5060, v: 0.55 },
  { o: 5060, h: 5140, l: 5030, c: 5130, v: 0.63 },
  { o: 5130, h: 5140, l: 5040, c: 5050, v: 0.71 },
  { o: 5050, h: 5110, l: 4990, c: 5090, v: 0.65 },
  { o: 5090, h: 5290, l: 5040, c: 5260, v: 1 },
  { o: 5260, h: 5360, l: 5220, c: 5310, v: 0.63 },
  { o: 5310, h: 5430, l: 5310, c: 5400, v: 0.78 }
];

/** Constructor egg close, before live ticks. Ticker change stays +0.12. */
export const EGG_PRICE = 2.715;

const ASK_SIZES = [120, 85, 240, 60, 310, 180, 420, 95, 600];
const BID_SIZES = [150, 90, 260, 40, 380, 210, 500, 130, 560];

const TI: Record<TiTab, string> = {
  'Margin Used': '31.1900',
  Reserved: '12.4000',
  Available: '24.5800',
};

export const POS_COUNTS: Record<PosTab, number> = {
  Positions: 5,
  'Open Orders': 12,
  'Trade History': 0,
  'Order History': 50,
};

export function makeRng() {
  let seed = 11;
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
}

function walk(r: () => number, base: number, n: number, drift: number, vol: number) {
  let v = base;
  const a: number[] = [];
  for (let i = 0; i < n; i++) {
    v *= 1 + drift + (r() - 0.5) * vol;
    a.push(v);
  }
  const f = base / a[n - 1];
  return a.map((x) => x * f);
}

/** Advance the landing constructor RNG to the point NINO34 trades are seeded. */
function consumeUntilTrades(r: () => number) {
  let v = 2.6;
  for (let i = 0; i < 44; i++) {
    const o = v;
    v = v * (1 + (r() - 0.46) * 0.014);
    void (Math.max(o, v) * (1 + r() * 0.005));
    void (Math.min(o, v) * (1 - r() * 0.005));
  }
  for (let i = 0; i < 90; i++) r();
  const bases = [2.0, 2.715, 38.4, 2140, 4.85, 2.9, 48.2];
  bases.forEach((base, i) => {
    if (i === 0) return;
    walk(r, base, 40, i % 3 === 2 ? -0.003 : 0.0025, 0.03);
  });
  for (let i = 0; i < 10; i++) walk(r, 10, 24, i % 3 === 1 ? -0.004 : 0.004, 0.05);
  let x = 0;
  for (let i = 0; i < 60; i++) x = x * 0.8 + (r() - 0.5) * 0.9;
  for (let i = 0; i < 30; i++) r();
  for (let i = 0; i < 160; i++) r();
  x = 0.5;
  for (let i = 0; i < 120; i++) x = Math.min(1, Math.max(0.18, x * 0.7 + 0.15 + (r() - 0.5) * 0.5));
  walk(r, 100, 30, 0.004, 0.08);
  walk(r, 60, 30, 0.001, 0.05);
  for (let i = 0; i < 8; i++) { r(); r(); }
  for (let i = 0; i < 9; i++) { r(); r(); r(); }
  for (let i = 0; i < 18; i++) r();
}

export function createSeededTrades() {
  const rnd = makeRng();
  consumeUntilTrades(rnd);
  const p = NINO_CANDLES[NINO_CANDLES.length - 1].c;
  const trades: Trade[] = Array.from({ length: 14 }, (_, i) => ({
    p: p + Math.round((rnd() - 0.5) * 4) * 10,
    s: Math.round(1 + rnd() * 40),
    up: rnd() > 0.5,
    t: -i * 3700,
  }));
  return { trades, rnd };
}

export function usd(v: number, d = 2) {
  return '$' + v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}

export function num(v: number) {
  return v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const MINUS = '\u2212';

export function money0(v: number) {
  return (v >= 0 ? '+$' : MINUS + '$') + Math.abs(Math.round(v)).toLocaleString('en-US');
}

export function formatClock(d: Date) {
  const two = (x: number) => String(x).padStart(2, '0');
  return two(d.getUTCHours()) + ':' + two(d.getUTCMinutes()) + ':' + two(d.getUTCSeconds()) + ' UTC';
}

export function formatTradeTime(t: number) {
  const two = (x: number) => String(x).padStart(2, '0');
  const x = new Date(t);
  return two(x.getHours()) + ':' + two(x.getMinutes()) + ':' + two(x.getSeconds());
}

export type SideStyle = { bg: string; border: string; color: string; dot: boolean; arrow: boolean };

export function sideStyle(on: boolean): SideStyle {
  return on
    ? { bg: 'color-mix(in srgb,var(--emerald) 8%,transparent)', border: 'var(--green)', color: 'var(--green)', dot: false, arrow: true }
    : { bg: 'var(--card2)', border: 'var(--line2)', color: 'var(--t3)', dot: true, arrow: false };
}

export type PositionRow = {
  ic: string; name: string; sub: string; size: string; entry: string; mark: string;
  pnl: string; pct: string; pc: string; liq: string;
};

export type Derived = {
  last: number;
  chg: number;
  up: boolean;
  stats: Stat[];
  leg: { o: string; h: string; l: string; c: string; chg: string; col: string };
  asks: BookRow[];
  bids: BookRow[];
  askCount: string;
  bidCount: string;
  spreadTxt: string;
  curPrice: string;
  curChg: string;
  curChgColor: string;
  tiVal: string;
  positions: PositionRow[];
  ticker: [string, string, number][];
};

export function derive(btc: Candle[], hover: number | null, flashRow: number, tiTab: TiTab, lastTrade: Trade): Derived {
  const n = btc.length;
  const last = btc[n - 1].c;
  const prevC = btc[n - 2].c;
  const chg = (last / prevC - 1) * 100;
  const up = chg >= 0;
  let ca = 0;
  let cb = 0;
  const A: { p: number; s: number; t: number }[] = [];
  const Bd: { p: number; s: number; t: number }[] = [];
  ASK_SIZES.forEach((sa, i) => {
    const pa = last + 10 * (i + 1);
    const sz = BID_SIZES[i];
    const pb = last - 10 * (i + 1);
    ca += sa;
    A.push({ p: pa, s: sa, t: ca });
    cb += sz;
    Bd.push({ p: pb, s: sz, t: cb });
  });
  const mx = Math.max(ca, cb);
  const row = (o: { p: number; s: number; t: number }, i: number, off: number): BookRow => ({
    p: usd(o.p),
    s: String(o.s),
    t: usd(o.p * o.s),
    depth: ((o.t / mx) * 100).toFixed(1) + '%',
    bg: flashRow === i + off ? 'color-mix(in srgb,var(--t1) 5%,transparent)' : 'transparent',
  });
  const k = btc[hover ?? n - 1];
  const kd = k.c - k.o;
  const kup = kd >= 0;
  const nPl = 12 * (last - 4620);
  const positions: PositionRow[] = [
    { ic: 'N', name: 'Niño 3.4', sub: 'NINO34-DEC26', size: '12', entry: '$4,620.00', mark: usd(last), pnl: money0(nPl), pct: (nPl >= 0 ? '+' : MINUS) + Math.abs((last / 4620 - 1) * 100).toFixed(1) + '%', pc: nPl >= 0 ? 'var(--green)' : 'var(--red)', liq: '$2,980.00' },
    { ic: 'N', name: 'Niño 1+2', sub: 'NINO12-DEC26', size: '5', entry: '$6,100.00', mark: '$7,400.00', pnl: '+$6,500', pct: '+21.3%', pc: 'var(--green)', liq: '$3,950.00' },
    { ic: 'E', name: 'Average egg price', sub: 'PRICE-EGGS', size: '4.2', entry: '$2.5377', mark: '$2.7180', pnl: '+$0.76', pct: '+7.10%', pc: 'var(--green)', liq: '$0.00' },
  ];
  return {
    last,
    chg,
    up,
    stats: [
      { l: 'MARK', v: usd(last), c: 'var(--t1)' },
      { l: 'LAST', v: usd(lastTrade.p), c: lastTrade.up ? 'var(--green)' : 'var(--red)' },
      { l: '24H CHG', v: (up ? '+' : '') + chg.toFixed(1) + '%', c: up ? 'var(--green)' : 'var(--red)' },
      { l: '24H HIGH', v: usd(btc[n - 1].h, 0), c: 'var(--t1)' },
      { l: '24H LOW', v: usd(btc[n - 1].l, 0), c: 'var(--t1)' },
      { l: 'BID', v: usd(Bd[0].p), c: 'var(--green)' },
      { l: 'ASK', v: usd(A[0].p), c: 'var(--red)' },
      { l: 'SPREAD', v: '$20.00', c: 'var(--t1)' },
      { l: 'VOLUME', v: '$184K', c: 'var(--t1)' },
      { l: 'TRADES', v: '1,412', c: 'var(--t1)' },
    ],
    leg: {
      o: num(k.o),
      h: num(k.h),
      l: num(k.l),
      c: num(k.c),
      chg: (kup ? '+' : MINUS) + num(Math.abs(kd)) + ' (' + (kup ? '+' : MINUS) + Math.abs((kd / k.o) * 100).toFixed(2) + '%)',
      col: kup ? 'var(--green)' : 'var(--red)',
    },
    asks: A.slice().reverse().map((o, i) => row(o, i, 0)),
    bids: Bd.map((o, i) => row(o, i, 9)),
    askCount: A.length + ' orders',
    bidCount: Bd.length + ' orders',
    spreadTxt: '$20.00 · ' + ((20 / last) * 100).toFixed(2) + '%',
    curPrice: usd(last),
    curChg: (up ? '\u2191 ' : '\u2193 ') + Math.abs(chg).toFixed(2) + '%',
    curChgColor: up ? 'var(--green)' : 'var(--red)',
    tiVal: TI[tiTab],
    positions,
    ticker: [
      ['NINO34-DEC26', usd(last), +chg.toFixed(2)],
      ['ETHEREUM', '$2,430.15', -1.49],
      ['GOLD', '$2,412.30', 0.31],
      ['NASDAQ', '$29,686.80', 0],
      ['PRICE-EGGS', '$' + EGG_PRICE.toFixed(3), 0.12],
      ['PRICE-MILK-US', '$4.52', 0],
      ['SILVER', '$75.96', 0.21],
      ['500', '$7,594.21', 0.08],
    ],
  };
}

export function stepCandle(btc: Candle[], rnd: () => number) {
  const bl = btc[btc.length - 1];
  const bm = Math.min(5430, Math.max(5380, bl.c + (rnd() < 0.5 ? -10 : 10)));
  const next = btc.slice();
  next[next.length - 1] = { ...bl, c: bm, h: Math.max(bl.h, bm), l: Math.min(bl.l, bm) };
  return { btc: next, price: bm, up: bm >= bl.c };
}
