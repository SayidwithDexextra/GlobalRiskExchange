'use client';

import Link from 'next/link';
import { NAV_LINKS } from '@/lib/data';
import { ThemeToggle } from './ThemeToggle';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath?: string;
}

export function MobileMenu({ isOpen, onClose, currentPath = '/' }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="absolute top-[72px] left-0 right-0 z-50 flex flex-col bg-card2 border-b border-line"
      style={{ padding: '8px clamp(16px,3vw,32px) 16px' }}
    >
      {NAV_LINKS.map((link) => {
        const isActive = currentPath === link.href || 
          (link.href.startsWith('/#') && currentPath === '/');
        return (
          <Link
            key={link.href}
            href={link.href}
            className="py-[14px] border-b border-hair text-[12px] font-semibold tracking-[0.08em] uppercase"
            style={{ color: isActive ? 'var(--t1)' : 'var(--t2)' }}
          >
            {link.label}
          </Link>
        );
      })}
      <div className="flex items-center justify-between gap-3 pt-[14px]">
        <a
          href="https://dexetera.xyz/new-market"
          className="text-[12px] font-semibold tracking-[0.08em] uppercase text-t1"
        >
          Create a market
        </a>
        <ThemeToggle />
      </div>
    </div>
  );
}
