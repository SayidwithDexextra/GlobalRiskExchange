'use client';

import { useState, useEffect, useRef } from 'react';
import { useViewport } from '@/hooks/useViewport';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { AreaSpark } from '@/components/charts/AreaSpark';
import { walk, rnd, resetSeed } from '@/lib/prng';
import { swipeRowStyle, swipeItemStyle, swipeIndex } from '@/lib/swipeRow';

const STEPS = [
  {
    num: '01',
    title: 'List',
    body: 'Describe a number in plain language. The AI wizard builds the market and suggests public sources.',
  },
  {
    num: '02',
    title: 'Trade',
    body: 'Go long or short with USDC on an order book, with the metric plotted on a TradingView chart.',
  },
  {
    num: '03',
    title: 'Price & margin',
    body: 'Bids and asks drive valuation, P&L and margin. Exit any time before settlement.',
  },
  {
    num: '04',
    title: 'Settle',
    body: 'AI captures the final value and archives the source. Anyone can challenge. Disputes escalate to UMA.',
  },
];

export function Stepper() {
  const { w } = useViewport();
  const reducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const stepClickRef = useRef(0);
  
  // Initialize stepClickRef on mount
  useEffect(() => {
    stepClickRef.current = Date.now();
  }, []);

  const M = w >= 900;
  const S = w >= 640;
  const swipe = w < 640;
  const hdrCols = M ? 'minmax(0,7fr) minmax(0,5fr)' : 'minmax(0,1fr)';
  const c4 = S ? 'repeat(4,minmax(0,1fr))' : w >= 480 ? 'repeat(2,minmax(0,1fr))' : '1fr';

  // Step spark data
  const stepSpark = walk(2.14, 30, 0.003, 0.04);

  // Auto-advance steps
  useEffect(() => {
    if (reducedMotion) return;

    const interval = setInterval(() => {
      if (Date.now() - stepClickRef.current > 8000) {
        setStep((s) => (s + 1) % 4);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  const handleStepClick = (i: number) => {
    setStep(i);
    stepClickRef.current = Date.now();
  };

  return (
    <div
      id="how"
      data-reveal
      data-screen-label="How it works"
      className="max-w-[1344px] mx-auto scroll-mt-[88px]"
      style={{ padding: 'clamp(56px,7vw,88px) clamp(16px,3vw,32px) 0' }}
    >
      {/* Header */}
      <div
        className="grid items-end gap-5 mb-10"
        style={{ gridTemplateColumns: hdrCols, gap: '20px 48px' }}
      >
        <div className="flex flex-col gap-4">
          <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-t4">
            How it works
          </div>
          <h2
            className="m-0 font-semibold leading-[1.08] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(30px,3.4vw,44px)', textWrap: 'balance' }}
          >
            From an exposure to a market in four steps.
          </h2>
        </div>
        <p
          className="m-0 text-[17px] leading-[1.6] text-t3 max-w-[560px]"
          style={{ textWrap: 'pretty' }}
        >
          Dexetera splits what a bank does into open parts: creating the market, pricing it, guaranteeing it and settling it. Each step runs on software and public data.
        </p>
      </div>

      {/* Steps grid */}
      <div
        className={swipe ? 'dx-swipe' : 'grid'}
        style={swipe ? swipeRowStyle() : { gridTemplateColumns: c4, gap: '24px 12px' }}
        onScroll={
          swipe
            ? (e) => {
                const i = swipeIndex(e.currentTarget);
                if (i !== step) {
                  stepClickRef.current = Date.now();
                  setStep(Math.min(3, i));
                }
              }
            : undefined
        }
      >
        {STEPS.map((s, i) => {
          const isActive = step === i;
          const isPast = i < step;

          return (
            <div
              key={i}
              onClick={() => handleStepClick(i)}
              className="flex flex-col gap-[14px] cursor-pointer min-w-0"
              style={swipe ? swipeItemStyle : undefined}
            >
              {/* Rail */}
              <div
                className="flex items-center gap-[10px]"
                style={{ marginRight: i < 3 ? '-12px' : 0 }}
              >
                <span
                  className="flex-none font-mono text-[11px] font-semibold rounded px-[7px] py-[3px] transition-all duration-300"
                  style={{
                    background: isActive ? 'var(--t1)' : 'var(--card)',
                    color: isActive ? 'var(--bg)' : 'var(--t3)',
                    border: `1px solid ${isPast || isActive ? 'var(--t1)' : 'var(--line3)'}`,
                  }}
                >
                  {s.num}
                </span>
                {i < 3 && (
                  <span
                    className="flex-1 h-px transition-colors duration-400"
                    style={{
                      background: isPast ? 'var(--step-line)' : 'var(--line)',
                    }}
                  />
                )}
              </div>

              {/* Card */}
              <div
                className="flex-1 rounded-xl p-[18px] flex flex-col gap-[14px] transition-all duration-300"
                style={{
                  background: isActive ? 'var(--card2)' : 'var(--card)',
                  border: `1px solid ${isActive ? 'var(--line4)' : 'var(--hair)'}`,
                }}
              >
                <div className="flex flex-col gap-[6px]">
                  <span
                    className="text-[16px] font-semibold transition-colors"
                    style={{ color: isActive ? 'var(--t1)' : 'var(--t2)' }}
                  >
                    {s.title}
                  </span>
                  <span className="text-[13px] leading-[1.6] text-t3">
                    {s.body}
                  </span>
                </div>

                {/* Vignettes */}
                <div
                  className="mt-auto rounded-[10px] p-3 flex flex-col gap-2"
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--hair)',
                  }}
                >
                  {i === 0 && (
                    <>
                      <div className="text-[13px] text-t-soft flex items-center">
                        GPU H100 rental $/hr
                        <span
                          className="inline-block w-px h-[14px] bg-t3 ml-[2px]"
                          style={{ animation: 'dx-blink 1s steps(1) infinite' }}
                        />
                      </div>
                      <span className="font-mono text-[9px] tracking-[0.1em] text-t4">
                        SUGGESTED SOURCES
                      </span>
                      <div className="flex flex-wrap gap-[6px]">
                        <span
                          className="text-[11px] text-t2 px-[9px] py-[3px] rounded-full"
                          style={{ border: '1px solid var(--line3)' }}
                        >
                          GPU rental index · daily
                        </span>
                        <span
                          className="text-[11px] text-t2 px-[9px] py-[3px] rounded-full"
                          style={{ border: '1px solid var(--line3)' }}
                        >
                          Cloud list prices
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <span
                          className="h-[26px] px-[10px] flex items-center rounded-lg text-[11px] text-t-soft"
                          style={{ background: 'var(--line2)' }}
                        >
                          ✦ Create
                        </span>
                      </div>
                    </>
                  )}

                  {i === 1 && (
                    <>
                      <div className="grid grid-cols-2 gap-1">
                        <span
                          className="h-[26px] rounded-lg flex items-center justify-center text-[11px] font-semibold"
                          style={{
                            color: 'var(--green)',
                            background: 'color-mix(in srgb, var(--emerald) 12%, transparent)',
                            border: '1px solid color-mix(in srgb, var(--green) 60%, transparent)',
                          }}
                        >
                          ↗ Long
                        </span>
                        <span
                          className="h-[26px] rounded-lg flex items-center justify-center text-[11px] font-semibold text-t3"
                          style={{ border: '1px solid var(--line)' }}
                        >
                          ↘ Short
                        </span>
                      </div>
                      <div
                        className="h-[30px] px-[10px] flex items-center justify-between rounded-lg font-mono text-[11px]"
                        style={{
                          background: 'var(--card3)',
                          border: '1px solid var(--line2)',
                        }}
                      >
                        <span className="text-t3">Size</span>
                        <span>
                          $1,000 <span className="text-t4">· 5x</span>
                        </span>
                      </div>
                      <span
                        className="h-[30px] rounded-lg flex items-center justify-center text-[12px] font-semibold"
                        style={{ background: 'var(--green)', color: 'var(--bg)' }}
                      >
                        Long GPU-H100
                      </span>
                    </>
                  )}

                  {i === 2 && (
                    <>
                      <div className="h-[34px] mb-1">
                        <AreaSpark data={stepSpark} color="var(--green)" />
                      </div>
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-t4">ENTRY · MARK</span>
                        <span>$2.00 · $2.14</span>
                      </div>
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-t4">UNREALIZED P&L</span>
                        <span className="text-green font-semibold">+$350.00</span>
                      </div>
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-t4">MARGIN USED</span>
                        <span>$1,000.00</span>
                      </div>
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-t4">LIQ. PRICE</span>
                        <span>$1.62</span>
                      </div>
                    </>
                  )}

                  {i === 3 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] tracking-[0.1em] text-t4">
                          FINAL VALUE
                        </span>
                        <span
                          className="font-mono text-[9px] px-[6px] py-[1px] rounded"
                          style={{
                            color: 'var(--violet-soft)',
                            background: 'color-mix(in srgb, var(--violet) 15%, transparent)',
                            border: '1px solid color-mix(in srgb, var(--violet) 30%, transparent)',
                          }}
                        >
                          UMA OO
                        </span>
                      </div>
                      <span className="font-mono text-[20px] font-semibold">
                        $2.31
                        <span className="text-[10px] text-t4 font-normal"> /HR</span>
                      </span>
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-t4">SNAPSHOT</span>
                        <span className="text-blue-soft">archive.org/web/…</span>
                      </div>
                      <div className="flex justify-between items-center font-mono text-[10px]">
                        <span className="text-t4">CHALLENGE WINDOW</span>
                        <span
                          className="px-[6px] py-[1px] rounded"
                          style={{
                            color: 'var(--amber-text)',
                            background: 'color-mix(in srgb, var(--amber) 8%, transparent)',
                            border: '1px solid color-mix(in srgb, var(--amber) 20%, transparent)',
                          }}
                        >
                          2H
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
