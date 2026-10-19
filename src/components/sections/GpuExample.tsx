'use client';

import { useMemo, useState } from 'react';
import { AreaChart } from '@/components/charts/AreaSpark';
import { formatSignedUsd, formatUsd } from '@/lib/format';

const ENTRY = 2;

function money(v: number): string {
  const cents = Math.round(v * 100) / 100;
  if (cents === 0) return formatUsd(0);
  return formatSignedUsd(cents);
}

function valColor(v: number): string {
  if (Math.abs(v) < 0.5) return 'var(--t2)';
  return v > 0 ? 'var(--green)' : 'var(--red)';
}

function barGeom(v: number) {
  const p = Math.min(50, (Math.abs(v) / 1000) * 50);
  return {
    left: (v >= 0 ? 50 : 50 - p) + '%',
    width: p + '%',
    barColor: v >= 0 ? 'var(--green)' : 'var(--red)',
  };
}

function gpuPath(gpu: number): number[] {
  return Array.from({ length: 90 }, (_, i) => {
    const t = i / 89;
    const nz = 0.12 * Math.sin(t * 9 + 0.5) + 0.07 * Math.sin(t * 21 + 2) + 0.04 * Math.sin(t * 37);
    return ENTRY + (gpu - ENTRY) * (t * t * (3 - 2 * t)) + nz * Math.sin(Math.PI * t);
  });
}

interface LedgerRow {
  label: string;
  val: string;
  color: string;
  left: string;
  width: string;
  barColor: string;
}

interface LedgerSpec {
  name: string;
  role: string;
  side: string;
  sideColor: string;
  sideBg: string;
  sideLine: string;
  rows: LedgerRow[];
}

function Ledger({ ledger }: { ledger: LedgerSpec }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex min-w-0 items-center justify-between gap-2">
        <div className="min-w-0">
          <span className="text-[15px] font-semibold">{ledger.name}</span>
          <span className="ml-1.5 text-[12px] text-t3">{ledger.role}</span>
        </div>
        <span
          className="shrink-0 rounded-lg px-[9px] py-1 font-mono text-[10px] font-semibold"
          style={{
            color: ledger.sideColor,
            background: ledger.sideBg,
            border: `1px solid ${ledger.sideLine}`,
          }}
        >
          {ledger.side}
        </span>
      </div>
      {ledger.rows.map((rw) => (
        <div key={rw.label} className="flex flex-col gap-1">
          <div className="flex justify-between gap-2 font-mono text-[11px]">
            <span className="text-t3">{rw.label}</span>
            <span style={{ color: rw.color }}>{rw.val}</span>
          </div>
          <div
            className="relative h-[6px] overflow-hidden rounded-[3px]"
            style={{ background: 'var(--card2)' }}
          >
            <span
              className="absolute top-[-2px] bottom-[-2px] left-1/2 w-px"
              style={{ background: 'var(--line4)' }}
            />
            <span
              className="absolute top-0 bottom-0 rounded-[3px]"
              style={{
                left: rw.left,
                width: rw.width,
                background: rw.barColor,
                transition: 'left .15s, width .15s',
              }}
            />
          </div>
        </div>
      ))}
      <div
        className="flex justify-between pt-1.5 font-mono text-[12px]"
        style={{ borderTop: '1px solid var(--hair)' }}
      >
        <span>NET</span>
        <span className="font-semibold">{formatUsd(0)}</span>
      </div>
    </div>
  );
}

function FeesNote({ fees }: { fees: number }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <span className="min-w-0 flex-1 basis-0 font-mono text-[10px] leading-[1.45] tracking-[0.1em] text-t4">
          TRADING FEES GENERATED · CREATOR SHARES IN EVERY TRADE
        </span>
        <span className="shrink-0 font-mono text-[16px] font-semibold">{formatUsd(fees)}</span>
      </div>
      <p className="m-0 text-[13px] leading-[1.5]" style={{ color: 'var(--t3)' }}>
        Neither side is gambling. Both lock in a more predictable quarter, and the market&apos;s creator earns a fee on every trade.
      </p>
    </div>
  );
}

export function GpuExample() {
  const [{ gpu, fees }, setQuote] = useState({ gpu: ENTRY, fees: 0 });

  const series = useMemo(() => gpuPath(gpu), [gpu]);
  const d = (gpu - ENTRY) * 1000;
  const gcol = gpu >= ENTRY ? 'var(--green)' : 'var(--red)';
  const moveLabel =
    Math.abs(d) < 1
      ? 'AT ENTRY'
      : formatSignedUsd(gpu - ENTRY) + ' FROM ENTRY';
  const chgColor = Math.abs(d) < 1 ? 'var(--t2)' : gcol;

  const row = (label: string, v: number): LedgerRow => ({
    label,
    val: money(v),
    color: valColor(v),
    ...barGeom(v),
  });

  const ledgers: LedgerSpec[] = [
    {
      name: 'InferCo',
      role: 'Buys GPU compute',
      side: '↗ LONG',
      sideColor: 'var(--green)',
      sideBg: 'color-mix(in srgb, var(--emerald) 12%, transparent)',
      sideLine: 'color-mix(in srgb, var(--emerald) 22%, transparent)',
      rows: [row('Compute cost change', -d), row('Hedge P&L', d)],
    },
    {
      name: 'RigCloud',
      role: 'Sells GPU compute',
      side: '↘ SHORT',
      sideColor: 'var(--red)',
      sideBg: 'color-mix(in srgb, var(--red) 10%, transparent)',
      sideLine: 'color-mix(in srgb, var(--red) 22%, transparent)',
      rows: [row('Compute revenue change', d), row('Hedge P&L', -d)],
    },
  ];

  const onGpu = (raw: string) => {
    const v = parseFloat(raw);
    if (Number.isNaN(v)) return;
    setQuote((st) => ({
      gpu: v,
      fees: st.fees + (v !== st.gpu ? 2 * 1000 * v * 0.001 : 0),
    }));
  };

  const pricePane = (
    <div className="dx-ex-price flex min-w-0 flex-col gap-2.5">
      <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-2">
        <span className="font-mono text-[10px] tracking-[0.1em] text-t4">
          GPU-H100/USDC · MARK · 90 DAYS
        </span>
        <span className="flex items-baseline gap-2.5">
          <span className="font-mono text-[28px] font-semibold leading-none">
            {formatUsd(gpu)}/hr
          </span>
          <span className="font-mono text-[11px]" style={{ color: chgColor }}>
            {moveLabel}
          </span>
        </span>
      </div>

      <div className="dx-ex-chart relative min-w-0">
        <div className="absolute top-0 right-[44px] bottom-0 left-0">
          <AreaChart data={series} color={gcol} min={0.8} max={3.2} refPrice={ENTRY} grid />
        </div>
        <div
          className="absolute top-0 right-0 bottom-0 w-[44px] font-mono text-[9px] text-t4"
          style={{ borderLeft: '1px solid var(--hair)' }}
        >
          <span className="absolute left-2" style={{ top: '12.5%', transform: 'translateY(-50%)' }}>
            $3.00
          </span>
          <span
            className="absolute left-2 text-t2"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
            $2.00
          </span>
          <span className="absolute left-2" style={{ top: '87.5%', transform: 'translateY(-50%)' }}>
            $1.00
          </span>
        </div>
      </div>

      <div className="mt-auto flex min-w-0 flex-col gap-2">
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={gpu}
          onChange={(e) => onGpu(e.target.value)}
          aria-label="GPU price per hour"
          className="block w-full max-w-full min-w-0 cursor-pointer"
          style={{ accentColor: 'var(--t1)' }}
        />
        <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 font-mono text-[10px] text-t4">
          <span>$1.00</span>
          <span className="text-center">DRAG · ENTRY $2.00 · 1,000 HRS HEDGED</span>
          <span className="text-right">$3.00</span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      data-reveal
      data-screen-label="Example"
      className="mx-auto max-w-[1344px] min-w-0"
      style={{
        padding: 'clamp(28px,3.5vw,44px) clamp(16px,3vw,32px) 0',
        overflowX: 'clip',
      }}
    >
      <style>{`
        .dx-ex-price { padding: 14px; }
        .dx-ex-chart { height: 160px; }
        .dx-ex-card { display: flex; flex-direction: column; }
        .dx-ex-side { display: contents; }
        .dx-ex-ledgers { display: grid; grid-template-columns: minmax(0, 1fr); border-top: 1px solid var(--hair); }
        .dx-ex-ledger { min-width: 0; padding: 14px; }
        .dx-ex-ledger + .dx-ex-ledger { border-top: 1px solid var(--hair); }
        .dx-ex-fees { min-width: 0; border-top: 1px solid var(--hair); padding: 14px; }
        .dx-ex-head { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; align-items: end; }
        @media (min-width: 900px) {
          .dx-ex-price { padding: 14px 16px 12px; }
          .dx-ex-chart { height: 180px; }
          .dx-ex-ledgers { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .dx-ex-ledger { padding: 14px 16px; }
          .dx-ex-ledger + .dx-ex-ledger { border-top: 0; border-left: 1px solid var(--hair); }
          .dx-ex-fees { padding: 14px 16px; }
          .dx-ex-head { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); column-gap: 48px; }
        }
        @media (min-width: 1100px) {
          .dx-ex-chart { height: 200px; }
          .dx-ex-card { display: grid; grid-template-columns: minmax(0, 58fr) minmax(0, 42fr); }
          .dx-ex-side {
            display: flex;
            flex-direction: column;
            gap: 10px;
            min-width: 0;
            border-left: 1px solid var(--hair);
            padding: 14px 16px;
          }
          .dx-ex-ledgers { display: flex; flex-direction: column; gap: 10px; border-top: 0; }
          .dx-ex-ledger, .dx-ex-ledger + .dx-ex-ledger { border: 0; padding: 0; }
          .dx-ex-fees { margin-top: auto; border-top: 1px solid var(--hair); padding: 10px 0 0; }
        }
      `}</style>
      <div className="dx-ex-head mb-5 min-w-0">
        <div className="flex min-w-0 flex-col gap-2.5">
          <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-t4">
            An example / GPU-H100
          </div>
          <h2
            className="m-0 font-semibold leading-[1.08] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(30px,3.4vw,44px)', textWrap: 'balance' }}
          >
            One market, two businesses, both protected.
          </h2>
        </div>
        <p className="m-0 max-w-[560px] text-[17px] leading-[1.6] text-t3" style={{ textWrap: 'pretty' }}>
          Say GPU compute is $2.00/hr. InferCo buys compute, so it goes long. RigCloud sells compute, so it goes short. Drag the price and watch each hedge cancel the other side&apos;s exposure.
        </p>
      </div>

      <div
        className="dx-ex-card min-w-0 overflow-hidden rounded-xl"
        style={{ background: 'var(--card)', border: '1px solid var(--line)' }}
      >
        {pricePane}
        <div className="dx-ex-side">
          <div className="dx-ex-ledgers">
            {ledgers.map((ledger) => (
              <div key={ledger.name} className="dx-ex-ledger">
                <Ledger ledger={ledger} />
              </div>
            ))}
          </div>
          <div className="dx-ex-fees">
            <FeesNote fees={fees} />
          </div>
        </div>
      </div>
    </div>
  );
}
