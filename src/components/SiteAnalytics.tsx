'use client';

import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { track } from '@vercel/analytics';

declare global {
  interface Window {
    posthog?: { capture: (event: string, props?: Record<string, unknown>) => void };
  }
}

function isInternal() {
  try {
    return localStorage.getItem('dx-internal') === '1';
  } catch {
    return false;
  }
}

// Which part of the page a click came from, e.g. "Hero", "Creators", "Header", "Footer".
function sectionOf(el: Element): string {
  const labelled = el.closest('[data-screen-label]');
  if (labelled) return labelled.getAttribute('data-screen-label') || 'Page';
  if (el.closest('header, .hdr')) return 'Header';
  if (el.closest('footer')) return 'Footer';
  if (el.closest('[class*="film"]')) return 'Film';
  const withId = el.closest('[id]');
  return withId?.id || 'Page';
}

// Vercel Web Analytics, minus the team's own browsers.
// A browser is marked as "ours" by visiting any page with ?dx_me=1 (undo with ?dx_me=0).
// Also records every click that sends a visitor to the app (dexetera.xyz) as an
// "app_click" conversion in PostHog and as an "App click" event in Vercel.
export function SiteAnalytics() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      const link = target?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!link) return;
      let url: URL;
      try {
        url = new URL(link.href, location.href);
      } catch {
        return;
      }
      if (!/(^|\.)dexetera\.xyz$/.test(url.hostname)) return;

      const props = {
        cta: (link.innerText || link.getAttribute('aria-label') || link.getAttribute('data-cta') || '')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 60),
        destination: url.pathname || '/',
        section: sectionOf(link),
        page: location.pathname,
      };

      try {
        window.posthog?.capture('app_click', props);
      } catch {}
      if (!isInternal()) {
        try {
          track('App click', { cta: props.cta, destination: props.destination, section: props.section });
        } catch {}
      }
    }
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return <Analytics beforeSend={(event) => (isInternal() ? null : event)} />;
}
