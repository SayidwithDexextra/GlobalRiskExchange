'use client';

import { TICKER } from '@/lib/data';

// Background ticker (not pausable, not interactive)
function BgTicker({ durationSec, reverse }: { durationSec: number; reverse?: boolean }) {
  const items = reverse ? [...TICKER].reverse() : TICKER;
  const doubled = [...items, ...items];

  return (
    <div
      className="flex items-center h-[46px] font-mono text-[11px] opacity-60"
      style={{
        width: 'max-content',
        animation: `${reverse ? 'dx-ticker-r' : 'dx-ticker'} ${durationSec}s linear infinite`,
      }}
    >
      {doubled.map(([symbol, price, change], i) => (
        <span
          key={`${symbol}-${i}`}
          className="inline-flex items-center gap-2 px-[22px] whitespace-nowrap"
          style={{ borderRight: '1px solid var(--hair)' }}
        >
          <span className="text-t3">{symbol}</span>
          <span className="text-line4">•</span>
          <span className="text-t1">{price}</span>
          <span
            style={{
              color: change > 0 ? 'var(--green)' : change < 0 ? 'var(--red)' : 'var(--t2)',
            }}
          >
            {change > 0 ? '+' : ''}{change.toFixed(2)}%
          </span>
        </span>
      ))}
    </div>
  );
}

export function FinalCta() {
  return (
    <section
      data-screen-label="Final CTA"
      className="relative overflow-hidden"
      style={{
        marginTop: 'clamp(56px,7vw,88px)',
        borderTop: '1px solid var(--hair)',
        borderBottom: '1px solid var(--hair)',
        background: 'var(--bg)',
      }}
    >
      {/* Background tickers */}
      <div
        className="absolute inset-0 flex flex-col justify-center gap-[10px] pointer-events-none"
        style={{
          opacity: 0.22,
          maskImage: 'radial-gradient(ellipse 70% 90% at 50% 50%, transparent 20%, #000 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 90% at 50% 50%, transparent 20%, #000 75%)',
        }}
      >
        <BgTicker durationSec={80} />
        <BgTicker durationSec={95} reverse />
        <BgTicker durationSec={70} />
        <BgTicker durationSec={80} />
        <BgTicker durationSec={95} reverse />
      </div>

      {/* Content */}
      <div
        className="relative max-w-[1344px] mx-auto flex flex-col items-center gap-6 text-center"
        style={{ padding: 'clamp(80px,10vw,128px) clamp(16px,3vw,32px)' }}
      >
        <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-t4">
          DEXETERA / ANY MEASURABLE NUMBER
        </div>
        
        <h2
          className="m-0 font-semibold leading-[1.0] tracking-[-0.04em]"
          style={{ fontSize: 'clamp(40px,5.6vw,72px)', textWrap: 'balance' }}
        >
          <span className="block text-t5">Hedge the</span>
          <span className="block text-t1">unhedgeable.</span>
        </h2>
        
        <p className="m-0 text-[17px] leading-[1.6] text-t3 max-w-[520px]">
          Create a futures market on any number you can measure, trade it long or short in USDC, and let public data settle it.
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          <a
            href="https://dexetera.xyz"
            className="h-11 px-[22px] flex items-center rounded-[6px] text-[14px] font-semibold transition-colors"
            style={{
              background: 'var(--btn-p-bg)',
              color: 'var(--btn-p-fg)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--btn-p-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--btn-p-bg)';
            }}
          >
            Launch app →
          </a>
          <a
            href="https://dexetera.xyz/new-market"
            className="h-11 px-[22px] flex items-center rounded-[6px] text-[14px] font-medium transition-colors"
            style={{
              background: 'var(--card3)',
              border: '1px solid var(--line)',
              color: 'var(--t1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--line4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--line)';
            }}
          >
            Create a market
          </a>
        </div>
      </div>
    </section>
  );
}
