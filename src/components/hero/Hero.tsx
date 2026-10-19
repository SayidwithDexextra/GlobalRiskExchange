'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useViewport } from '@/hooks/useViewport';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { HeroStorm } from './HeroStorm';
import { HeroCopy } from './HeroCopy';
import { DashboardMock } from './DashboardMock';
import { Rocks } from './Rocks';
import { ScrollPill } from './ScrollPill';

// Noise texture (same as source)
const NOISE_SVG = "url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22160%22%20height=%22160%22%3E%3Cfilter%20id=%22n%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.85%22%20numOctaves=%222%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20filter=%22url(%23n)%22/%3E%3C/svg%3E')";

interface HeroProps {
  eggPrice: number;
}

export function Hero({ eggPrice }: HeroProps) {
  const { w, h } = useViewport();
  const reducedMotion = usePrefersReducedMotion();
  
  const heroRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const dashRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLAnchorElement>(null);

  const [hin, setHin] = useState(false);
  const [myOpen, setMyOpen] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Breakpoints
  const D = w > 1024;
  const T = w > 768;
  const seq = T && !reducedMotion;

  // Responsive values
  const h1Size = D ? '76px' : T ? '60px' : '44px';
  const heroPadT = T ? '96px' : '112px';
  const dashW = D ? Math.min(880, w * 0.72) : T ? w * 0.86 : w - 32;
  const pvSize = T ? '40px' : '28px';

  // Stagger-in animation
  useEffect(() => {
    if (reducedMotion) {
      setHin(true);
    } else {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHin(true);
        });
      });
    }
  }, [reducedMotion]);

  // Scroll handler for hero sequence
  const handleScroll = useCallback(() => {
    if (!heroRef.current || !seq) {
      setScrollProgress(0);
      return;
    }

    const hero = heroRef.current;
    const scrollY = window.scrollY;
    const heroTop = hero.offsetTop;
    const heroHeight = hero.offsetHeight;
    const vh = window.innerHeight;
    
    // Calculate progress through the scroll sequence
    const p = Math.max(0, Math.min(1, (scrollY - heroTop) / Math.max(1, heroHeight - vh)));
    setScrollProgress(p);

    // Apply imperative transforms to avoid re-renders
    if (copyRef.current) {
      copyRef.current.style.opacity = String(1 - Math.min(1, p / 0.7));
      copyRef.current.style.transform = `translateY(${-120 * p}px)`;
    }

    if (dashRef.current) {
      const dashH = dashRef.current.offsetHeight;
      const fit = Math.max(0.82, Math.min(1, (vh - 104) / dashH));
      const end = Math.max(88, 72 + (vh - 72 - dashH * fit) / 2);
      const delta = Math.max(0, dashRef.current.offsetTop - end);
      dashRef.current.style.transformOrigin = '50% 0';
      dashRef.current.style.transform = `translateY(${-delta * p}px) scale(${1 - (1 - fit) * p})`;
    }

    if (pillRef.current) {
      pillRef.current.style.opacity = String(Math.max(0, 1 - p / 0.15));
    }
  }, [seq]);

  useEffect(() => {
    if (!seq) {
      // Clear transforms when not in sequence mode
      if (copyRef.current) {
        copyRef.current.style.opacity = '';
        copyRef.current.style.transform = '';
      }
      if (dashRef.current) {
        dashRef.current.style.transform = '';
      }
      return;
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [seq, handleScroll]);

  return (
    <div
      id="top"
      ref={heroRef}
      data-screen-label="Hero"
      className="relative"
      style={{
        height: seq ? '180vh' : 'auto',
        background: 'var(--bg)',
      }}
    >
      <div
        className="overflow-hidden"
        style={{
          position: seq ? 'sticky' : 'relative',
          top: 0,
          height: seq ? '100vh' : 'auto',
          paddingBottom: seq ? 0 : T ? '96px' : '72px',
          background: 'radial-gradient(ellipse at 50% 0%, var(--hero-a) 0%, var(--hero-b) 35%, var(--bg) 70%)',
        }}
      >
        {/* Noise overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 'var(--grain-lp)',
            backgroundImage: NOISE_SVG,
          }}
        />

        {/* Storm canvas */}
        <HeroStorm />

        {/* Copy */}
        <HeroCopy
          ref={copyRef}
          isVisible={hin}
          paddingTop={heroPadT}
          h1Size={h1Size}
        />

        {/* Dashboard mock */}
        <DashboardMock
          ref={dashRef}
          width={dashW}
          showSidebar={T}
          eggPrice={eggPrice}
          myOpen={myOpen}
          onToggleMy={() => setMyOpen(!myOpen)}
          pvSize={pvSize}
          scrollPill={seq ? <ScrollPill ref={pillRef} opacity={1} /> : null}
        />

        {/* Rocks */}
        <Rocks scrollProgress={scrollProgress} />
      </div>
    </div>
  );
}
