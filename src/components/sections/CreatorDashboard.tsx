'use client';

import { useViewport } from '@/hooks/useViewport';
import { useLiveMarket } from '@/hooks/useLiveMarket';
import { formatUsdAmount } from '@/lib/format';
import { rnd, resetSeed } from '@/lib/prng';

// Generate volume bars
resetSeed(99);
const volumeBars = Array.from({ length: 30 }, () => 0.2 + rnd() * 0.8);

export function CreatorDashboard() {
  const { w } = useViewport();
  const { ownerFees } = useLiveMarket();
  
  const L = w >= 1100;
  const splitCols = L ? 'minmax(0, 5fr) minmax(0, 7fr)' : '1fr';

  return (
    <div
      data-reveal
      data-screen-label="Creators"
      className="max-w-[1344px] mx-auto"
      style={{ padding: 'clamp(56px,7vw,88px) clamp(16px,3vw,32px) 0' }}
    >
      <div
        className="rounded-xl overflow-hidden grid"
        style={{
          gridTemplateColumns: splitCols,
          background: 'var(--card)',
          border: '1px solid var(--line)',
        }}
      >
        {/* Left - copy */}
        <div
          className="flex flex-col justify-center gap-5"
          style={{ padding: 'clamp(24px,4vw,48px)' }}
        >
          <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-t4">
            Creators earn
          </div>
          <h2
            className="m-0 font-semibold leading-[1.08] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(28px,3vw,40px)', textWrap: 'balance' }}
          >
            <span className="text-t5 block">Build a market,</span>
            earn from every trade.
          </h2>
          <p className="text-[17px] leading-[1.6] text-t3 max-w-[480px]">
            Creators who list successful markets earn a share of trading fees. The better the market, the more it trades, the more you earn.
          </p>
          <a
            href="https://dexetera.xyz/new-market"
            className="inline-flex items-center h-10 px-5 rounded-full text-[13px] font-semibold self-start transition-colors"
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
            + Create a market
          </a>
        </div>

        {/* Right - dashboard mock */}
        <div
          style={{
            padding: 'clamp(16px,2.5vw,28px)',
            background: 'var(--bg)',
            borderLeft: L ? '1px solid var(--hair)' : 'none',
            borderTop: L ? 'none' : '1px solid var(--hair)',
          }}
        >
          <div
            className="rounded-xl p-[18px] flex flex-col gap-4"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-t4">
                  MY MARKETS / DRAM-DDR5
                </span>
                <div className="text-[15px] font-semibold mt-1">
                  DRAM DDR5 spot, $/Gb
                </div>
              </div>
              <div className="flex gap-2">
                <span
                  className="font-mono text-[9px] px-2 py-1 rounded"
                  style={{
                    color: 'var(--violet-soft)',
                    background: 'var(--violet-bg)',
                    border: '1px solid var(--violet-line)',
                  }}
                >
                  CREATED BY YOU
                </span>
                <span
                  className="font-mono text-[9px] px-2 py-1 rounded text-t4"
                  style={{ border: '1px solid var(--line)' }}
                >
                  EXAMPLE
                </span>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-3">
              <div
                className="rounded-md p-3"
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--hair)',
                }}
              >
                <div className="font-mono text-[10px] tracking-[0.08em] text-t4 font-medium mb-1">
                  30D VOLUME
                </div>
                <div className="font-mono text-[17px] font-semibold">$1.84M</div>
              </div>
              <div
                className="rounded-md p-3"
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--hair)',
                }}
              >
                <div className="font-mono text-[10px] tracking-[0.08em] text-t4 font-medium mb-1">
                  FEES EARNED
                </div>
                <div className="font-mono text-[17px] font-semibold text-green">
                  {formatUsdAmount(ownerFees)}
                </div>
              </div>
              <div
                className="rounded-md p-3"
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--hair)',
                }}
              >
                <div className="font-mono text-[10px] tracking-[0.08em] text-t4 font-medium mb-1">
                  TRADERS
                </div>
                <div className="font-mono text-[17px] font-semibold">318</div>
              </div>
            </div>

            {/* Volume chart */}
            <div>
              <div className="flex justify-between font-mono text-[9px] text-t4 mb-2">
                <span>DAILY VOLUME · 30D</span>
                <span>USDC</span>
              </div>
              <div
                className="h-[120px] flex items-end gap-[3px]"
                style={{ borderBottom: '1px solid var(--line)' }}
              >
                {volumeBars.map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-[2px]"
                    style={{
                      height: `${v * 100}%`,
                      background: i === volumeBars.length - 1 ? 'var(--t1)' : 'var(--line3)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex justify-between font-mono text-[11px] pt-3"
              style={{ borderTop: '1px solid var(--hair)' }}
            >
              <span className="text-t3">Creator fee share</span>
              <span className="text-t-soft">Paid per trade · see docs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
