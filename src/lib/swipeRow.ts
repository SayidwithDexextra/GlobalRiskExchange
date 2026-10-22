import type { CSSProperties } from 'react';

// Phone-only horizontal swipe row. Cards sit side by side and snap into place,
// with the next card peeking in so people know they can swipe.
// Bleeds to the screen edges so the peek reads clearly.
export const SWIPE_PAD = 'clamp(16px,3vw,32px)';

export function swipeRowStyle(cardWidth = '84%'): CSSProperties {
  return {
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: cardWidth,
    gridTemplateColumns: 'none',
    gap: '0 12px',
    overflowX: 'auto',
    overscrollBehaviorX: 'contain',
    scrollSnapType: 'x mandatory',
    scrollPaddingInline: SWIPE_PAD,
    marginInline: `calc(-1 * ${SWIPE_PAD})`,
    paddingInline: SWIPE_PAD,
    paddingBottom: 4,
    scrollbarWidth: 'none',
    WebkitOverflowScrolling: 'touch',
  };
}

export const swipeItemStyle: CSSProperties = { scrollSnapAlign: 'start' };

// Index of the card closest to the left edge of a swipe row.
export function swipeIndex(el: HTMLElement): number {
  const first = el.firstElementChild as HTMLElement | null;
  if (!first) return 0;
  const step = first.offsetWidth + 12;
  return Math.max(0, Math.round(el.scrollLeft / step));
}
