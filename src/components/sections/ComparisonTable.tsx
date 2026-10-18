'use client';

import { useViewport } from '@/hooks/useViewport';
import { Check, X, Minus } from 'lucide-react';

const ROWS = [
  {
    feature: 'Continuous pricing',
    dx: true,
    otc: false,
    prediction: true,
    insurance: false,
  },
  {
    feature: 'Any metric',
    dx: true,
    otc: false,
    prediction: true,
    insurance: false,
  },
  {
    feature: 'No counterparty risk',
    dx: true,
    otc: false,
    prediction: true,
    insurance: false,
  },
  {
    feature: 'Self-custody',
    dx: true,
    otc: false,
    prediction: true,
    insurance: false,
  },
  {
    feature: 'Scalar payoffs',
    dx: true,
    otc: true,
    prediction: false,
    insurance: false,
  },
  {
    feature: 'No minimum size',
    dx: true,
    otc: false,
    prediction: true,
    insurance: null,
  },
  {
    feature: 'Global access',
    dx: true,
    otc: false,
    prediction: true,
    insurance: null,
  },
  {
    feature: 'Transparent fees',
    dx: true,
    otc: false,
    prediction: true,
    insurance: false,
  },
];

function Cell({ value }: { value: boolean | null }) {
  if (value === true) {
    return <Check className="w-4 h-4 text-green mx-auto" />;
  }
  if (value === false) {
    return <X className="w-4 h-4 text-red mx-auto" />;
  }
  return <Minus className="w-4 h-4 text-t4 mx-auto" />;
}

export function ComparisonTable() {
  const { w } = useViewport();
  const L = w >= 1100;
  const splitCols = L ? 'minmax(0, 5fr) minmax(0, 7fr)' : '1fr';

  return (
    <div
      data-reveal
      data-screen-label="Why Dexetera"
      className="max-w-[1344px] mx-auto"
      style={{ padding: 'clamp(56px,7vw,88px) clamp(16px,3vw,32px) 0' }}
    >
      <div className="grid items-start" style={{ gridTemplateColumns: splitCols, gap: '40px 56px' }}>
        {/* Left column */}
        <div className={L ? 'sticky top-[96px]' : ''}>
          <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-t4 mb-4">
            Why Dexetera
          </div>
          <h2
            className="m-0 font-semibold leading-[1.08] tracking-[-0.03em] mb-4"
            style={{ fontSize: 'clamp(30px,3.4vw,44px)', textWrap: 'balance' }}
          >
            <span className="text-t5 block">Everything banks do,</span>
            without the bank.
          </h2>
          <p className="text-[17px] leading-[1.6] text-t3 mb-6 max-w-[420px]">
            Open markets, transparent pricing, programmable collateral, and trustless settlement replace private deals and relationship managers.
          </p>
          <a
            href="https://doc.dexetera.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center h-[40px] px-[18px] rounded-md text-[13px] font-medium transition-colors"
            style={{
              background: 'var(--card3)',
              border: '1px solid var(--line)',
            }}
          >
            Read the docs →
          </a>
        </div>

        {/* Table */}
        <div
          className="rounded-xl overflow-x-auto"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            minWidth: L ? 'auto' : '640px',
          }}
        >
          <table className="w-full text-[13px]" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr
                className={`font-mono text-[9px] tracking-[0.1em] text-t4 ${L ? 'sticky top-[57px] z-[5]' : ''}`}
                style={{ background: 'var(--card)' }}
              >
                <th className="text-left p-[14px_16px] border-b border-line" style={{ borderTopLeftRadius: '12px' }}>
                  FEATURE
                </th>
                <th
                  className="text-center p-[14px_16px] border-b font-semibold text-t1"
                  style={{ background: 'var(--card2)', borderTop: '1px solid var(--t1)' }}
                >
                  DEXETERA
                </th>
                <th className="text-center p-[14px_16px] border-b border-line">OTC / BANK</th>
                <th className="text-center p-[14px_16px] border-b border-line">PREDICTION</th>
                <th className="text-center p-[14px_16px] border-b border-line" style={{ borderTopRightRadius: '12px' }}>
                  INSURANCE
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--hair)' }}>
                  <td className="p-[14px_16px] text-t3">{row.feature}</td>
                  <td className="p-[14px_16px] font-semibold" style={{ background: 'var(--card2)' }}>
                    <Cell value={row.dx} />
                  </td>
                  <td className="p-[14px_16px] text-t3">
                    <Cell value={row.otc} />
                  </td>
                  <td className="p-[14px_16px] text-t3">
                    <Cell value={row.prediction} />
                  </td>
                  <td className="p-[14px_16px] text-t3">
                    <Cell value={row.insurance} />
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
