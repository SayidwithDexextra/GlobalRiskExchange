'use client';

import { useState } from 'react';
import { useViewport } from '@/hooks/useViewport';
import { FAQ } from '@/lib/data';

export function FaqAccordion() {
  const { w } = useViewport();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const M = w >= 900;
  const hdrCols = M ? 'minmax(0,5fr) minmax(0,7fr)' : 'minmax(0,1fr)';

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div
      id="faq"
      data-reveal
      data-screen-label="FAQ"
      className="max-w-[1344px] mx-auto scroll-mt-[88px]"
      style={{ padding: 'clamp(56px,7vw,88px) clamp(16px,3vw,32px) 0' }}
    >
      <div
        className="grid gap-10 items-start"
        style={{ gridTemplateColumns: hdrCols }}
      >
        {/* Left column */}
        <div className="flex flex-col gap-4">
          <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-t4">
            Learn how this works
          </div>
          <h2
            className="m-0 font-semibold leading-[1.08] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(30px,3.4vw,44px)', textWrap: 'balance' }}
          >
            <span className="block text-t5">Questions,</span>
            <span className="block text-t1">answered.</span>
          </h2>
          <p className="m-0 text-[17px] leading-[1.6] text-t3 max-w-[420px]">
            If you still have questions, write to us or read the docs.
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <a
              href="mailto:admin@dexetera.xyz"
              className="h-10 px-[18px] flex items-center rounded-[6px] text-[13px] font-medium transition-colors"
              style={{
                background: 'var(--card3)',
                border: '1px solid var(--line)',
                color: 'var(--t1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--line3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--line)';
              }}
            >
              admin@dexetera.xyz
            </a>
            <a
              href="https://doc.dexetera.org"
              className="h-10 px-[18px] flex items-center rounded-[6px] text-[13px] font-medium text-t2 transition-colors hover:text-t1"
            >
              Docs →
            </a>
          </div>
        </div>

        {/* Right column - FAQ items */}
        <div className="flex flex-col gap-2">
          {FAQ.map(([q, a], i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-xl transition-all duration-200"
                style={{
                  background: isOpen ? 'var(--card)' : 'transparent',
                  border: `1px solid ${isOpen ? 'var(--line)' : 'var(--hair)'}`,
                }}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center gap-3 px-[18px] py-4 text-left cursor-pointer bg-transparent border-0"
                >
                  <span
                    className="w-[22px] h-[22px] rounded-full flex items-center justify-center flex-none text-[11px] text-t-gray"
                    style={{ border: '1px solid var(--line4)' }}
                  >
                    ?
                  </span>
                  <span className="flex-1 text-[15px] font-semibold text-t1">
                    {q}
                  </span>
                  <span className="font-mono text-[14px] text-t3">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <p
                    className="pl-[52px] pr-[18px] pb-[18px] m-0 text-[14px] leading-[1.65] text-t3"
                    style={{ textWrap: 'pretty' }}
                  >
                    {a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
