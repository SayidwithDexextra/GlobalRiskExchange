'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Globe } from 'lucide-react';
import { useViewport } from '@/hooks/useViewport';
import { NAV_LINKS } from '@/lib/data';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';

interface HeaderProps {
  currentPath?: string;
}

export function Header({ currentPath = '/' }: HeaderProps) {
  const { w } = useViewport();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const showNav = w > 1100;
  const showLang = w >= 1180;
  const showCreate = w >= 1000;

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    if (w > 1100 && menuOpen) {
      setMenuOpen(false);
    }
  }, [w, menuOpen]);

  return (
    <header
      id="hdr"
      className={`hdr fixed top-0 left-0 right-0 z-40 h-[72px] transition-all duration-200${scrolled ? ' scrolled' : ''}`}
      style={{
        background: scrolled ? 'var(--hdr-glass)' : 'transparent',
        borderBottom: `1px solid ${scrolled ? 'var(--hair)' : 'transparent'}`,
        backdropFilter: scrolled ? 'blur(14px) saturate(140%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px) saturate(140%)' : 'none',
      }}
    >
      <div
        className={`relative max-w-[1344px] h-full mx-auto flex items-center justify-between ${w < 420 ? 'gap-2' : 'gap-16'}`}
        style={{ padding: '0 clamp(16px,3vw,32px)' }}
      >
        {/* Logo */}
        <Link href="/#top" className="flex items-center gap-[10px] text-t1">
          <Image
            src="/assets/dexetera-logo.png"
            alt="Dexetera"
            width={32}
            height={32}
            className="rounded-[6px] block flex-none"
          />
          <span className="font-serif font-medium text-[12px] tracking-[0.04em] uppercase text-t1">
            Dexetera
          </span>
        </Link>

        {/* Desktop Nav */}
        {showNav && (
          <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-7 text-[11px] font-semibold tracking-[0.08em] uppercase whitespace-nowrap">
            {NAV_LINKS.map((link) => {
              const isActive = currentPath === link.href ||
                (link.href === '/whitepaper' && currentPath === '/whitepaper') ||
                (link.href === '/contact' && currentPath === '/contact');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors hover:text-t1${isActive ? ' on' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  style={{ color: isActive ? 'var(--t1)' : 'var(--t2)' }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-[10px]">
          {/* Language (decorative) */}
          {showLang && (
            <span id="hdrLang" className="flex items-center gap-[6px] text-[12px] text-t2 px-2 cursor-pointer">
              <Globe className="w-[14px] h-[14px]" />
              English
            </span>
          )}

          <div className={`flex items-center ${w < 420 ? 'gap-[6px]' : 'gap-[10px]'}`}>
            {/* Theme toggle */}
            <ThemeToggle />

            {/* Create a market button */}
            {showCreate && (
              <a
                id="hdrCreate"
                href="https://dexetera.xyz/new-market"
                className="h-[34px] px-4 flex items-center rounded-full text-[12px] font-semibold transition-colors"
                style={{
                  background: 'var(--btn-s-bg)',
                  border: '1px solid var(--btn-s-line)',
                  color: 'var(--btn-s-fg)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--btn-s-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--btn-s-line)';
                }}
              >
                Create a market
              </a>
            )}

            {/* Launch app button */}
            <a
              href="https://dexetera.xyz"
              className="h-[34px] pl-[6px] pr-4 flex items-center gap-2 rounded-full text-[12px] font-semibold whitespace-nowrap transition-colors"
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
              <span
                className="w-[22px] h-[22px] rounded-full flex items-center justify-center flex-none"
                style={{ background: 'var(--btn-p-fg)' }}
              >
                <ArrowUpRight className="w-3 h-3" style={{ color: 'var(--btn-p-bg)' }} />
              </span>
              {w < 420 ? 'Launch' : 'Launch app'}
            </a>

            {/* Mobile menu button */}
            {!showNav && (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
                className="w-[34px] h-[34px] rounded-full flex flex-col items-center justify-center gap-1 cursor-pointer"
                style={{
                  border: '1px solid var(--line2)',
                  background: 'var(--card2)',
                }}
              >
                <span className="w-[14px] h-[1.5px] bg-t2" />
                <span className="w-[14px] h-[1.5px] bg-t2" />
                <span className="w-[14px] h-[1.5px] bg-t2" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)} 
        currentPath={currentPath}
      />
    </header>
  );
}
