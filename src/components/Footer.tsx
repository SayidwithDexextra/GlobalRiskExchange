import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FOOTER_LINKS, FOOTER_CHIPS } from '@/lib/data';

function isExternal(href: string) {
  return href.startsWith('http://') || href.startsWith('https://');
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  const className = 'text-[13px] text-t2 hover:text-t1 transition-colors';
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  if (href.startsWith('/')) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-hair bg-bg">
      {/* Main footer */}
      <div
        className="site-footer-grid max-w-[1344px] mx-auto grid gap-8"
        style={{
          padding: '56px clamp(16px,3vw,32px) 32px',
          gridTemplateColumns: 'minmax(0,1.4fr) repeat(3,minmax(0,1fr))',
        }}
      >
        {/* Brand column */}
        <div className="flex flex-col gap-4 max-w-[320px]">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/assets/dexetera-logo.png"
              alt="Dexetera"
              width={32}
              height={32}
              className="rounded-[6px]"
            />
            <span className="font-serif font-medium text-[12px] tracking-[0.04em] uppercase text-t1">
              Dexetera
            </span>
          </Link>
          <p className="text-[14px] leading-[1.6] text-t3">
            The marketplace for risk. Create a futures market on any number you can measure.
          </p>
        </div>

        {/* Product links */}
        <div className="flex flex-col gap-3">
          <h5 className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase text-t4 mb-1">
            Product
          </h5>
          {FOOTER_LINKS.product.map((link) => (
            <FooterLink key={link.href} href={link.href}>
              {link.label}
            </FooterLink>
          ))}
        </div>

        {/* Learn links */}
        <div className="flex flex-col gap-3">
          <h5 className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase text-t4 mb-1">
            Learn
          </h5>
          {FOOTER_LINKS.learn.map((link) => (
            <FooterLink key={link.href} href={link.href}>
              {link.label}
            </FooterLink>
          ))}
        </div>

        {/* Company links */}
        <div className="flex flex-col gap-3">
          <h5 className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase text-t4 mb-1">
            Company
          </h5>
          {FOOTER_LINKS.company.map((link) => (
            <FooterLink key={link.href} href={link.href}>
              {link.label}
            </FooterLink>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="max-w-[1344px] mx-auto border-t border-hair flex flex-wrap justify-between items-center gap-x-4 gap-y-2 font-mono text-[10px] tracking-[0.1em] uppercase text-t4"
        style={{ padding: '20px clamp(16px,3vw,32px) 32px' }}
      >
        <span className="inline-flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>© 2026 Dexetera</span>
          <a
            href="https://www.dexetera.xyz/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-t1"
          >
            Terms
          </a>
          <a
            href="https://www.dexetera.xyz/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-t1"
          >
            Privacy
          </a>
        </span>
        <span>Settled by public data</span>
      </div>

      {/* Status bar */}
      <StatusBar />
    </footer>
  );
}

function StatusBar() {
  return (
    <div
      className="border-t border-hair"
      style={{
        background: 'var(--bg)',
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '6px 6px',
      }}
    >
      <div
        className="max-w-[1344px] mx-auto min-h-[48px] py-[10px] flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]"
        style={{ padding: '10px clamp(16px,3vw,32px)' }}
      >
        <Link href="/#how" className="text-t2 hover:text-t1">
          How it works
        </Link>
        <a href="https://dexetera.xyz/watchlist" target="_blank" rel="noopener noreferrer" className="text-t2 hover:text-t1">
          Watchlist
        </a>
        <a href="mailto:admin@dexetera.xyz" className="text-t2 hover:text-t1">
          Support
        </a>

        <div className="ml-auto flex flex-wrap items-center gap-[6px]">
          <span className="text-t4">Example markets:</span>
          {FOOTER_CHIPS.map((chip) => (
            <a
              key={chip}
              href={`https://dexetera.xyz/token/${chip}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] px-[7px] py-[3px] rounded text-t2 transition-colors hover:text-t1"
              style={{ border: '1px solid var(--line3)' }}
            >
              {chip}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
