'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  type LucideIcon,
  Activity,
  AlignJustify,
  ArrowLeftRight,
  BadgeCheck,
  Bell,
  Bookmark,
  Brush,
  Calendar,
  CalendarRange,
  Camera,
  ChartCandlestick,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Circle,
  CirclePlus,
  Compass,
  Copy,
  ExternalLink,
  Eye,
  Gauge,
  Hexagon,
  History,
  LayoutGrid,
  Lightbulb,
  List,
  Maximize,
  Plus,
  Redo2,
  Search,
  Settings,
  Share,
  ShieldCheck,
  Signal,
  Slash,
  Sparkles,
  Spline,
  Star,
  Type,
  Undo2,
  User,
  Wallet,
  Zap,
} from 'lucide-react';
import { useViewport } from '@/hooks/useViewport';
import {
  MONO,
  NINO_CANDLES,
  POS_COUNTS,
  SANS,
  SERIF,
  createSeededTrades,
  derive,
  formatClock,
  formatTradeTime,
  num,
  sideStyle,
  stepCandle,
  type BookTab,
  type Candle,
  type MkTab,
  type PosTab,
  type Side,
  type TiTab,
  type Trade,
} from './productModel';

const QUICK: { label: string; add: number | null; color: string }[] = [
  { label: '+$100', add: 100, color: 'var(--t3)' },
  { label: '+$500', add: 500, color: 'var(--t3)' },
  { label: '+$1K', add: 1000, color: 'var(--t3)' },
  { label: '+$5K', add: 5000, color: 'var(--t3)' },
  { label: 'Max', add: null, color: 'var(--blue)' },
];

const POS_TABS: PosTab[] = ['Positions', 'Open Orders', 'Trade History', 'Order History'];
const TI_TABS: TiTab[] = ['Margin Used', 'Reserved', 'Available'];
const MK_TABS: MkTab[] = ['Market', 'Limit'];

const FEATURES: { icon: LucideIcon; t: string; d: string }[] = [
  { icon: Activity, t: 'Live order book', d: 'Real bids, asks and liquidations.' },
  { icon: Wallet, t: 'USDC, non-custodial', d: 'Funds stay in your wallet and contracts.' },
  { icon: Zap, t: 'Gasless, one signature', d: 'Trade or list without paying gas.' },
  { icon: ShieldCheck, t: 'Public data + UMA', d: 'Named sources, open disputes.' },
  { icon: Sparkles, t: 'List in minutes', d: 'The AI wizard drafts the market.' },
];

const RAIL: { icon: LucideIcon; top: number }[] = [
  { icon: LayoutGrid, top: 79 },
  { icon: Compass, top: 122 },
  { icon: Bookmark, top: 167 },
  { icon: Signal, top: 211 },
  { icon: Lightbulb, top: 255 },
  { icon: Settings, top: 299 },
];

const DRAW: LucideIcon[] = [Plus, Slash, AlignJustify, Spline, List, Brush, Type];

function Ico({ icon: Icon, size, color }: { icon: LucideIcon; size: number; color: string }) {
  return <Icon size={size} color={color} strokeWidth={2} aria-hidden style={{ flex: 'none', display: 'block' }} />;
}

function pillStyle(): CSSProperties {
  return {
    position: 'absolute',
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    height: 22,
    padding: '0 10px 0 4px',
    background: 'var(--btn-p-bg)',
    color: 'var(--btn-p-fg)',
    borderRadius: 100,
    fontSize: 11,
    fontWeight: 600,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
  };
}

function CandleChart({
  candles,
  hover,
  onHover,
}: {
  candles: Candle[];
  hover: number | null;
  onHover: (i: number | null) => void;
}) {
  const W = 1000;
  const H = 400;
  const n = candles.length;
  const cw = W / n;
  const top = 5800;
  const bot = 2850;
  const Y = (v: number) => ((top - v) / (top - bot)) * H;
  const pct = (v: number) => ((top - v) / (top - bot)) * 100;
  const levels = [5500, 5000, 4500, 4000, 3500];
  const idx = hover ?? n - 1;
  const k = candles[idx];
  const lastC = candles[n - 1].c;
  const up = candles[n - 1].c >= candles[n - 1].o;
  const AX = 72;

  return (
    <div style={{ position: 'relative', width: '100%', height: 240 }}>
      <div
        onMouseMove={(e) => {
          const b = e.currentTarget.getBoundingClientRect();
          const i = Math.max(0, Math.min(n - 1, Math.floor(((e.clientX - b.left) / b.width) * n)));
          if (i !== hover) onHover(i);
        }}
        onMouseLeave={() => onHover(null)}
        style={{ position: 'absolute', left: 0, top: 0, bottom: 0, right: AX, cursor: 'crosshair' }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {levels.map((l, i) => (
            <line key={'g' + i} x1={0} x2={W} y1={Y(l)} y2={Y(l)} stroke="var(--hair)" vectorEffect="non-scaling-stroke" style={{ stroke: 'var(--hair)' }} />
          ))}
          {Array.from({ length: n }, (_, i) => i).filter((i) => i >= 4 && (i - 4) % 8 === 0).map((i) => (
            <line key={'v' + i} x1={i * cw} x2={i * cw} y1={0} y2={H} stroke="var(--row)" vectorEffect="non-scaling-stroke" style={{ stroke: 'var(--row)' }} />
          ))}
          {candles.map((c, i) => (
            <rect
              key={'vo' + i}
              x={i * cw + cw * 0.2}
              width={cw * 0.6}
              y={H - (c.v || 0.3) * H * 0.14}
              height={(c.v || 0.3) * H * 0.14}
              fill={c.c >= c.o ? 'var(--green)' : 'var(--red)'}
              opacity={0.2}
              style={{ fill: c.c >= c.o ? 'var(--green)' : 'var(--red)' }}
            />
          ))}
          {candles.map((c, i) => {
            const col = c.c >= c.o ? 'var(--green)' : 'var(--red)';
            const x = i * cw + cw / 2;
            return (
              <line key={'w' + i} x1={x} x2={x} y1={Y(c.h)} y2={Y(c.l)} stroke={col} vectorEffect="non-scaling-stroke" style={{ stroke: col }} />
            );
          })}
          {candles.map((c, i) => {
            const col = c.c >= c.o ? 'var(--green)' : 'var(--red)';
            return (
              <rect
                key={'b' + i}
                x={i * cw + cw * 0.2}
                width={cw * 0.6}
                y={Y(Math.max(c.o, c.c))}
                height={Math.max(2, Math.abs(Y(c.o) - Y(c.c)))}
                fill={col}
                style={{ fill: col }}
              />
            );
          })}
        </svg>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: ((idx + 0.5) / n) * 100 + '%', borderLeft: '1px dashed var(--line4)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: pct(k.c) + '%', borderTop: '1px dashed var(--line4)', pointerEvents: 'none' }} />
        <div style={{ fontFamily: MONO, position: 'absolute', left: 0, right: 0, top: pct(3000) + '%', borderTop: '1px dashed var(--line4)', pointerEvents: 'none' }}>
          <span style={{ position: 'absolute', left: 6, bottom: 3, fontSize: 9, color: 'var(--t3)', whiteSpace: 'nowrap' }}>Neutral (0.0 °C)</span>
        </div>
      </div>
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: AX, borderLeft: '1px solid var(--hair)', pointerEvents: 'none' }}>
        {levels.map((l, i) => (
          <div key={i} style={{ fontFamily: MONO, position: 'absolute', left: 7, top: pct(l) + '%', transform: 'translateY(-50%)', fontSize: 9, color: 'var(--t4)' }}>
            {l.toLocaleString('en-US')}
          </div>
        ))}
        <div style={{ fontFamily: MONO, position: 'absolute', left: 0, right: 0, top: pct(lastC) + '%', transform: 'translateY(-50%)', fontSize: 9, fontWeight: 600, padding: '2px 6px', background: up ? 'var(--green)' : 'var(--red)', color: 'var(--bg)', transition: 'top .3s' }}>
          {num(lastC)}
        </div>
        {hover != null ? (
          <div style={{ fontFamily: MONO, position: 'absolute', left: 0, right: 0, top: pct(k.c) + '%', transform: 'translateY(-50%)', fontSize: 9, padding: '2px 6px', background: 'var(--line2)', color: 'var(--t1)' }}>
            {num(k.c)}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ProductSection() {
  const { w } = useViewport();
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const rndRef = useRef<(() => number) | null>(null);
  const liveRef = useRef<{ btc: Candle[]; trades: Trade[] }>({ btc: NINO_CANDLES, trades: [] });
  const [measured, setMeasured] = useState<number | null>(null);
  const [btc, setBtc] = useState<Candle[]>(NINO_CANDLES);
  const [trades, setTrades] = useState<Trade[]>(() => createSeededTrades().trades);
  const [hover, setHover] = useState<number | null>(null);
  const [bookTab, setBookTab] = useState<BookTab>('book');
  const [posTab, setPosTab] = useState<PosTab>('Positions');
  const [tiTab, setTiTab] = useState<TiTab>('Margin Used');
  const [mkTab, setMkTab] = useState<MkTab>('Market');
  const [side, setSide] = useState<Side>('long');
  const [bsize, setBsize] = useState('');
  const [flashRow, setFlashRow] = useState(-1);
  const [clock, setClock] = useState('--:--:-- UTC');
  const [timesReady, setTimesReady] = useState(false);

  const wide = w >= 900;
  const cw = measured ?? Math.min(1680, w - 48) - 2;
  const desktop = cw >= 1330;
  const scale = desktop ? 1 : Math.min(1, cw / 1280);
  const d = derive(btc, hover, flashRow, tiTab, trades[0]);
  const longOn = sideStyle(side === 'long');
  const shortOn = sideStyle(side !== 'long');

  useEffect(() => {
    const apply = () => {
      const node = frameRef.current;
      if (!node) return;
      const next = node.clientWidth;
      setMeasured((prev) => (prev === next ? prev : next));
    };
    apply();
    const ro = new ResizeObserver(apply);
    if (frameRef.current) ro.observe(frameRef.current);
    window.addEventListener('resize', apply);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', apply);
    };
  }, []);

  useEffect(() => {
    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduce = reduceQuery.matches;
    let visible = false;
    let timer: number | undefined;
    let flashTimer: number | undefined;
    const seeded = createSeededTrades();
    rndRef.current = seeded.rnd;
    const now = Date.now();
    const stamped = seeded.trades.map((t, i) => ({ ...t, t: now - i * 3700 }));
    liveRef.current = { btc: NINO_CANDLES, trades: stamped };
    setBtc(NINO_CANDLES);
    setTrades(stamped);
    setClock(formatClock(new Date(now)));
    setTimesReady(true);

    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = undefined;
    };
    const start = () => {
      stop();
      if (reduce || !visible) return;
      timer = window.setInterval(() => {
        const rnd = rndRef.current;
        if (!rnd) return;
        const cur = liveRef.current;
        const moved = stepCandle(cur.btc, rnd);
        const trade: Trade = { p: moved.price, s: Math.round(1 + rnd() * 40), up: moved.up, t: Date.now() };
        const nextTrades = [trade, ...cur.trades.slice(0, 13)];
        liveRef.current = { btc: moved.btc, trades: nextTrades };
        setBtc(moved.btc);
        setTrades(nextTrades);
        setFlashRow(Math.floor(rnd() * 16));
        setClock(formatClock(new Date()));
        window.clearTimeout(flashTimer);
        flashTimer = window.setTimeout(() => setFlashRow(-1), 450);
      }, 1500);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    if (sectionRef.current) io.observe(sectionRef.current);
    const onReduce = () => {
      reduce = reduceQuery.matches;
      if (reduce) stop();
      else if (visible) start();
    };
    reduceQuery.addEventListener('change', onReduce);
    return () => {
      stop();
      window.clearTimeout(flashTimer);
      io.disconnect();
      reduceQuery.removeEventListener('change', onReduce);
    };
  }, []);

  const addQuick = (v: number) => {
    setBsize((cur) => {
      const n = parseFloat(String(cur).replace(/,/g, '')) || 0;
      return (n + v).toLocaleString('en-US');
    });
  };

  return (
    <section
      ref={sectionRef}
      id="product"
      data-reveal
      data-screen-label="Product"
      style={{ maxWidth: 1344, margin: '0 auto', padding: 'clamp(56px,7vw,88px) clamp(16px,3vw,32px) 0', scrollMarginTop: 88, lineHeight: 'normal' }}
    >
      <style>{'#product a.dx-enable:hover{filter:brightness(1.08);color:#fff}'}</style>
      <div style={{ display: 'grid', gridTemplateColumns: wide ? 'minmax(0,7fr) minmax(0,5fr)' : 'minmax(0,1fr)', gap: '20px 48px', alignItems: 'end', marginBottom: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--t4)' }}>The product</span>
            <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--green)', background: 'color-mix(in srgb,var(--emerald) 12%,transparent)', border: '1px solid color-mix(in srgb,var(--emerald) 22%,transparent)', borderRadius: 100, padding: '3px 9px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)' }} />
              LIVE TODAY
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: 'clamp(30px,3.4vw,44px)', fontWeight: 600, lineHeight: 1.08, letterSpacing: '-0.03em', textWrap: 'balance' }}>A full exchange, live on mainnet.</h2>
        </div>
        <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: 'var(--t3)', maxWidth: 560, textWrap: 'pretty' }}>Order book, charting, margin and settlement in one terminal. One signature to trade, no gas, and your USDC never leaves your control.</p>
      </div>

      <div
        ref={frameRef}
        style={{
          width: 'calc(100vw - 48px)',
          maxWidth: 1680,
          marginLeft: '50%',
          transform: 'translateX(-50%)',
          boxSizing: 'border-box',
          border: '1px solid var(--line)',
          borderRadius: 12,
          overflow: 'hidden',
          background: 'var(--bg)',
          WebkitMaskImage: 'linear-gradient(to bottom,#000 calc(100% - 140px),transparent)',
          maskImage: 'linear-gradient(to bottom,#000 calc(100% - 140px),transparent)',
        }}
      >
        <div style={{ height: 38, background: 'var(--card2)', borderBottom: '1px solid var(--hair)', display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--line2)' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--line2)' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--line2)' }} />
          <span style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--t3)', background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 6, padding: '4px 14px' }}>dexetera.xyz/token/NINO34-DEC26</span>
          </span>
        </div>
        <div style={{ position: 'relative', height: Math.round(803 * scale), overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: desktop ? '100%' : 1280, height: 803, transform: desktop ? 'none' : `scale(${scale.toFixed(4)})`, transformOrigin: '0 0', fontFamily: SANS, color: 'var(--t1)', background: 'var(--bg)' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 52, bottom: 0, background: 'var(--card)', borderRight: '1px solid var(--hair)', boxSizing: 'border-box' }}>
              <span style={{ position: 'absolute', left: 10, top: 14, width: 32, height: 32, borderRadius: 8, background: 'var(--line2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ico icon={User} size={16} color="var(--t3)" />
              </span>
              {RAIL.map((item) => (
                <span key={item.top} style={{ position: 'absolute', left: 17, top: item.top, width: 18, height: 18, display: 'flex' }}>
                  <Ico icon={item.icon} size={18} color="var(--t3)" />
                </span>
              ))}
            </div>

            <div style={{ position: 'absolute', left: 52, top: 0, right: 0, height: 56, boxSizing: 'border-box', borderBottom: '1px solid var(--hair)', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
              <div style={{ width: 122, display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
                <img src="/assets/dexetera-logo.png" alt="Dexetera" style={{ width: 36, height: 36, borderRadius: 8, display: 'block' }} />
                <span style={{ fontFamily: SERIF, fontSize: 14, letterSpacing: '0.04em' }}>DEXETERA</span>
              </div>
              <span style={{ width: 1, height: 22, background: 'var(--line2)', flex: 'none' }} />
              <div style={{ marginLeft: 12, flex: '1 1 463px', maxWidth: 463, minWidth: 200, height: 30, boxSizing: 'border-box', background: 'var(--card3)', border: '1px solid var(--line2)', borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 40, fontSize: 14, color: 'var(--t2)', whiteSpace: 'nowrap', overflow: 'hidden' }}>Search Active Markets</div>
              <div style={{ marginLeft: 24, display: 'flex', gap: 22, textAlign: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ fontSize: 12, color: 'var(--t-soft)' }}>Portfolio</span>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>$90.10</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ fontSize: 12, color: 'var(--t-soft)', display: 'flex', alignItems: 'center', gap: 5 }}>Available Cash<span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)' }} /></span>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>$24.58</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ fontSize: 12, color: 'var(--t-soft)' }}>Unrealized P&L</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--green)' }}>+$24.74</span>
                </div>
              </div>
              <span style={{ flex: 1 }} />
              <span style={{ marginLeft: 16, width: 111, height: 36, borderRadius: 6, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 14, fontWeight: 600, flex: 'none', color: '#fff' }}>
                Deposit
                <span style={{ width: 20, height: 18, boxSizing: 'border-box', border: '1.5px solid #fff', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Ico icon={Wallet} size={11} color="#fff" />
                </span>
              </span>
              <span style={{ marginLeft: 20, display: 'flex' }}><Ico icon={Bell} size={17} color="var(--t-hi)" /></span>
              <span style={{ marginLeft: 16, height: 26, padding: '0 10px', display: 'flex', alignItems: 'center', border: '1px solid var(--line2)', borderRadius: 6, fontSize: 12, color: 'var(--t-soft)' }}>Demo view</span>
              <span style={{ marginLeft: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 28, height: 28, boxSizing: 'border-box', borderRadius: '50%', border: '2px solid var(--green)', background: 'var(--line2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Ico icon={User} size={14} color="var(--t2)" />
                </span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Trader</span>
                <Ico icon={ChevronDown} size={13} color="var(--t2)" />
              </span>
            </div>

            <div style={{ position: 'absolute', left: 52, top: 56, right: 0, height: 46, boxSizing: 'border-box', borderBottom: '1px solid var(--hair)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', width: 'max-content', height: 46, alignItems: 'center', fontFamily: MONO, fontSize: 12, animation: 'dx-ticker 70s linear infinite' }}>
                {d.ticker.concat(d.ticker).map((t, i) => (
                  <span key={t[0] + i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '0 24px', whiteSpace: 'nowrap' }}>
                    <span style={{ color: 'var(--t-soft)' }}>{t[0]}</span>
                    <span style={{ color: 'var(--t1)' }}>{t[1]}</span>
                    <span style={{ color: t[2] < 0 ? 'var(--red)' : 'var(--green)' }}>{(t[2] >= 0 ? '+' : '') + t[2].toFixed(2) + '%'}</span>
                  </span>
                ))}
              </div>
            </div>

            <div style={{ position: 'absolute', left: 52, top: 102, right: 0, height: 138, boxSizing: 'border-box', background: 'var(--card)', borderBottom: '1px solid var(--hair)' }}>
              <div style={{ position: 'absolute', left: 16, right: 16, top: 8, height: 52, display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'relative', display: 'flex' }}>
                  <img src="/assets/nino34-icon.svg" alt="" style={{ width: 34, height: 34, borderRadius: '50%', display: 'block', flex: 'none' }} />
                  <span style={{ position: 'absolute', right: -1, bottom: -1, width: 9, height: 9, borderRadius: '50%', background: 'var(--green)', border: '2px solid var(--card)' }} />
                </span>
                <div style={{ flex: 'none', marginLeft: 12, display: 'flex', flexDirection: 'column', gap: 2, whiteSpace: 'nowrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, fontWeight: 600 }}>
                    Niño 3.4
                    <Ico icon={BadgeCheck} size={16} color="var(--violet)" />
                  </span>
                  <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', color: 'var(--t3)' }}>NINO34-DEC26</span>
                </div>
                <span style={{ flex: 'none', whiteSpace: 'nowrap', marginLeft: 16, height: 24, padding: '0 10px', display: 'flex', alignItems: 'center', gap: 7, border: '1px solid color-mix(in srgb,var(--amber) 35%,transparent)', background: 'color-mix(in srgb,var(--amber) 8%,transparent)', borderRadius: 4, fontFamily: MONO, fontSize: 12, color: 'var(--amber)' }}>
                  <Ico icon={Calendar} size={13} color="var(--amber)" />
                  Settles Dec 31, 2026
                </span>
                <div style={{ flex: 'none', marginLeft: 14, display: 'flex', gap: 6 }}>
                  {['Climate', 'Weather', 'Index'].map((tag) => (
                    <span key={tag} style={{ flex: 'none', whiteSpace: 'nowrap', height: 22, padding: '0 8px', display: 'flex', alignItems: 'center', border: '1px solid var(--line2)', background: 'var(--card2)', borderRadius: 4, fontSize: 11, color: 'var(--t2)' }}>{tag}</span>
                  ))}
                  <span style={{ flex: 'none', height: 22, padding: '0 7px', display: 'flex', alignItems: 'center', border: '1px solid color-mix(in srgb,var(--green) 35%,transparent)', borderRadius: 4, fontSize: 11, color: 'var(--green)' }}>+3</span>
                </div>
                <div style={{ flex: 'none', marginLeft: 16, display: 'flex', gap: 8 }}>
                  {[['OB', '0x8EB2...94D1'], ['ID', '0x2803...8da8']].map(([k, addr]) => (
                    <span key={k} style={{ flex: 'none', whiteSpace: 'nowrap', height: 24, padding: '0 6px 0 3px', display: 'flex', alignItems: 'center', gap: 6, border: '1px solid var(--line2)', background: 'var(--card2)', borderRadius: 4, fontFamily: MONO, fontSize: 11, color: 'var(--t2)' }}>
                      <span style={{ fontSize: 9, color: 'var(--t3)', background: 'var(--ln)', borderRadius: 3, padding: '2px 4px' }}>{k}</span>
                      {addr}
                      <Ico icon={Copy} size={11} color="var(--t4)" />
                    </span>
                  ))}
                </div>
                <div style={{ flex: 'none', marginLeft: 16, width: 102, height: 46, boxSizing: 'border-box', border: '1px solid var(--line)', borderRadius: 6, background: 'var(--card2)', display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px' }}>
                  <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'color-mix(in srgb,var(--violet) 18%,transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Ico icon={Eye} size={14} color="var(--violet-soft)" />
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--t3)' }}>WATCHING</span>
                    <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 600 }}>0</span>
                  </span>
                </div>
                <span style={{ marginLeft: 18, width: 8, height: 8, borderRadius: '50%', background: 'var(--line2)' }} />
                <span style={{ flex: 1 }} />
                <span style={{ width: 32, height: 32, boxSizing: 'border-box', border: '1px solid var(--line2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Ico icon={Star} size={15} color="var(--t-soft)" />
                </span>
                <span style={{ marginLeft: 8, height: 32, padding: '0 14px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg,#6366F1,#8B5CF6 50%,#A855F7)' }}>
                  <Ico icon={Share} size={14} color="#fff" />
                  Share
                </span>
              </div>
              <div style={{ position: 'absolute', left: 26, right: 16, top: 66, height: 28, display: 'flex', alignItems: 'center', gap: 22, overflow: 'hidden', fontFamily: MONO, fontSize: 11 }}>
                {d.stats.map((st) => (
                  <span key={st.l} style={{ display: 'flex', gap: 6, whiteSpace: 'nowrap' }}>
                    <span style={{ color: 'var(--t3)', letterSpacing: '0.06em' }}>{st.l}</span>
                    <span style={{ fontWeight: 600, color: st.c }}>{st.v}</span>
                  </span>
                ))}
              </div>
              <div style={{ position: 'absolute', left: 10, right: 16, top: 98, height: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ flex: 1, minWidth: 0, height: 26, display: 'flex', alignItems: 'center', padding: '0 6px', background: 'var(--card2)', borderRadius: 4, fontSize: 11, color: 'var(--t4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>A market tracking the NOAA CPC monthly Niño 3.4 sea surface temperature anomaly in °C. Settles at 3,000 + 1,000 × anomaly, floored at zero, $1 per point. Source: NOAA Climate Prediction Center.</span>
                <span style={{ width: 57, height: 26, boxSizing: 'border-box', border: '1px solid var(--line2)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 11, color: 'var(--t3)' }}>
                  <Ico icon={ChevronDown} size={12} color="var(--t3)" />
                  More
                </span>
              </div>
            </div>

            <div style={{ position: 'absolute', left: 56, right: 4, top: 242, display: 'grid', gridTemplateColumns: 'minmax(0,2.2fr) minmax(0,1fr) 320px', gridTemplateRows: '318px 240px', gap: '3px 5px' }}>
              <div style={{ position: 'relative', gridColumn: 1, gridRow: 1, boxSizing: 'border-box', border: '1px solid var(--ln)', borderRadius: 6, background: 'var(--card)', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 40, boxSizing: 'border-box', borderBottom: '1px solid var(--ln)', display: 'flex', alignItems: 'center', gap: 14, padding: '0 10px', fontSize: 15, color: 'var(--t-soft)' }}>
                  <Ico icon={Search} size={17} color="var(--t-soft)" />
                  <span style={{ width: 68 }}>NINO34</span>
                  <span style={{ width: 1, height: 22, background: 'var(--line2)', flex: 'none' }} />
                  <Ico icon={CirclePlus} size={20} color="var(--t-soft)" />
                  <span style={{ width: 1, height: 22, background: 'var(--line2)', flex: 'none' }} />
                  <span>1D</span>
                  <span style={{ width: 1, height: 22, background: 'var(--line2)', flex: 'none' }} />
                  <Ico icon={ChartCandlestick} size={19} color="var(--t-soft)" />
                  <span style={{ width: 1, height: 22, background: 'var(--line2)', flex: 'none' }} />
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontStyle: 'italic', fontFamily: SERIF, fontSize: 16 }}>fx</span>Indicators</span>
                  <span style={{ width: 1, height: 22, background: 'var(--line2)', flex: 'none' }} />
                  <Ico icon={Undo2} size={17} color="var(--t-soft)" />
                  <Ico icon={Redo2} size={17} color="var(--t4)" />
                  <span style={{ width: 1, height: 22, background: 'var(--line2)', flex: 'none' }} />
                  <span style={{ display: 'flex', gap: 16 }}>
                    <Ico icon={History} size={18} color="var(--t-soft)" />
                    <Ico icon={Hexagon} size={18} color="var(--t-soft)" />
                    <Ico icon={Maximize} size={18} color="var(--t-soft)" />
                    <Ico icon={Camera} size={18} color="var(--t-soft)" />
                  </span>
                </div>
                <div style={{ position: 'absolute', left: 0, top: 40, bottom: 0, width: 54, boxSizing: 'border-box', borderRight: '1px solid var(--ln)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, paddingTop: 10 }}>
                  {DRAW.map((icon, i) => (
                    <span key={i} style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, boxSizing: 'border-box', background: i === 0 ? 'var(--line2)' : undefined, border: i === 0 ? '1px solid var(--line3)' : undefined }}>
                      <Ico icon={icon} size={20} color="var(--t-soft)" />
                    </span>
                  ))}
                </div>
                <span style={{ position: 'absolute', left: 50, top: 240, width: 7, height: 22, boxSizing: 'border-box', background: 'var(--ln)', border: '1px solid var(--line2)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Ico icon={ChevronLeft} size={7} color="var(--t3)" />
                </span>
                <div style={{ position: 'absolute', left: 56, right: 0, top: 40, height: 240 }}>
                  <CandleChart candles={btc} hover={hover} onHover={setHover} />
                </div>
                <div style={{ position: 'absolute', left: 66, top: 50, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 5, pointerEvents: 'none' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 16, color: 'var(--t-hi)' }}>
                    NINO34-DEC26 (NOAA CPC) · 1D · ORDERBOOK
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 0 3px color-mix(in srgb,var(--green) 18%,transparent)' }} />
                  </span>
                  <span style={{ display: 'flex', gap: 10, fontFamily: MONO, fontSize: 12, color: 'var(--t-soft)' }}>
                    <span>O <span style={{ color: d.leg.col }}>{d.leg.o}</span></span>
                    <span>H <span style={{ color: d.leg.col }}>{d.leg.h}</span></span>
                    <span>L <span style={{ color: d.leg.col }}>{d.leg.l}</span></span>
                    <span>C <span style={{ color: d.leg.col }}>{d.leg.c}</span></span>
                    <span style={{ color: d.leg.col }}>{d.leg.chg}</span>
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--t-soft)' }}>Live Metric Tracker (1) NINO34</span>
                  <span style={{ width: 28, height: 20, boxSizing: 'border-box', border: '1px solid var(--line2)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--card)' }}>
                    <Ico icon={ChevronUp} size={12} color="var(--t-soft)" />
                  </span>
                </div>
                <div style={{ position: 'absolute', left: 56, right: 0, top: 278, height: 38, boxSizing: 'border-box', borderTop: '1px solid var(--ln)', display: 'flex', alignItems: 'center', gap: 14, padding: '0 6px 0 14px', fontSize: 14, color: 'var(--t-soft)', background: 'var(--card)' }}>
                  <span>5y</span><span>1y</span><span>3m</span><span>1m</span><span>5d</span><span>1d</span>
                  <span style={{ width: 1, height: 22, background: 'var(--line2)', flex: 'none' }} />
                  <Ico icon={CalendarRange} size={18} color="var(--t-soft)" />
                  <span style={{ flex: 1 }} />
                  <span style={{ fontFamily: MONO, fontSize: 13 }} suppressHydrationWarning>{clock}</span>
                  <span style={{ width: 1, height: 22, background: 'var(--line2)', flex: 'none' }} />
                  <span>%</span><span>log</span>
                  <span style={{ height: 30, padding: '0 6px', display: 'flex', alignItems: 'center', background: 'var(--line2)', borderRadius: 4 }}>auto</span>
                </div>
              </div>

              <div style={{ position: 'relative', gridColumn: 1, gridRow: 2, boxSizing: 'border-box', border: '1px solid var(--ln)', borderRadius: 6, background: 'var(--card)', overflow: 'hidden' }}>
                <div style={{ height: 46, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px' }}>
                  {POS_TABS.map((tab) => {
                    const on = posTab === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setPosTab(tab)}
                        style={{ height: 34, padding: '0 10px', display: 'flex', alignItems: 'center', gap: 8, borderRadius: 4, border: '1px solid ' + (on ? 'var(--line2)' : 'transparent'), background: on ? 'var(--card2)' : 'transparent', color: on ? 'var(--t1)' : 'var(--t-soft)', fontFamily: SANS, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
                      >
                        {tab}
                        <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--t2)', background: 'var(--line2)', borderRadius: 3, padding: '1px 6px' }}>{POS_COUNTS[tab]}</span>
                      </button>
                    );
                  })}
                  <span style={{ flex: 1 }} />
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--t-soft)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} />
                    Live
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1fr) minmax(0,1.2fr) minmax(0,1.8fr) minmax(0,1.8fr) minmax(0,1.1fr) minmax(0,1.3fr)', alignItems: 'center', height: 34, padding: '0 12px 0 9px', borderTop: '1px solid var(--hair)', borderBottom: '1px solid var(--hair)', fontSize: 10, color: 'var(--t-soft)', letterSpacing: '0.02em' }}>
                  <span>SYMBOL</span><span>SIDE</span><span style={{ textAlign: 'right' }}>SIZE</span><span style={{ textAlign: 'right' }}>ENTRY</span><span style={{ textAlign: 'right' }}>MARK</span><span style={{ textAlign: 'right' }}>PNL</span><span style={{ textAlign: 'right' }}>LIQ PRICE</span>
                </div>
                {posTab === 'Positions' ? d.positions.map((r) => (
                  <div key={r.sub} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1fr) minmax(0,1.2fr) minmax(0,1.8fr) minmax(0,1.8fr) minmax(0,1.1fr) minmax(0,1.3fr)', alignItems: 'center', height: 44, padding: '0 12px 0 9px', borderBottom: '1px solid var(--hair)', fontFamily: MONO, fontSize: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                      <span style={{ width: 14, height: 14, flex: 'none', boxSizing: 'border-box', borderRadius: '50%', background: 'var(--card3)', border: '1px solid var(--line3)', fontFamily: SANS, fontSize: 8, fontWeight: 700, color: 'var(--t-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{r.ic}</span>
                      <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0, fontFamily: SANS }}>
                        <span style={{ fontSize: 12, color: 'var(--t-hi)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</span>
                        <span style={{ fontSize: 10, color: 'var(--t3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.sub}</span>
                      </span>
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--green)' }}>LONG</span>
                    <span style={{ textAlign: 'right' }}>{r.size}</span>
                    <span style={{ textAlign: 'right', color: 'var(--t4)' }}>{r.entry}</span>
                    <span style={{ textAlign: 'right' }}>{r.mark}</span>
                    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', color: r.pc }}>
                      <span style={{ fontSize: 11 }}>{r.pnl}</span>
                      <span style={{ fontSize: 9 }}>{r.pct}</span>
                    </span>
                    <span style={{ textAlign: 'right' }}>{r.liq}</span>
                  </div>
                )) : (
                  <div style={{ padding: '56px 0', textAlign: 'center', fontSize: 12, color: 'var(--t4)' }}>
                    {POS_COUNTS[posTab] ? 'Open the app to view ' + posTab.toLowerCase() : 'No ' + posTab.toLowerCase() + ' yet'}
                  </div>
                )}
              </div>

              <div style={{ position: 'relative', gridColumn: 2, gridRow: '1 / 3', boxSizing: 'border-box', border: '1px solid var(--ln)', borderRadius: 6, background: 'var(--card)' }}>
                <span style={{ ...pillStyle(), top: -11, left: 12 }}>
                  <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--bg)', color: 'var(--t1)', fontFamily: MONO, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
                  Live order book
                </span>
                <div style={{ position: 'absolute', left: 12, right: 12, top: 12, height: 28, boxSizing: 'border-box', background: 'var(--card3)', borderRadius: 4, padding: 2, display: 'flex' }}>
                  {([['book', 'BOOK'], ['trades', 'TRADES']] as const).map(([id, label]) => {
                    const on = bookTab === id;
                    return (
                      <button key={id} type="button" onClick={() => setBookTab(id)} style={{ flex: 1, border: 'none', borderRadius: 3, background: on ? 'var(--line2)' : 'transparent', color: on ? 'var(--t1)' : 'var(--t2)', fontFamily: SANS, fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>{label}</button>
                    );
                  })}
                </div>
                {bookTab === 'book' ? (
                  <>
                    <div style={{ position: 'absolute', left: 0, right: 0, top: 46, textAlign: 'center', fontSize: 11, color: 'var(--t-soft)' }}>Order Book</div>
                    <div style={{ position: 'absolute', left: 0, right: 0, top: 68, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '0 12px', fontSize: 11, color: 'var(--t-soft)', textAlign: 'center' }}>
                      <span>PRICE</span><span style={{ whiteSpace: 'nowrap' }}>SIZE</span><span>TOTAL (USD)</span>
                    </div>
                    <div style={{ position: 'absolute', left: 0, right: 0, top: 88, height: 198, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                      {d.asks.map((o) => (
                        <div key={o.p} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '0 12px', height: 22, alignItems: 'center', fontFamily: MONO, fontSize: 12, background: o.bg, transition: 'background .35s' }}>
                          <span style={{ position: 'absolute', right: 0, top: 1, bottom: 1, width: o.depth, background: 'color-mix(in srgb,var(--red) 8%,transparent)', transition: 'width .4s' }} />
                          <span style={{ position: 'relative', textAlign: 'center', color: 'var(--red)' }}>{o.p}</span>
                          <span style={{ position: 'relative', textAlign: 'center', color: 'var(--t-soft)' }}>{o.s}</span>
                          <span style={{ position: 'relative', textAlign: 'center', color: 'var(--t1)' }}>{o.t}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ position: 'absolute', left: 12, right: 12, top: 290, display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
                      <span style={{ color: 'var(--t-soft)' }}>ASKS (SELL)</span>
                      <span style={{ color: 'var(--red)' }}>{d.askCount}</span>
                    </div>
                    <div style={{ position: 'absolute', left: 12, right: 12, top: 308, height: 26, background: 'var(--card3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 12, color: 'var(--t3)' }}>{d.spreadTxt}</div>
                    <div style={{ position: 'absolute', left: 12, right: 12, top: 340, display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
                      <span style={{ color: 'var(--t-soft)' }}>BIDS (BUY)</span>
                      <span style={{ color: 'var(--green)' }}>{d.bidCount}</span>
                    </div>
                    <div style={{ position: 'absolute', left: 0, right: 0, top: 356, display: 'flex', flexDirection: 'column' }}>
                      {d.bids.map((o) => (
                        <div key={o.p} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '0 12px', height: 22, alignItems: 'center', fontFamily: MONO, fontSize: 12, background: o.bg, transition: 'background .35s' }}>
                          <span style={{ position: 'absolute', right: 0, top: 1, bottom: 1, width: o.depth, background: 'color-mix(in srgb,var(--emerald) 10%,transparent)', transition: 'width .4s' }} />
                          <span style={{ position: 'relative', textAlign: 'center', color: 'var(--green)' }}>{o.p}</span>
                          <span style={{ position: 'relative', textAlign: 'center', color: 'var(--t-soft)' }}>{o.s}</span>
                          <span style={{ position: 'relative', textAlign: 'center', color: 'var(--t1)' }}>{o.t}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ position: 'absolute', left: 0, right: 0, top: 56, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '0 12px 8px', fontSize: 11, color: 'var(--t-soft)', textAlign: 'center' }}>
                      <span>PRICE</span><span>SIZE (CONTRACTS)</span><span>TIME</span>
                    </div>
                    {trades.map((t, i) => (
                      <div key={t.t + '-' + i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '0 12px', height: 22, alignItems: 'center', textAlign: 'center', fontFamily: MONO, fontSize: 12 }}>
                        <span style={{ color: t.up ? 'var(--green)' : 'var(--red)' }}>{'$' + t.p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <span style={{ color: 'var(--t-soft)' }}>{t.s}</span>
                        <span style={{ color: 'var(--t3)' }}>{timesReady ? formatTradeTime(t.t) : '--:--:--'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ gridColumn: 3, gridRow: '1 / 3', display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
                <span style={{ ...pillStyle(), top: -11, left: 150 }}>
                  <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--bg)', color: 'var(--t1)', fontFamily: MONO, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
                  Source + UMA settlement
                </span>
                <span style={{ ...pillStyle(), top: 193, left: 12 }}>
                  <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--bg)', color: 'var(--t1)', fontFamily: MONO, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                  Gasless, one signature
                </span>
                <div style={{ position: 'relative', height: 198, flex: 'none', boxSizing: 'border-box', border: '1px solid var(--ln)', borderRadius: 6, background: 'var(--card)' }}>
                  <div style={{ height: 30, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--red)' }} />
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--t-hi)' }}>Metric Source</span>
                    <span style={{ flex: 1 }} />
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--red)' }}>
                      cpc.ncep.noaa.gov
                      <Ico icon={ExternalLink} size={11} color="var(--red)" />
                    </span>
                  </div>
                  <div style={{ position: 'absolute', left: 5, right: 5, top: 33, height: 158, boxSizing: 'border-box', border: '1px solid var(--ln)', borderRadius: 6 }}>
                    <div style={{ height: 28, display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)' }} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--t-hi)' }}>Token Information</span>
                      <span style={{ flex: 1 }} />
                      <span style={{ fontSize: 10, color: 'var(--t2)' }}>ACTIVE</span>
                    </div>
                    <span style={{ position: 'absolute', left: 8, top: 35 }}>
                      <img src="/assets/nino34-icon.svg" alt="" style={{ width: 26, height: 26, borderRadius: '50%', display: 'block', flex: 'none' }} />
                    </span>
                    <span style={{ position: 'absolute', left: 40, top: 28, fontSize: 13, fontWeight: 600 }}>Niño 3.4</span>
                    <div style={{ position: 'absolute', left: 38, top: 48, display: 'flex', gap: 4 }}>
                      {TI_TABS.map((tab) => {
                        const on = tiTab === tab;
                        return (
                          <button key={tab} type="button" onClick={() => setTiTab(tab)} style={{ height: 20, padding: '0 8px', border: 'none', borderRadius: 4, background: on ? 'var(--line2)' : 'transparent', color: on ? 'var(--t1)' : 'var(--t3)', fontFamily: SANS, fontSize: 11, cursor: 'pointer' }}>{tab}</button>
                        );
                      })}
                    </div>
                    <div style={{ position: 'absolute', left: 4, right: 4, top: 76, height: 76, boxSizing: 'border-box', border: '1px solid var(--line)', borderRadius: 6, background: 'var(--card2)', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)' }} />
                        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--t-hi)' }}>Current Price</span>
                        <span style={{ flex: 1 }} />
                        <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--green)', background: 'color-mix(in srgb,var(--emerald) 12%,transparent)', borderRadius: 3, padding: '1px 5px' }}>LIVE</span>
                        <span style={{ fontSize: 10, color: 'var(--t2)' }}>USDC</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontFamily: MONO, fontSize: 18, fontWeight: 700 }}>{d.curPrice}</span>
                        <span style={{ fontSize: 12, color: d.curChgColor }}>{d.curChg}</span>
                        <span style={{ flex: 1 }} />
                        <span style={{ width: 20, height: 20, boxSizing: 'border-box', border: '1px solid var(--line2)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Ico icon={Circle} size={8} color="var(--t2)" />
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--t2)' }}>
                        <span>{tiTab}:</span>
                        <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--t1)' }}>{d.tiVal}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ position: 'relative', height: 357, flex: 'none', boxSizing: 'border-box', border: '1px solid var(--ln)', borderRadius: 6, background: 'var(--card)', padding: '14px 14px 0', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: 42, flex: 'none', boxSizing: 'border-box', border: '1px solid var(--line)', borderRadius: 6, padding: 3, display: 'flex', gap: 4 }}>
                    {MK_TABS.map((tab) => {
                      const on = mkTab === tab;
                      return (
                        <button key={tab} type="button" onClick={() => setMkTab(tab)} style={{ flex: 1, border: 'none', borderRadius: 4, background: on ? 'var(--ln)' : 'transparent', color: on ? 'var(--t1)' : 'var(--t3)', fontFamily: SANS, fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: on ? 'var(--green)' : 'var(--t4)' }} />
                          {tab}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <button type="button" onClick={() => setSide('long')} style={{ height: 34, borderRadius: 6, border: '1px solid ' + longOn.border, background: longOn.bg, color: longOn.color, fontFamily: SANS, fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <span style={{ display: longOn.dot ? 'inline-block' : 'none', width: 5, height: 5, borderRadius: '50%', background: 'var(--t4)' }} />
                      Long
                      <span style={{ display: longOn.arrow ? 'inline' : 'none' }}>↗</span>
                    </button>
                    <button type="button" onClick={() => setSide('short')} style={{ height: 34, borderRadius: 6, border: '1px solid ' + shortOn.border, background: shortOn.bg, color: shortOn.color, fontFamily: SANS, fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <span style={{ display: shortOn.dot ? 'inline-block' : 'none', width: 5, height: 5, borderRadius: '50%', background: 'var(--t4)' }} />
                      Short
                      <span style={{ display: shortOn.arrow ? 'inline' : 'none' }}>↘</span>
                    </button>
                  </div>
                  <div style={{ marginTop: 14, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--t-soft)', letterSpacing: '0.02em' }}>POSITION SIZE</span>
                    <span style={{ height: 18, boxSizing: 'border-box', padding: '0 6px', display: 'flex', alignItems: 'center', gap: 4, border: '1px solid var(--line2)', background: 'var(--card3)', borderRadius: 4, fontSize: 10, color: 'var(--t3)' }}>
                      USD
                      <Ico icon={ArrowLeftRight} size={10} color="var(--t3)" />
                    </span>
                  </div>
                  <label style={{ marginTop: 10, height: 50, flex: 'none', boxSizing: 'border-box', border: '1px solid var(--line2)', borderRadius: 6, background: 'var(--card2)', display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px' }}>
                    <span style={{ fontSize: 20, fontWeight: 600, color: 'var(--t-soft)' }}>$</span>
                    <input
                      value={bsize}
                      onChange={(e) => setBsize(e.target.value.replace(/[^0-9.,]/g, '').slice(0, 12))}
                      placeholder="1,000.00"
                      aria-label="Position size"
                      style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: 'var(--t1)', fontFamily: MONO, fontSize: 22, textAlign: 'right', padding: 0 }}
                    />
                  </label>
                  <div style={{ marginTop: 14, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--t-soft)', letterSpacing: '0.02em' }}>QUICK AMOUNTS</span>
                    <span style={{ height: 18, boxSizing: 'border-box', padding: '0 6px', display: 'flex', alignItems: 'center', border: '1px solid var(--line2)', background: 'var(--card3)', borderRadius: 4, fontSize: 10, color: 'var(--t3)' }}>USD</span>
                  </div>
                  <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(5,minmax(0,1fr))', gap: 6 }}>
                    {QUICK.map((q) => (
                      <button
                        key={q.label}
                        type="button"
                        onClick={() => (q.add == null ? setBsize('24.58') : addQuick(q.add))}
                        style={{ height: 24, border: '1px solid var(--line)', borderRadius: 4, background: 'var(--card2)', color: q.color, fontFamily: SANS, fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 0 }}
                      >
                        <span style={{ width: 3, height: 3, borderRadius: '50%', background: q.color }} />
                        {q.label}
                      </button>
                    ))}
                  </div>
                  <div style={{ marginTop: 10, height: 14, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, paddingRight: 8, fontSize: 10, color: 'var(--line4)' }}>
                    <Ico icon={Gauge} size={11} color="var(--line4)" />
                    Slippage
                    <span style={{ color: 'var(--t4)' }}>1%</span>
                  </div>
                  <a className="dx-enable" href="https://dexetera.xyz/token/NINO34-DEC26" style={{ marginTop: 16, height: 42, flex: 'none', borderRadius: 8, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600, color: '#fff' }}>Enable Trading</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: wide ? 'repeat(3,minmax(0,1fr))' : 'minmax(0,1fr)', gap: 12 }}>
        <div style={{ display: 'flex', gap: 12, padding: '16px 4px' }}>
          <span style={{ flex: 'none', width: 20, height: 20, borderRadius: '50%', background: 'var(--btn-p-bg)', color: 'var(--btn-p-fg)', fontFamily: MONO, fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
          <span style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--t3)' }}><span style={{ color: 'var(--t1)', fontWeight: 600 }}>Live order book.</span> Real bids, asks and liquidations. The mark price comes from the book, not a model.</span>
        </div>
        <div style={{ display: 'flex', gap: 12, padding: '16px 4px' }}>
          <span style={{ flex: 'none', width: 20, height: 20, borderRadius: '50%', background: 'var(--btn-p-bg)', color: 'var(--btn-p-fg)', fontFamily: MONO, fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
          <span style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--t3)' }}><span style={{ color: 'var(--t1)', fontWeight: 600 }}>One signature to trade.</span> Gasless mode signs the order once. No gas token, no pop-up chain.</span>
        </div>
        <div style={{ display: 'flex', gap: 12, padding: '16px 4px' }}>
          <span style={{ flex: 'none', width: 20, height: 20, borderRadius: '50%', background: 'var(--btn-p-bg)', color: 'var(--btn-p-fg)', fontFamily: MONO, fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
          <span style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--t3)' }}><span style={{ color: 'var(--t1)', fontWeight: 600 }}>Settled from public data.</span> Every market names its source. UMA&apos;s optimistic oracle resolves disputes.</span>
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: wide ? 'repeat(5,minmax(0,1fr))' : 'minmax(0,1fr)', border: '1px solid var(--line)', borderRadius: 12, background: 'var(--card)' }}>
        {FEATURES.map((ft) => (
          <div key={ft.t} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10, borderRight: '1px solid var(--hair)', borderBottom: '1px solid var(--hair)' }}>
            <Ico icon={ft.icon} size={18} color="var(--t-gray)" />
            <span style={{ fontSize: 14, fontWeight: 600 }}>{ft.t}</span>
            <span style={{ fontSize: 12, lineHeight: 1.55, color: 'var(--t3)' }}>{ft.d}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
