'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const STORAGE_KEY = 'dx-scroll-target';

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function stripHash() {
  if (!window.location.hash) return;
  const next = window.location.pathname + window.location.search;
  history.replaceState(history.state, '', next);
}

function scrollToId(id: string, behavior: ScrollBehavior) {
  if (!id || id === 'top') {
    window.scrollTo({ top: 0, left: 0, behavior });
    return true;
  }
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ block: 'start', behavior });
  return true;
}

function scrollWhenReady(id: string, behavior: ScrollBehavior) {
  let frames = 0;
  const tick = () => {
    if (scrollToId(id, behavior) || frames > 40) return;
    frames += 1;
    requestAnimationFrame(tick);
  };
  tick();
}

function readPendingTarget() {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writePendingTarget(id: string) {
  try {
    sessionStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* private mode */
  }
}

function clearPendingTarget() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* private mode */
  }
}

function parseHashTarget(href: string) {
  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return null;
  }
  if (url.origin !== window.location.origin) return null;
  if (!url.hash || url.hash === '#') return null;
  const id = decodeURIComponent(url.hash.slice(1));
  if (!id) return null;
  return { pathname: url.pathname, id };
}

/**
 * Section links stay as href="/#markets" so they still work without JavaScript.
 * Clicks scroll to the section and leave the address bar on the page path.
 */
export function HashlessScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const pending = readPendingTarget();
    const hashId = window.location.hash
      ? decodeURIComponent(window.location.hash.slice(1))
      : '';
    const id = pending || hashId;
    if (!id && !window.location.hash) return;

    // Defer so a remounted effect (React strict mode) can cancel the first pass
    // before the stored target is cleared.
    const frame = requestAnimationFrame(() => {
      if (pending) clearPendingTarget();
      if (id) {
        scrollToId(id, 'auto');
        // Next restores scroll on hydration after the hash is gone. Pin the
        // section for a few frames so that restore does not win.
        let frames = 0;
        const pin = () => {
          scrollToId(id, 'auto');
          frames += 1;
          if (frames < 8) requestAnimationFrame(pin);
        };
        requestAnimationFrame(pin);
      }
      stripHash();
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      // Clicks on the label land on a text node, which has no closest().
      const origin = event.target instanceof Element
        ? event.target
        : event.target instanceof Node
          ? event.target.parentElement
          : null;
      const anchor = origin?.closest('a');
      if (!anchor) return;
      const targetAttr = anchor.getAttribute('target');
      if (targetAttr && targetAttr !== '_self') return;
      const href = anchor.getAttribute('href');
      if (!href) return;

      const target = parseHashTarget(href);
      if (!target) return;

      event.preventDefault();

      if (target.pathname === window.location.pathname) {
        scrollToId(target.id, prefersReducedMotion() ? 'auto' : 'smooth');
        stripHash();
        return;
      }

      writePendingTarget(target.id);
      window.location.assign(target.pathname);
    }

    function onHashChange() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      stripHash();
      if (id) scrollToId(id, 'auto');
    }

    document.addEventListener('click', onClick, true);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  return null;
}
