'use client';

import { useViewport } from '@/hooks/useViewport';
import { STATS } from '@/lib/data';

export function StatStrip() {
  const { w } = useViewport();
  const M = w >= 900;

  return (
    <div
      className="bg-bg"
      style={{ borderBottom: '1px solid var(--hair)' }}
    >
      <div
        className="max-w-[1344px] mx-auto overflow-x-auto"
        style={{ padding: '0 clamp(16px,3vw,32px)' }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: M ? 'repeat(5,minmax(0,1fr))' : 'repeat(2,minmax(0,1fr))',
          }}
        >
          {STATS.map((st, i) => (
            <div
              key={st.label}
              className="flex flex-col gap-[6px]"
              style={{
                gridColumn: !M && i === 0 ? 'span 2' : 'auto',
                padding: '16px 20px',
                borderRight: '1px solid var(--hair)',
                borderBottom: M ? 'none' : '1px solid var(--hair)',
              }}
            >
              <span className="flex items-center gap-[6px] text-[10px] font-medium tracking-[0.08em] uppercase text-t-gray">
                <span className="w-[5px] h-[5px] rounded-full bg-green" />
                {st.label}
              </span>
              <span className="flex items-baseline gap-2">
                <span className="font-mono text-[20px] font-semibold text-t1">
                  {st.value}
                </span>
                <span className="font-mono text-[10px] text-t4">
                  {st.sub}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
