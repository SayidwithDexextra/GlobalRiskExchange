'use client';

import { Analytics } from '@vercel/analytics/next';

// Vercel Web Analytics, minus the team's own browsers.
// A browser is marked as "ours" by visiting any page with ?dx_me=1 (undo with ?dx_me=0).
export function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        try {
          if (localStorage.getItem('dx-internal') === '1') return null;
        } catch {}
        return event;
      }}
    />
  );
}
