'use client';

import { forwardRef } from 'react';
import Link from 'next/link';

interface HeroCopyProps {
  isVisible: boolean;
  paddingTop: string;
  h1Size: string;
}

export const HeroCopy = forwardRef<HTMLDivElement, HeroCopyProps>(
  function HeroCopy({ isVisible, paddingTop, h1Size }, ref) {
    const inO = isVisible ? 1 : 0;
    const inT = isVisible ? 'none' : 'translateY(16px)';

    return (
      <div
        ref={ref}
        className="relative z-[1] flex flex-col items-center text-center will-change-transform"
        style={{ padding: `${paddingTop} 16px 0` }}
      >
        {/* Eyebrow */}
        <div
          className="font-mono text-[10px] tracking-[0.14em] uppercase text-t4"
          style={{
            opacity: inO,
            transform: inT,
            transition: 'opacity 600ms ease, transform 600ms cubic-bezier(.2,.7,.2,1)',
          }}
        >
          The marketplace for risk
        </div>

        {/* Headline */}
        <h1
          className="mt-5 font-semibold leading-[1.02] tracking-[-0.04em]"
          style={{
            fontSize: h1Size,
            textShadow: 'var(--hero-ts)',
          }}
        >
          <span
            className="block text-t5"
            style={{
              opacity: inO,
              transform: inT,
              transition: 'opacity 600ms ease 80ms, transform 600ms cubic-bezier(.2,.7,.2,1) 80ms',
            }}
          >
            Hedge the
          </span>
          <span
            className="block text-t1"
            style={{
              opacity: inO,
              transform: inT,
              transition: 'opacity 600ms ease 160ms, transform 600ms cubic-bezier(.2,.7,.2,1) 160ms',
            }}
          >
            unhedgeable.
          </span>
        </h1>

        {/* Subhead */}
        <p
          className="mt-5 max-w-[500px] text-[15px] leading-[1.6] text-t3"
          style={{
            textShadow: 'var(--hero-ts)',
            textWrap: 'pretty',
            opacity: inO,
            transform: inT,
            transition: 'opacity 600ms ease 240ms, transform 600ms cubic-bezier(.2,.7,.2,1) 240ms',
          }}
        >
          Create a futures market on any number you can measure, trade it long or short in USDC, and let public data settle it.
        </p>

        {/* CTAs */}
        <div
          className="mt-7 flex flex-wrap justify-center gap-2"
          style={{
            opacity: inO,
            transform: inT,
            transition: 'opacity 600ms ease 320ms, transform 600ms cubic-bezier(.2,.7,.2,1) 320ms',
          }}
        >
          <Link
            href="/#markets"
            className="h-10 px-5 flex items-center gap-2 rounded-full text-[13px] font-semibold transition-colors"
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
            Explore markets <span>→</span>
          </Link>
          <a
            href="https://dexetera.xyz/new-market"
            className="h-10 px-5 flex items-center rounded-full text-[13px] font-semibold transition-colors"
            style={{
              background: 'var(--card2)',
              border: '1px solid var(--line2)',
              color: 'var(--t1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--line4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--line2)';
            }}
          >
            Create a market
          </a>
        </div>
      </div>
    );
  }
);
