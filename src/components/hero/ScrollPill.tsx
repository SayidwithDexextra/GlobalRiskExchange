'use client';

import { forwardRef } from 'react';
import { Mouse } from 'lucide-react';
import Link from 'next/link';

interface ScrollPillProps {
  opacity: number;
}

export const ScrollPill = forwardRef<HTMLAnchorElement, ScrollPillProps>(
  function ScrollPill({ opacity }, ref) {
    return (
      <Link
        ref={ref}
        href="/#markets"
        className="absolute z-[4] left-1/2 -translate-x-1/2 h-8 px-[14px] flex items-center gap-2 rounded-full text-[11px] text-t2 whitespace-nowrap transition-colors hover:text-t1"
        style={{
          background: 'var(--pill)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid var(--line2)',
          top: -40,
          opacity,
        }}
      >
        <Mouse className="w-3 h-3" />
        Scroll to explore
      </Link>
    );
  }
);
