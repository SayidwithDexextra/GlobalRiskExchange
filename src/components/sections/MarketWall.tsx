'use client';

import { useId, useMemo, useState } from 'react';
import { useViewport } from '@/hooks/useViewport';
import { useLiveMarket } from '@/hooks/useLiveMarket';
import { MARKETS, FILTERS, FEATURED_KPIS, FEATURED_SERIES, type Market } from '@/lib/data';
import { exampleBySymbol, formatExampleChange } from '@/lib/exampleMarkets';
import { AreaSpark } from '@/components/charts/AreaSpark';
import { rnd, resetSeed } from '@/lib/prng';

function fmtP(m: Market, v: number) {
  return m.pct
    ? v.toFixed(m.dec) + '%'
    : '$' + v.toLocaleString('en-US', { minimumFractionDigits: m.dec, maximumFractionDigits: m.dec });
}

function FeatChart({ data, volumeBars }: { data: number[]; volumeBars: number[] }) {
  const gid = useId();
  const W = 200;
  const H = 60;
  const mn = Math.min(...data);
  const mx = Math.max(...data);
  const pad = (mx - mn) * 0.18;
  const lo = mn - pad;
  const hi = mx + pad;
  const yy = (v: number) => ((hi - v) / (hi - lo)) * H;
  const pc = (v: number) => ((hi - v) / (hi - lo)) * 100;
  const levels = [0.12, 0.37, 0.62, 0.87].map((t) => hi - (hi - lo) * t);
  const last = data[data.length - 1];
  const pts = data.map((v, i) => [i / (data.length - 1) * W, yy(v)] as const);
  let line = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    line += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(2)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(2)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(2)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  const fill = `${line} L${W},${H} L0,${H} Z`;

  return (
    <div className="flex flex-1 flex-col gap-1.5 min-w-0">
      <div className="relative flex-1" style={{ minHeight: 64 }}>
        <div className="absolute left-0 top-0 bottom-0 right-12">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--green)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--green)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {levels.map((l, i) => (
              <line key={i} x1="0" x2={W} y1={yy(l)} y2={yy(l)} stroke="var(--hair)" vectorEffect="non-scaling-stroke" />
            ))}
            <path d={fill} fill={`url(#${gid})`} />
            <path d={line} fill="none" stroke="var(--green)" strokeWidth="1.75" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            <line x1="0" x2={W} y1={yy(last)} y2={yy(last)} stroke="var(--green)" strokeOpacity="0.4" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-12 border-l border-hair">
          {levels.map((l, i) => (
            <span
              key={i}
              className="absolute left-[7px] font-mono text-[9px] text-t4 -translate-y-1/2"
              style={{ top: pc(l) + '%' }}
            >
              ${l.toFixed(2)}
            </span>
          ))}
          <span
            className="absolute left-0 right-0 font-mono text-[9px] font-semibold px-1.5 py-0.5 -translate-y-1/2"
            style={{ top: pc(last) + '%', background: 'var(--green)', color: 'var(--bg)' }}
          >
            ${last.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="flex items-end gap-px h-4 mr-12 border-b border-hair">
        {volumeBars.map((v, i) => (
          <span
            key={i}
            className="flex-1 rounded-t-px"
            style={{
              height: Math.round(v * 100) + '%',
              background: i === volumeBars.length - 1 ? 'var(--t3)' : 'var(--line2)',
              borderRadius: '1px 1px 0 0',
            }}
          />
        ))}
      </div>
      <div className="flex justify-between font-mono text-[9px] text-t4 mr-12">
        {['90D', '60D', '30D', 'NOW'].map((x) => (
          <span key={x}>{x}</span>
        ))}
      </div>
    </div>
  );
}

export function MarketWall() {
  const { w } = useViewport();
  const { eggPrice, series } = useLiveMarket();
  const [filter, setFilter] = useState<string>('All');

  const M = w >= 900;
  const hdrCols = M ? 'minmax(0,7fr) minmax(0,5fr)' : 'minmax(0,1fr)';

  const volumeBars = useMemo(() => {
    resetSeed(11);
    for (let i = 0; i < 44 * 4 + 6 * 40; i++) rnd();
    return Array.from({ length: 90 }, (_, i) => 0.2 + 0.35 * (i / 89) + rnd() * 0.45);
  }, []);

  const feat = useMemo(() => {
    const m = MARKETS[0];
    const listed = exampleBySymbol(m.id);
    const chg = formatExampleChange(listed.change, { arrow: true });
    return {
      ...m,
      name: listed.name,
      price: fmtP(m, listed.price),
      chg: chg.text,
      chgColor: chg.color,
      tag: 'EXAMPLE',
      tagColor: 'var(--t4)',
      href: 'https://dexetera.xyz/explore',
      settleShort: m.settle,
      ...FEATURED_KPIS,
    };
  }, []);

  const cards = useMemo(() => {
    return MARKETS.slice(1).map((m, i) => {
      const isEgg = m.id === 'PRICE-EGGS';
      const listed = exampleBySymbol(m.id);
      const s = isEgg ? series[1] || [] : series[i + 1] || [];
      const price = isEgg ? eggPrice : listed.price;
      const chg = formatExampleChange(listed.change, { arrow: true });
      return {
        ...m,
        name: listed.name,
        price: fmtP(m, price),
        chg: chg.text,
        chgColor: chg.color,
        tag: 'EXAMPLE',
        tagColor: 'var(--t4)',
        href: 'https://dexetera.xyz/explore',
        settle: 'SETTLES ' + m.settle,
        series: s,
      };
    });
  }, [eggPrice, series]);

  const getOpacity = (cat: string) => (filter === 'All' || cat === filter ? 1 : 0.28);

  return (
    <div
      id="markets"
      data-reveal
      data-screen-label="Market wall"
      className="max-w-[1344px] mx-auto min-w-0 scroll-mt-[88px]"
      style={{ padding: 'clamp(28px,3.5vw,44px) clamp(16px,3vw,32px) 0' }}
    >
      <div
        className="grid items-end mb-5"
        style={{ gridTemplateColumns: hdrCols, gap: '20px 48px' }}
      >
        <div className="flex flex-col gap-2.5">
          <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-t4">
            Dexetera / Market wall
          </div>
          <h2
            className="m-0 font-semibold leading-[1.08] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(30px,3.4vw,44px)', textWrap: 'balance' }}
          >
            Possible markets on real-world numbers.
          </h2>
        </div>
        <p
          className="m-0 text-[17px] leading-[1.6] text-t3 max-w-[560px]"
          style={{ textWrap: 'pretty' }}
        >
          Every market tracks a public number, trades in USDC on an order book, and settles from the source. These examples show the kinds of markets anyone can list.
        </p>
      </div>

      <div className="flex gap-1 overflow-x-auto mb-3 pb-[2px] min-w-0">
        {FILTERS.map((f) => {
          const on = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="flex-none h-8 px-[14px] rounded-lg text-[12px] font-medium cursor-pointer font-sans"
              style={{
                background: on ? 'var(--glass-line2)' : 'transparent',
                border: `1px solid ${on ? 'color-mix(in srgb, var(--violet) 25%, transparent)' : 'transparent'}`,
                color: on ? 'var(--t1)' : 'var(--t3)',
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      <div
        className="grid gap-3 min-w-0"
        style={{
          gridTemplateColumns: M ? 'minmax(0,4fr) minmax(0,6fr)' : 'minmax(0,1fr)',
          gridTemplateRows: M ? '300px' : 'auto',
        }}
      >
        <a
          href={feat.href}
          className="flex flex-col gap-2.5 rounded-xl p-4 min-w-0 transition-all duration-150"
          style={{
            height: M ? '100%' : undefined,
            opacity: getOpacity(feat.cat),
            background: 'var(--card)',
            border: '1px solid var(--line)',
            color: 'var(--t1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--line3)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--line)';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <div className="flex justify-between items-center gap-2">
            <div className="flex gap-[6px] items-center">
              <span
                className="text-[10px] font-medium text-t3 px-[7px] py-[3px] rounded"
                style={{ background: 'var(--glass)', border: '1px solid var(--glass-line2)' }}
              >
                {feat.cat}
              </span>
              <span
                className="text-[10px] font-semibold tracking-[0.08em] px-[9px] py-[3px] rounded-full"
                style={{
                  color: 'var(--violet-soft)',
                  background: 'color-mix(in srgb, var(--violet) 15%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--violet) 30%, transparent)',
                }}
              >
                FEATURED
              </span>
            </div>
            <span className="font-mono text-[9px] tracking-[0.08em]" style={{ color: feat.tagColor }}>
              {feat.tag}
            </span>
          </div>

          <div
            className="flex justify-between items-end gap-3"
            style={{ flexWrap: M ? 'nowrap' : 'wrap' }}
          >
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-[18px] font-semibold tracking-[-0.015em] text-t1 whitespace-nowrap overflow-hidden text-ellipsis">
                {feat.name}
              </span>
              <span className="font-mono text-[11px] text-t4">
                {feat.id}/USDC · {feat.unit}
              </span>
            </div>
            <div className="flex items-baseline gap-[10px] flex-none">
              <span className="font-mono text-[24px] font-semibold text-t1">{feat.price}</span>
              <span className="font-mono text-[12px]" style={{ color: feat.chgColor }}>
                {feat.chg}
              </span>
            </div>
          </div>

          <div className="flex-1 min-h-0 relative flex">
            <FeatChart data={FEATURED_SERIES} volumeBars={volumeBars} />
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2.5" style={{ borderTop: '1px solid var(--hair)' }}>
            {[
              { l: 'VOLUME 24H', v: feat.vol },
              { l: 'OPEN INT.', v: feat.oi },
              { l: 'TRADERS', v: feat.traders },
              { l: 'SETTLES', v: feat.settleShort, color: 'var(--amber-text)', size: 12 },
            ].map((kpi) => (
              <div key={kpi.l} className="flex flex-col gap-1 min-w-0">
                <span className="font-mono text-[9px] tracking-[0.1em] text-t4">{kpi.l}</span>
                <span
                  className="font-mono font-semibold"
                  style={{ fontSize: kpi.size || 14, color: kpi.color || 'var(--t1)' }}
                >
                  {kpi.v}
                </span>
              </div>
            ))}
          </div>
        </a>

        <div
          className="min-w-0"
          style={{
            display: M ? 'grid' : 'flex',
            gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
            gridTemplateRows: 'repeat(2,minmax(0,1fr))',
            gap: 12,
            height: M ? '100%' : undefined,
            overflowX: M ? 'visible' : 'auto',
            scrollSnapType: 'x mandatory',
            paddingBottom: M ? 0 : 4,
          }}
        >
          {cards.map((c) => (
            <a
              key={c.id}
              href={c.href}
              className="flex flex-col gap-1.5 rounded-xl p-3 min-w-0 leading-tight transition-all duration-150"
              style={{
                flex: M ? '0 1 auto' : '0 0 220px',
                scrollSnapAlign: 'start',
                opacity: getOpacity(c.cat),
                background: 'var(--card)',
                border: '1px solid var(--line)',
                color: 'var(--t1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--line3)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--line)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div className="flex justify-between items-center gap-2">
                <span
                  className="text-[10px] font-medium text-t3 px-[7px] py-[3px] rounded"
                  style={{ background: 'var(--glass)', border: '1px solid var(--glass-line2)' }}
                >
                  {c.cat}
                </span>
                <span className="font-mono text-[9px] tracking-[0.08em]" style={{ color: c.tagColor }}>
                  {c.tag}
                </span>
              </div>
              <div className="flex flex-col gap-[2px] min-w-0">
                <span className="text-[13px] font-semibold text-t1 whitespace-nowrap overflow-hidden text-ellipsis">
                  {c.name}
                </span>
                <span className="font-mono text-[10px] text-t4 whitespace-nowrap overflow-hidden text-ellipsis">
                  {c.id} · {c.unit}
                </span>
              </div>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex flex-col gap-[2px] flex-none">
                  <span className="font-mono text-[15px] font-semibold text-t1">{c.price}</span>
                  <span className="font-mono text-[11px]" style={{ color: c.chgColor }}>
                    {c.chg}
                  </span>
                </div>
                <div className="flex-1 min-w-0 h-9" data-spark>
                  {c.series.length > 1 && <AreaSpark data={c.series} color={c.chgColor} />}
                </div>
              </div>
              <span
                className="self-start font-mono text-[9px] px-[6px] py-[2px] rounded"
                style={{
                  color: 'var(--amber-text)',
                  background: 'color-mix(in srgb, var(--amber) 8%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--amber) 20%, transparent)',
                }}
              >
                {c.settle}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
