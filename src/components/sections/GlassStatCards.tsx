'use client';

import { GLASS_STATS } from '@/lib/data';

export function GlassStatCards({
  columns,
  rows,
  limit,
}: {
  columns: string;
  rows: string;
  limit?: number;
}) {
  const stats = limit ? GLASS_STATS.slice(0, limit) : GLASS_STATS;
  return (
    <div
      className="grid gap-3 min-w-0"
      style={{
        gridTemplateColumns: columns,
        gridTemplateRows: rows,
        height: rows === 'auto' ? undefined : '100%',
      }}
    >
      {stats.map((ps, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-2xl p-[14px] flex flex-col gap-2 min-w-0 transition-all duration-200"
          style={{
            background: 'var(--glass)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--glass-line)',
            boxShadow: 'inset 0 1px 0 var(--glass-line2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--glass-line3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--glass-line)';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <span
            className="absolute pointer-events-none"
            style={{
              right: '-60px',
              top: '-60px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: ps.tint,
              filter: 'blur(24px)',
            }}
          />
          <span
            className="relative font-mono font-medium tracking-[-0.02em] text-t1"
            style={{ fontSize: 'clamp(18px,1.6vw,22px)', overflowWrap: 'anywhere' }}
          >
            {ps.v}
          </span>
          <span className="relative text-[13px] leading-[1.5] text-t3 flex-1">{ps.d}</span>
          <span
            className="relative flex items-center gap-[6px] font-mono text-[10px] tracking-[0.08em] text-green pt-2.5"
            style={{ borderTop: '1px solid var(--glass-line2)' }}
          >
            DEXETERA: {ps.x}
            <span>→</span>
          </span>
        </div>
      ))}
    </div>
  );
}
