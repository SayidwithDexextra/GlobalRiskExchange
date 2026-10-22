'use client';

import { forwardRef, useEffect, useState } from 'react';
import { useViewport } from '@/hooks/useViewport';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface RocksProps {
  scrollProgress: number;
  mask?: boolean;
}

export const Rocks = forwardRef<{ leftRef: HTMLDivElement | null; rightRef: HTMLDivElement | null }, RocksProps>(
  function Rocks({ scrollProgress, mask = false }, ref) {
    const { w } = useViewport();
    const reducedMotion = usePrefersReducedMotion();
    const [loaded, setLoaded] = useState(false);

    const D = w > 1024;
    const T = w > 768;

    // Calculate rock geometry
    const desktop = w >= 1100;
    const dashW = D ? Math.min(880, w * 0.72) : T ? w * 0.86 : w - 32;
    const m = (w - dashW) / 2;
    // On desktop, size the rocks to the side margins so they don't cover dashboard text.
    const gap = 16;
    const ov = desktop ? ((m - gap) * 515) / 530 - m : T ? 70 : 20;
    const sc = Math.max((m + ov) / 515, desktop ? 0 : (w * 0.22) / 515);

    const leftWidth = 530 * sc;
    const rightWidth = m + ov + 10 * sc;
    const height = 1080 * sc;
    const bgSize = `${1920 * sc}px ${1080 * sc}px`;
    const rightBgPos = '0px 0px';
    const rightBgSize = `${620 * sc}px ${1080 * sc}px`;

    // Scroll-based transform
    const p = scrollProgress;
    const scale = reducedMotion ? 1 : 1 + 0.12 * p;
    const leftTranslate = reducedMotion ? 0 : -28 * p;
    const rightTranslate = reducedMotion ? 0 : 28 * p;

    // Load animation
    useEffect(() => {
      if (reducedMotion) {
        setLoaded(true);
      } else {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setLoaded(true);
          });
        });
      }
    }, [reducedMotion]);

    const innerScale = loaded ? 'scale(1)' : 'scale(1.08)';

    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: T ? 3 : 0,
          WebkitMaskImage: mask
            ? 'linear-gradient(to bottom, #000 calc(100% - 220px), transparent)'
            : undefined,
          maskImage: mask
            ? 'linear-gradient(to bottom, #000 calc(100% - 220px), transparent)'
            : undefined,
        }}
      >
        {/* Left rock */}
        <div
          data-hero-rock
          className="absolute left-0 bottom-0 will-change-transform"
          style={{
            width: `${leftWidth}px`,
            height: `${height}px`,
            transformOrigin: 'left bottom',
            transform: `translateX(${leftTranslate}%) scale(${scale})`,
          }}
        >
          <div
            className="w-full h-full bg-no-repeat"
            style={{
              backgroundImage: 'url(/assets/hero_rocks.webp)',
              backgroundSize: bgSize,
              backgroundPosition: '0px 0px',
              filter: 'var(--rock-filter)',
              transform: innerScale,
              transformOrigin: 'left bottom',
              transition: reducedMotion ? 'none' : 'transform 1200ms cubic-bezier(.2,.7,.2,1)',
            }}
          />
        </div>

        {/* Right rock */}
        <div
          className="absolute right-0 bottom-0 will-change-transform"
          style={{
            width: `${rightWidth}px`,
            height: `${height}px`,
            transformOrigin: 'right bottom',
            transform: `translateX(${rightTranslate}%) scale(${scale})`,
          }}
        >
          <div
            className="w-full h-full bg-no-repeat"
            style={{
              backgroundImage: 'url(/assets/hero_rocks_man.webp)',
              backgroundSize: rightBgSize,
              backgroundPosition: rightBgPos,
              filter: 'var(--rock-filter)',
              transform: innerScale,
              transformOrigin: 'right bottom',
              transition: reducedMotion ? 'none' : 'transform 1200ms cubic-bezier(.2,.7,.2,1)',
            }}
          />
        </div>
      </div>
    );
  }
);
