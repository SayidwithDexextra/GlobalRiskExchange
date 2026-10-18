'use client';

import { useViewport } from '@/hooks/useViewport';
import { useLiveMarket } from '@/hooks/useLiveMarket';
import { AreaSpark } from '@/components/charts/AreaSpark';
import { walk, resetSeed } from '@/lib/prng';
import { Check } from 'lucide-react';

// Generate chart data
resetSeed(77);
const whoA = walk(100, 30, 0.01, 0.08);
const whoB = walk(80, 30, -0.005, 0.06);

const CARDS = [
  {
    num: '01 / BUSINESSES',
    title: 'Hedge real-world costs',
    body: 'Lock in your GPU rental, freight, or energy costs. Short a market and offset adverse moves before they hit your P&L.',
    link: { label: 'GPU-H100 →', href: 'https://dexetera.xyz/explore' },
  },
  {
    num: '02 / FUNDS & TRADERS',
    title: 'Trade real-world data',
    body: 'Take directional views on metrics that move markets. Go long power during a heat wave or short travel demand during a recession.',
    link: { label: 'POWER / GAS →', href: 'https://dexetera.xyz/explore' },
  },
  {
    num: '03 / DATA OWNERS',
    title: 'Monetize your metrics',
    body: 'Create a market on data you understand better than anyone. Earn a share of every trade fee for as long as the market exists.',
    link: { label: 'DRAM-DDR5 →', href: 'https://dexetera.xyz/new-market' },
  },
  {
    num: '04 / GLOBAL INVESTORS',
    title: 'Access from anywhere',
    body: 'No broker, no minimum balance, no geography restriction. Connect a wallet, deposit USDC, and start trading in minutes.',
    link: { label: 'PRICE-EGGS →', href: 'https://dexetera.xyz/token/PRICE-EGGS' },
  },
];

export function WhoCards() {
  const { w } = useViewport();
  const { ownerFees } = useLiveMarket();

  const c4 = w >= 900 ? 'repeat(4, minmax(0, 1fr))' : w >= 640 ? 'repeat(2, minmax(0, 1fr))' : '1fr';

  return (
    <div
      data-reveal
      data-screen-label="Who it's for"
      className="max-w-[1344px] mx-auto"
      style={{ padding: 'clamp(56px,7vw,88px) clamp(16px,3vw,32px) 0' }}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-t4">
          Who it's for
        </div>
        <h2
          className="m-0 font-semibold leading-[1.08] tracking-[-0.03em]"
          style={{ fontSize: 'clamp(30px,3.4vw,44px)', textWrap: 'balance' }}
        >
          Built for anyone with real exposure.
        </h2>
      </div>

      {/* Cards grid */}
      <div className="grid gap-3" style={{ gridTemplateColumns: c4 }}>
        {CARDS.map((card, i) => (
          <div
            key={i}
            className="rounded-xl p-5 flex flex-col gap-[14px] transition-all duration-200 hover:-translate-y-[1px]"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
            }}
          >
            {/* Visual */}
            <div
              className="h-[128px] rounded-lg p-[10px] flex flex-col"
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--hair)',
              }}
            >
              {i === 0 && (
                <>
                  <div className="flex gap-3 font-mono text-[9px] mb-2">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-px bg-red" />
                      <span className="text-red">UNHEDGED COST</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-px bg-t3" style={{ borderTop: '1px dashed' }} />
                      <span className="text-t3">HEDGED</span>
                    </span>
                  </div>
                  <div className="flex-1">
                    <AreaSpark data={whoA} color="var(--red)" />
                  </div>
                </>
              )}
              {i === 1 && (
                <>
                  <div className="flex gap-3 font-mono text-[9px] mb-2">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-px bg-green" />
                      <span className="text-green">POWER</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-px bg-t3" />
                      <span className="text-t3">GAS</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-1 bg-t4 opacity-40" />
                      <span className="text-t4">GAP</span>
                    </span>
                  </div>
                  <div className="flex-1 relative">
                    <AreaSpark data={whoA} color="var(--green)" />
                    <div className="absolute inset-0 opacity-30">
                      <AreaSpark data={whoB} color="var(--t3)" />
                    </div>
                  </div>
                </>
              )}
              {i === 2 && (
                <div className="flex flex-col h-full">
                  <div className="font-mono text-[9px] text-t4 mb-1">
                    CREATOR FEES · DRAM-DDR5
                  </div>
                  <div className="font-mono text-[26px] font-semibold text-green">
                    ${ownerFees.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="font-mono text-[10px] text-t4">PAID PER TRADE</span>
                    <span className="font-mono text-[10px] text-t4 flex items-center gap-1">
                      EXAMPLE
                    </span>
                  </div>
                </div>
              )}
              {i === 3 && (
                <div className="flex flex-col h-full font-mono text-[10px]">
                  <div className="text-t4 mb-2">WHAT YOU NEED</div>
                  <div className="flex flex-col gap-[6px]">
                    <div className="flex justify-between">
                      <span className="text-t2">Wallet</span>
                      <Check className="w-3 h-3 text-green" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-t2">Collateral</span>
                      <span className="text-t1">USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-t2">Gas</span>
                      <span className="text-t1">$0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-t2">Signatures per trade</span>
                      <span className="text-t1">1</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Number */}
            <div className="font-mono text-[10px] tracking-[0.1em] text-t4">
              {card.num}
            </div>

            {/* Title */}
            <div className="text-[16px] font-semibold tracking-[-0.01em]">
              {card.title}
            </div>

            {/* Body */}
            <p className="text-[13px] leading-[1.6] text-t3 flex-1">
              {card.body}
            </p>

            {/* Link */}
            <a
              href={card.link.href}
              className="font-mono text-[10px] text-t-soft px-2 py-1 rounded transition-colors self-start"
              style={{ border: '1px solid var(--line3)' }}
            >
              {card.link.label}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
