'use client';

import { useEffect, useRef, useState } from 'react';
import { useViewport } from '@/hooks/useViewport';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { GlassStatCards } from './GlassStatCards';
import { NetworkSvg } from './NetworkSvg';

export function RiskNetwork() {
  const { w } = useViewport();
  const reducedMotion = usePrefersReducedMotion();
  const [mode, setMode] = useState<'today' | 'dex'>('today');
  const [manual, setManual] = useState(false);
  const [netI, setNetI] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const netRef = useRef<HTMLDivElement>(null);

  const L = w >= 1100;
  const M = w >= 900;
  const hdrCols = M ? 'minmax(0,7fr) minmax(0,5fr)' : 'minmax(0,1fr)';
  const netH = w < 640 ? '420px' : w < 900 ? '320px' : '380px';
  const probCols = L ? 'minmax(0,62fr) minmax(0,38fr)' : 'minmax(0,1fr)';
  const probRows = L ? 'repeat(2,minmax(0,1fr))' : 'auto';
  const probStatCols = L
    ? 'repeat(2,minmax(0,1fr))'
    : M
      ? 'repeat(4,minmax(0,1fr))'
      : 'repeat(2,minmax(0,1fr))';

  const modeRef = useRef(mode);
  const manualRef = useRef(manual);
  modeRef.current = mode;
  manualRef.current = manual;

  useEffect(() => {
    if (manual || reducedMotion) return;
    const el = netRef.current;
    if (!el) return;
    let timer = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          timer = window.setTimeout(() => {
            if (!manualRef.current) setMode('dex');
          }, 2200);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [manual, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => {
      if (modeRef.current === 'dex') setNetI((i) => i + 1);
    }, 1600);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  const handleToggle = (next: 'today' | 'dex') => {
    setMode(next);
    setManual(true);
  };

  return (
    <div
      data-reveal
      data-screen-label="Problem"
      className="max-w-[1344px] mx-auto min-w-0 scroll-mt-[88px]"
      style={{ padding: 'clamp(28px,3.5vw,44px) clamp(16px,3vw,32px) 0' }}
    >
      <div
        className="grid items-end mb-5"
        style={{ gridTemplateColumns: hdrCols, gap: '20px 48px' }}
      >
        <div className="flex flex-col gap-2.5">
          <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-t4">
            How risk moves today
          </div>
          <h2
            className="m-0 font-semibold leading-[1.08] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(30px,3.4vw,44px)', textWrap: 'balance' }}
          >
            <span className="block text-t5">Risk runs through banks.</span>
            <span className="block text-t1">Most of it never gets a market.</span>
          </h2>
        </div>
        <p
          className="m-0 text-[17px] leading-[1.6] text-t3 max-w-[560px]"
          style={{ textWrap: 'pretty' }}
        >
          Deep markets exist for a handful of big things. For almost everything else, a hedge is a private deal on the bank&apos;s terms, or not possible at all. Dexetera replaces the bank&apos;s role with open software and public data.
        </p>
      </div>

      <div className="grid gap-3 min-w-0" style={{ gridTemplateColumns: probCols }}>
        <div
          ref={netRef}
          className="relative min-w-0 overflow-hidden rounded-[20px]"
          style={{
            height: netH,
            border: '1px solid var(--line)',
            background: 'var(--bg)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(color-mix(in srgb, var(--t1) 3.5%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--t1) 3.5%, transparent) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 30%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 30%, transparent 100%)',
            }}
          />
          <div
            className="absolute left-1/2 top-5 -translate-x-1/2 z-[2] flex p-[3px] gap-[2px] rounded-full"
            style={{ background: 'var(--card2)', border: '1px solid var(--line2)' }}
          >
            <button
              onClick={() => handleToggle('today')}
              className="h-[30px] px-4 border-0 rounded-full cursor-pointer font-mono text-[11px] tracking-[0.06em] transition-all duration-200"
              style={{
                background: mode === 'today' ? 'var(--line2)' : 'transparent',
                color: mode === 'today' ? 'var(--t1)' : 'var(--t3)',
              }}
            >
              Today
            </button>
            <button
              onClick={() => handleToggle('dex')}
              className="h-[30px] px-4 border-0 rounded-full cursor-pointer font-mono text-[11px] tracking-[0.06em] flex items-center gap-[6px] transition-all duration-200"
              style={{
                background: mode === 'dex' ? 'var(--line2)' : 'transparent',
                color: mode === 'dex' ? 'var(--t1)' : 'var(--t3)',
              }}
            >
              <span className="w-[6px] h-[6px] rounded-full bg-green" />
              On Dexetera
            </button>
          </div>
          <div className="absolute left-0 right-0 top-16 bottom-3">
            <NetworkSvg w={w} dex={mode === 'dex'} netI={netI} hover={hover} onHover={setHover} />
          </div>
        </div>

        <GlassStatCards columns={probStatCols} rows={probRows} />
      </div>
    </div>
  );
}
