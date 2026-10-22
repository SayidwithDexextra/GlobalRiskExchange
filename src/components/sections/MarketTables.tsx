'use client';

import { useViewport } from '@/hooks/useViewport';
import { AreaSpark } from '@/components/charts/AreaSpark';
import { walk, resetSeed } from '@/lib/prng';
import { exampleBySymbol } from '@/lib/exampleMarkets';

function listed(symbol: string) {
  const market = exampleBySymbol(symbol);
  return { name: market.name, sym: market.symbol };
}

// Generate spark data for tables
resetSeed(123);
const priceExamples = [
  { ...listed('PRICE-EGGS'), long: '24K', short: '18K', spark: walk(2.5, 20, 0.005, 0.04) },
  { ...listed('PRICE-MILK-US'), long: '12K', short: '9K', spark: walk(3.8, 20, -0.003, 0.03) },
  { ...listed('CRUDE-OIL'), long: '156K', short: '142K', spark: walk(78, 20, 0.002, 0.025) },
  { ...listed('GOLD'), long: '89K', short: '76K', spark: walk(2040, 20, 0.004, 0.02) },
];

const otherExamples = [
  { ...listed('GPU-H100'), long: '412K', short: '380K', spark: walk(2.0, 20, 0.008, 0.05) },
  { ...listed('ERCOT-N'), long: '67K', short: '54K', spark: walk(38, 20, -0.004, 0.06) },
  { ...listed('NINO34-DEC26'), long: '34K', short: '28K', spark: walk(3000, 20, 0.002, 0.03) },
  { ...listed('US-CPI-YOY'), long: '45K', short: '52K', spark: walk(2.9, 20, -0.003, 0.025) },
];

function MarketTable({
  title,
  count,
  subtitle,
  markets,
  compact = false,
}: {
  title: string;
  count: number;
  subtitle: string;
  markets: typeof priceExamples;
  compact?: boolean;
}) {
  // Phones show the first two rows only, to keep the page short.
  const rows = compact ? markets.slice(0, 2) : markets;
  return (
    <div
      className="min-w-0 rounded-xl overflow-hidden"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
      }}
    >
      {/* Header */}
      <div
        className="flex justify-between items-center px-5 py-4"
        style={{ borderBottom: '1px solid var(--hair)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-semibold">{title}</span>
          <span
            className="font-mono text-[10px] text-t3 px-[6px] py-[2px] rounded"
            style={{ background: 'var(--card3)' }}
          >
            {count}
          </span>
        </div>
        <span className="text-[12px] text-t4">{subtitle}</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: 580 }}>
        <table className="w-full">
          <thead>
            <tr className="font-mono text-[9px] tracking-[0.1em] text-t4">
              <th className="text-left py-[10px] px-5" style={{ borderBottom: '1px solid var(--hair)' }}>
                MARKET
              </th>
              <th className="text-left py-[10px] px-5" style={{ borderBottom: '1px solid var(--hair)' }}>
                LONG
              </th>
              <th className="text-left py-[10px] px-5" style={{ borderBottom: '1px solid var(--hair)' }}>
                SHORT
              </th>
              <th className="text-left py-[10px] px-5 w-16" style={{ borderBottom: '1px solid var(--hair)' }}>
                7D
              </th>
              <th className="w-11 py-[10px] px-5" style={{ borderBottom: '1px solid var(--hair)' }} />
            </tr>
          </thead>
          <tbody>
            {rows.map((m, i) => (
              <tr
                key={i}
                className="hover:bg-card2 transition-colors cursor-pointer"
                style={{ borderBottom: '1px solid var(--hair)' }}
              >
                <td className="py-2 px-5 min-h-[58px]">
                  <div className="text-[13px] font-semibold">{m.name}</div>
                  <div className="font-mono text-[10px] text-t3">{m.sym}</div>
                </td>
                <td className="py-2 px-5 text-[12px] text-t3">{m.long}</td>
                <td className="py-2 px-5 text-[12px] text-t3">{m.short}</td>
                <td className="py-2 px-5 w-16">
                  <div className="h-[22px]">
                    <AreaSpark data={m.spark} color="auto" strokeWidth={1} />
                  </div>
                </td>
                <td className="py-2 px-5 text-right">
                  <span className="text-[12px] font-semibold text-violet-soft2">View</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

export function MarketTables() {
  const { w } = useViewport();
  const L = w >= 1100;
  const compact = w < 640;
  const tableCols = L ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)';

  return (
    <div
      data-reveal
      data-screen-label="Market types"
      className="max-w-[1344px] mx-auto"
      style={{ padding: 'clamp(56px,7vw,88px) clamp(16px,3vw,32px) 0' }}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-t4">
          Market types
        </div>
        <h2
          className="m-0 font-semibold leading-[1.08] tracking-[-0.03em]"
          style={{ fontSize: 'clamp(30px,3.4vw,44px)', textWrap: 'balance' }}
        >
          The kinds of numbers a market can track.
        </h2>
      </div>

      {/* Tables grid */}
      <div className="grid gap-3" style={{ gridTemplateColumns: tableCols }}>
        <MarketTable
          title="Spot prices"
          count={4}
          subtitle="Example"
          markets={priceExamples}
          compact={compact}
        />
        <MarketTable
          title="Other metrics"
          count={4}
          subtitle="Example"
          markets={otherExamples}
          compact={compact}
        />
      </div>
      {compact && (
        <a
          href="https://dexetera.xyz/explore"
          target="_blank"
          rel="noopener noreferrer"
          data-cta="see_all_markets"
          className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium text-t2 hover:text-t1"
        >
          See all markets <span aria-hidden>→</span>
        </a>
      )}
    </div>
  );
}
