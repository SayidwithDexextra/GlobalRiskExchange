'use client';

// Inside Look page body: three pilot sections (Weather risk, Development cost, Power) with
// animated line drawing heroes, pinned scroll stats, market cards and content blocks.
//
// This is the design itself, not a re-creation:
//   insideLookTree.js   the template from design/source/Inside Look.dc.html, precompiled
//   insideLookLogic.js  the design's logic class, verbatim (plus two site hooks)
//   dcRuntime.js        renders both with the same rules as the Claude Design runtime
// To change copy or layout, edit the design and re-run design/inside-look/convert.py.
//
// The site's shared <Header> renders above this (see app/inside-look/page.tsx) and the
// site's <Footer> renders below it.

import { useSyncExternalStore } from 'react';
import { Footer } from '@/components/Footer';
import { createDCComponent } from './dcRuntime';
import { Component as InsideLookLogic } from './insideLookLogic';
import TREE from './insideLookTree';
import './inside-look.css';
import './inside-look-site.css';

const InsideLookDesign = createDCComponent(InsideLookLogic, TREE, 'Inside Look');

// The design logic reads window/matchMedia while rendering, so it renders in the browser only.
const noop = () => () => {};
function useIsClient() {
  return useSyncExternalStore(noop, () => true, () => false);
}

export default function InsideLook() {
  const isClient = useIsClient();
  return (
    <>
      <div className="dx-il" data-dx-il="">
        {isClient ? (
          <InsideLookDesign />
        ) : (
          // Server HTML: same dark first screen, plus readable text for search engines and link previews.
          <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            <div className="dx-il-sr">
              <h1>Inside Look. The unhedged exposures Dexetera is building first.</h1>
              <p>Weather risk: weather losses that are mostly uninsured and have no listed index to hedge them.</p>
              <p>Development cost: construction input prices hit a record and fixed price budgets carry the risk.</p>
              <p>Power: spot, capacity and solar capture prices that move faster than any listed contract.</p>
            </div>
          </div>
        )}
      </div>
      <div className="dx-il-foot">
        <Footer />
      </div>
    </>
  );
}
