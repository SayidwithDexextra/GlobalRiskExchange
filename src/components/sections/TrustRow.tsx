export function TrustRow() {
  return (
    <div
      className="max-w-[1344px] mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-t4"
      style={{ padding: '28px clamp(16px,3vw,32px)' }}
    >
      {/* Settled by */}
      <span className="flex items-center gap-[10px]">
        <span className="font-mono text-[10px] tracking-[0.1em] text-line4">
          SETTLED BY
        </span>
        <span className="text-[15px] font-bold tracking-[0.06em]">UMA</span>
        <span className="text-[12px] font-medium">Optimistic Oracle</span>
      </span>

      <span className="w-px h-4 bg-line" />

      {/* Collateral */}
      <span className="flex items-center gap-[10px]">
        <span className="font-mono text-[10px] tracking-[0.1em] text-line4">
          COLLATERAL
        </span>
        <span className="text-[15px] font-semibold tracking-[0.02em]">USDC</span>
      </span>

      <span className="w-px h-4 bg-line" />

      {/* Data from */}
      <span className="flex flex-wrap items-center gap-x-[22px] gap-y-[10px]">
        <span className="font-mono text-[10px] tracking-[0.1em] text-line4">
          DATA FROM
        </span>
        <span className="font-serif text-[15px] font-bold tracking-[0.04em]">
          FRED
        </span>
        <span className="text-[15px] font-bold tracking-[0.12em]">BLS</span>
        <span className="text-[15px] font-semibold tracking-[0.02em] italic">
          ERCOT
        </span>
        <span className="text-[15px] font-semibold tracking-[-0.01em]">
          Freightos
        </span>
        <span className="font-mono text-[13px] font-semibold">TrendForce</span>
      </span>
    </div>
  );
}
