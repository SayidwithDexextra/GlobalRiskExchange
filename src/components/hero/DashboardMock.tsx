'use client';

import { forwardRef, useMemo, type ReactNode } from 'react';
import Image from 'next/image';
import { 
  PanelLeft, 
  Search, 
  LayoutDashboard, 
  Compass, 
  Star, 
  Activity, 
  ChevronDown,
  Bell 
} from 'lucide-react';
import { DASH_ASSETS, MY_MARKETS, POSITIONS, DASH_DATES } from '@/lib/data';
import { exampleBySymbol, formatExampleChange, formatExamplePrice } from '@/lib/exampleMarkets';
import { formatSignedUsd, formatUsd } from '@/lib/format';
import { rnd, resetSeed } from '@/lib/prng';

interface DashboardMockProps {
  width: number;
  showSidebar: boolean;
  eggPrice: number;
  myOpen: boolean;
  onToggleMy: () => void;
  pvSize: string;
  scrollPill?: ReactNode;
}

export const DashboardMock = forwardRef<HTMLDivElement, DashboardMockProps>(
  function DashboardMock({ width, showSidebar, eggPrice, myOpen, onToggleMy, pvSize, scrollPill }, ref) {
    
    // Generate dashboard bars (deterministic)
    const bars = useMemo(() => {
      resetSeed(11);
      // Consume earlier seeds to match the source order
      for (let i = 0; i < 44 * 4; i++) rnd(); // candles
      for (let i = 0; i < 6 * 40; i++) rnd(); // series
      for (let i = 0; i < 90; i++) rnd(); // featVol
      for (let i = 0; i < 10 * 24; i++) rnd(); // tbl
      for (let i = 0; i < 60; i++) rnd(); // gpuNoise
      for (let i = 0; i < 30; i++) rnd(); // bars
      for (let i = 0; i < 160; i++) rnd(); // tailNoise
      
      // Now generate dBars
      const dBars: { h: string; c: string }[] = [];
      let x = 0.5;
      for (let i = 0; i < 120; i++) {
        x = Math.max(0.18, Math.min(1, x * 0.7 + 0.15 + (rnd() - 0.5) * 0.5));
        const hi = (i >= 30 && i <= 46) || (i >= 82 && i <= 96);
        const h = Math.round((hi ? Math.min(1, x + 0.15) : x) * 100) + '%';
        dBars.push({ h, c: hi ? 'var(--t-soft)' : 'var(--line2)' });
      }
      return dBars;
    }, []);

    // At <= 768px, show every other bar (60 bars)
    const visibleBars = showSidebar ? bars : bars.filter((_, i) => i % 2 === 0);

    // Calculate portfolio value based on egg price
    const pv = 345398.34 + (eggPrice - 2.715) * 52000;
    const gain = 15840 + (eggPrice - 2.715) * 52000;
    const pvPct = '+' + (gain / (pv - gain) * 100).toFixed(1) + '%';
    const pvGain = formatSignedUsd(gain);
    const pvFormatted = formatUsd(pv);

    const eggs = exampleBySymbol('PRICE-EGGS');
    const eggChange = formatExampleChange(eggs.change);

    // Process assets with live egg price, starting from the shared list
    const heroAssets = DASH_ASSETS.map((a) => {
      if (a.sym === 'PRICE-EGGS') {
        return {
          ...a,
          p: formatExamplePrice(eggs, eggPrice),
          c: eggChange.text,
          col: eggChange.color,
        };
      }
      return a;
    });

    // Process my markets with live egg price
    const myMarkets = MY_MARKETS.map((m) => {
      if (m.sym === 'PRICE-EGGS') {
        return { ...m, p: formatExamplePrice(eggs, eggPrice) };
      }
      return m;
    });

    // Process positions with live egg price
    const posRows = POSITIONS.map(([m, side, entry, mark, qty]) => {
      const markVal = mark === 'live' ? eggPrice : mark;
      const pnl = (markVal - entry) * qty * (side === 'Long' ? 1 : -1);
      return {
        m,
        side,
        sc: side === 'Long' ? 'var(--green)' : 'var(--red)',
        e: formatUsd(entry),
        k: formatUsd(markVal),
        pnl: formatSignedUsd(pnl),
        pc: pnl >= 0 ? 'var(--green)' : 'var(--red)',
      };
    });

    return (
      <div
        ref={ref}
        className="relative z-[2] flex justify-center will-change-transform"
        style={{ marginTop: showSidebar ? '44px' : '36px' }}
      >
        {scrollPill}
        <div
          className="flex-none flex overflow-hidden rounded-2xl"
          style={{
            width: `${width}px`,
            background: 'var(--card)',
            border: '1px solid var(--line)',
            boxShadow: 'inset 0 1px 0 color-mix(in srgb, var(--t1) 6%, transparent), var(--dash-sh)',
          }}
        >
          {/* Sidebar */}
          {showSidebar && (
            <div
              className="w-[200px] flex-none flex flex-col gap-[14px]"
              style={{
                background: 'var(--card2)',
                borderRight: '1px solid var(--ln)',
                padding: '16px 12px',
              }}
            >
              {/* Logo row */}
              <div className="flex items-center justify-between px-1">
                <span className="flex items-center gap-2">
                  <Image
                    src="/assets/dexetera-logo.png"
                    alt=""
                    width={24}
                    height={24}
                    className="rounded-[5px] block flex-none"
                  />
                  <span className="text-[13px] font-semibold">Dexetera</span>
                </span>
                <PanelLeft className="w-[14px] h-[14px] text-t4" />
              </div>

              {/* Search */}
              <div
                className="h-8 px-[10px] flex items-center gap-2 rounded-lg"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                }}
              >
                <Search className="w-3 h-3 text-t4" />
                <span className="flex-1 text-[12px] text-t4">Search</span>
                <span className="font-mono text-[10px] text-line4">⌘K</span>
              </div>

              {/* Nav items */}
              <div className="flex flex-col gap-[2px] text-[12px] font-medium">
                <span
                  className="h-8 px-[10px] flex items-center gap-[10px] rounded-lg text-t1"
                  style={{ background: 'var(--ln)' }}
                >
                  <LayoutDashboard className="w-[14px] h-[14px]" />
                  Overview
                </span>
                <span className="h-8 px-[10px] flex items-center gap-[10px] rounded-lg text-t2">
                  <Compass className="w-[14px] h-[14px]" />
                  Explore
                </span>
                <span className="h-8 px-[10px] flex items-center gap-[10px] rounded-lg text-t2">
                  <Star className="w-[14px] h-[14px]" />
                  Watchlist
                </span>
                <span className="h-8 px-[10px] flex items-center gap-[10px] rounded-lg text-t2">
                  <Activity className="w-[14px] h-[14px]" />
                  Analytics
                </span>
              </div>

              {/* My markets */}
              <div
                className="flex flex-col gap-[2px] pt-3"
                style={{ borderTop: '1px solid var(--ln)' }}
              >
                <button
                  onClick={onToggleMy}
                  className="h-7 px-[10px] flex items-center justify-between bg-transparent border-0 cursor-pointer font-mono text-[10px] tracking-[0.1em] text-t4"
                >
                  MY MARKETS
                  <ChevronDown
                    className="w-3 h-3 text-t4 transition-transform duration-200"
                    style={{ transform: myOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                  />
                </button>
                {myOpen && myMarkets.map((mm) => (
                  <span
                    key={mm.sym}
                    className="h-[30px] px-[10px] flex items-center gap-2 font-mono text-[10px]"
                  >
                    <span
                      className="w-[6px] h-[6px] rounded-full"
                      style={{ background: mm.dot }}
                    />
                    <span className="flex-1 text-t-soft">{mm.sym}</span>
                    <span className="text-t4">{mm.p}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0 flex flex-col gap-5" style={{ padding: '16px 20px' }}>
            {/* Top row */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className="h-8 pl-1 pr-3 flex items-center gap-2 rounded-full"
                style={{
                  border: '1px solid var(--line)',
                  background: 'var(--card2)',
                }}
              >
                <span
                  className="w-6 h-6 rounded-full"
                  style={{
                    background: 'var(--line2)',
                    border: '1px solid var(--line3)',
                  }}
                />
                <span className="font-mono text-[11px] text-t1">0xdda4…12b4</span>
              </span>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-[6px] text-[11px] text-t2">
                  <span
                    className="w-[26px] h-[14px] rounded-full relative"
                    style={{ background: 'var(--t1)' }}
                  >
                    <span
                      className="absolute right-[2px] top-[2px] w-[10px] h-[10px] rounded-full"
                      style={{ background: 'var(--card)' }}
                    />
                  </span>
                  Example
                </span>
                {showSidebar && (
                  <span
                    className="h-7 px-[10px] flex items-center gap-[6px] rounded-full font-mono text-[10px] text-t2"
                    style={{ border: '1px solid var(--line)' }}
                  >
                    Oct 1 to Oct 16
                    <ChevronDown className="w-[10px] h-[10px]" />
                  </span>
                )}
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ border: '1px solid var(--line)' }}
                >
                  <Bell className="w-3 h-3 text-t4" />
                </span>
              </div>
            </div>

            {/* Portfolio value */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] tracking-[0.12em] text-t4">
                PORTFOLIO VALUE
              </span>
              <div className="flex flex-wrap items-center gap-[10px]">
                <span
                  className="font-mono font-medium tracking-[-0.03em] text-t1 leading-none"
                  style={{ fontSize: pvSize }}
                >
                  {pvFormatted}
                </span>
                <span
                  className="font-mono text-[11px] py-[3px] px-[7px] rounded-full"
                  style={{
                    color: 'var(--green)',
                    background: 'color-mix(in srgb, var(--emerald) 12%, transparent)',
                  }}
                >
                  {pvPct}
                </span>
                <span
                  className="font-mono text-[11px] py-[3px] px-[7px] rounded-full text-t2"
                  style={{ background: 'var(--ln)' }}
                >
                  {pvGain}
                </span>
              </div>
            </div>

            {/* Asset chips */}
            <div className="flex flex-wrap gap-2">
              {heroAssets.map((ha) => (
                <span
                  key={ha.sym}
                  className="h-[30px] px-3 flex items-center gap-2 rounded-full font-mono text-[11px]"
                  style={{
                    border: '1px solid var(--line)',
                    background: 'var(--card2)',
                  }}
                >
                  <span
                    className="w-[7px] h-[7px] rounded-full"
                    style={{ background: ha.dot }}
                  />
                  <span className="text-t1">{ha.sym}</span>
                  <span className="text-t2">{ha.p}</span>
                  <span style={{ color: ha.col }}>{ha.c}</span>
                </span>
              ))}
            </div>

            {/* Chart bars */}
            <div className="flex flex-col gap-2">
              <div className="h-[140px] flex items-end gap-[2px]">
                {visibleBars.map((bar, i) => (
                  <span
                    key={i}
                    className="flex-1 min-w-0 rounded-[1px]"
                    style={{ height: bar.h, background: bar.c }}
                  />
                ))}
              </div>
              <div className="flex justify-between font-mono text-[9px] text-t4">
                {DASH_DATES.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>

            {/* Positions header */}
            <div
              className="grid gap-2 pt-3 font-mono text-[10px] tracking-[0.08em] uppercase text-t4"
              style={{
                gridTemplateColumns: 'minmax(0,2fr) repeat(4,minmax(0,1fr))',
                borderTop: '1px solid var(--ln)',
              }}
            >
              <span>Market</span>
              <span>Side</span>
              <span>Entry</span>
              <span>Mark</span>
              <span className="text-right">P&L</span>
            </div>

            {/* Positions rows */}
            <div className="flex flex-col -mt-3">
              {posRows.map((pr) => (
                <div
                  key={pr.m}
                  className="grid gap-2 items-center h-[38px] font-mono text-[11px]"
                  style={{
                    gridTemplateColumns: 'minmax(0,2fr) repeat(4,minmax(0,1fr))',
                    borderTop: '1px solid var(--hair)',
                  }}
                >
                  <span className="text-t1">{pr.m}</span>
                  <span style={{ color: pr.sc }}>{pr.side}</span>
                  <span className="text-t2">{pr.e}</span>
                  <span className="text-t2">{pr.k}</span>
                  <span className="text-right" style={{ color: pr.pc }}>{pr.pnl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
