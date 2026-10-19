"use client";

// "Who it's for" landing section. 1:1 port of the Claude Design source
// (design/source/Dexetera Landing v2.dc.html, data-screen-label="Who it's for").
// Styles: ./who.css, scoped under .dx-who. Uses the site's theme variables (--card, --line, --t3...).
// Mobile rules that matter (do not change):
//  - every grid track is minmax(0,1fr) and every card has min-width:0, so nothing can push wider than the screen
//  - charts are SVGs with a fixed viewBox (200 x 60), preserveAspectRatio="none", width/height 100%,
//    and vector-effect="non-scaling-stroke", so they stretch to the card and keep crisp 1.5px lines
//  - chart boxes are a fixed 128px tall at every width

import { useLiveMarket } from "@/hooks/useLiveMarket";
import { exampleBySymbol } from "@/lib/exampleMarkets";
import { formatUsdAmount } from "@/lib/format";
import "./who.css";

const UNHEDGED_FILL = "M0,16.22 C1.15,17.26 4.6,22.16 6.9,22.46 C9.2,22.77 11.49,18.48 13.79,18.05 C16.09,17.62 18.39,18.13 20.69,19.9 C22.99,21.67 25.29,26.18 27.59,28.67 C29.89,31.16 32.18,33.09 34.48,34.86 C36.78,36.64 39.08,38.22 41.38,39.31 C43.68,40.4 45.98,40.45 48.28,41.41 C50.57,42.38 52.87,43.62 55.17,45.1 C57.47,46.58 59.77,48.31 62.07,50.29 C64.37,52.27 66.67,57.36 68.97,57 C71.26,56.64 73.56,49.99 75.86,48.14 C78.16,46.29 80.46,47.65 82.76,45.9 C85.06,44.15 87.36,38.65 89.66,37.65 C91.95,36.64 94.25,39.32 96.55,39.87 C98.85,40.43 101.15,42.04 103.45,40.96 C105.75,39.89 108.05,35.55 110.34,33.41 C112.64,31.27 114.94,28.26 117.24,28.14 C119.54,28.03 121.84,33.25 124.14,32.72 C126.44,32.19 128.74,26.27 131.03,24.94 C133.33,23.61 135.63,24.56 137.93,24.74 C140.23,24.91 142.53,25.81 144.83,26.01 C147.13,26.22 149.43,26.95 151.72,25.96 C154.02,24.98 156.32,20.81 158.62,20.08 C160.92,19.36 163.22,22.39 165.52,21.62 C167.82,20.85 170.11,17.71 172.41,15.46 C174.71,13.22 177.01,10.22 179.31,8.15 C181.61,6.07 183.91,2.89 186.21,3 C188.51,3.11 190.8,8.76 193.1,8.82 C195.4,8.88 198.85,4.27 200,3.36 L200,60 L0,60 Z";
const UNHEDGED_LINE = "M0,16.22 C1.15,17.26 4.6,22.16 6.9,22.46 C9.2,22.77 11.49,18.48 13.79,18.05 C16.09,17.62 18.39,18.13 20.69,19.9 C22.99,21.67 25.29,26.18 27.59,28.67 C29.89,31.16 32.18,33.09 34.48,34.86 C36.78,36.64 39.08,38.22 41.38,39.31 C43.68,40.4 45.98,40.45 48.28,41.41 C50.57,42.38 52.87,43.62 55.17,45.1 C57.47,46.58 59.77,48.31 62.07,50.29 C64.37,52.27 66.67,57.36 68.97,57 C71.26,56.64 73.56,49.99 75.86,48.14 C78.16,46.29 80.46,47.65 82.76,45.9 C85.06,44.15 87.36,38.65 89.66,37.65 C91.95,36.64 94.25,39.32 96.55,39.87 C98.85,40.43 101.15,42.04 103.45,40.96 C105.75,39.89 108.05,35.55 110.34,33.41 C112.64,31.27 114.94,28.26 117.24,28.14 C119.54,28.03 121.84,33.25 124.14,32.72 C126.44,32.19 128.74,26.27 131.03,24.94 C133.33,23.61 135.63,24.56 137.93,24.74 C140.23,24.91 142.53,25.81 144.83,26.01 C147.13,26.22 149.43,26.95 151.72,25.96 C154.02,24.98 156.32,20.81 158.62,20.08 C160.92,19.36 163.22,22.39 165.52,21.62 C167.82,20.85 170.11,17.71 172.41,15.46 C174.71,13.22 177.01,10.22 179.31,8.15 C181.61,6.07 183.91,2.89 186.21,3 C188.51,3.11 190.8,8.76 193.1,8.82 C195.4,8.88 198.85,4.27 200,3.36";
const SPREAD_FILL = "M0,9.46 C1.15,9.97 4.6,12.37 6.9,12.51 C9.2,12.66 11.49,10.57 13.79,10.36 C16.09,10.15 18.39,10.4 20.69,11.26 C22.99,12.13 25.29,14.33 27.59,15.55 C29.89,16.77 32.18,17.71 34.48,18.58 C36.78,19.45 39.08,20.22 41.38,20.75 C43.68,21.29 45.98,21.31 48.28,21.78 C50.57,22.25 52.87,22.86 55.17,23.58 C57.47,24.31 59.77,25.15 62.07,26.12 C64.37,27.09 66.67,29.58 68.97,29.4 C71.26,29.23 73.56,25.97 75.86,25.07 C78.16,24.17 80.46,24.83 82.76,23.98 C85.06,23.12 87.36,20.43 89.66,19.94 C91.95,19.45 94.25,20.76 96.55,21.03 C98.85,21.3 101.15,22.09 103.45,21.56 C105.75,21.03 108.05,18.91 110.34,17.87 C112.64,16.82 114.94,15.35 117.24,15.29 C119.54,15.24 121.84,17.79 124.14,17.53 C126.44,17.27 128.74,14.38 131.03,13.73 C133.33,13.08 135.63,13.54 137.93,13.63 C140.23,13.71 142.53,14.15 144.83,14.25 C147.13,14.35 149.43,14.71 151.72,14.23 C154.02,13.74 156.32,11.71 158.62,11.35 C160.92,11 163.22,12.48 165.52,12.1 C167.82,11.73 170.11,10.19 172.41,9.09 C174.71,8 177.01,6.53 179.31,5.52 C181.61,4.5 183.91,2.95 186.21,3 C188.51,3.05 190.8,5.82 193.1,5.85 C195.4,5.88 198.85,3.62 200,3.18 L200,37.03 L193.1,39.02 L186.21,37.15 L179.31,38.94 L172.41,41.1 L165.52,42.76 L158.62,42.14 L151.72,43.69 L144.83,43.41 L137.93,42.92 L131.03,43.26 L124.14,45.81 L117.24,44.28 L110.34,46.23 L103.45,48.27 L96.55,47.73 L89.66,46.96 L82.76,49.7 L75.86,50.27 L68.97,52.98 L62.07,51.1 L55.17,49.78 L48.28,48.56 L41.38,47.74 L34.48,46.78 L27.59,45.15 L20.69,42.79 L13.79,42.51 L6.9,44.15 L0,41.99 Z";
const GAS_LINE = "M0,41.99 C1.15,42.35 4.6,44.07 6.9,44.15 C9.2,44.24 11.49,42.74 13.79,42.51 C16.09,42.28 18.39,42.34 20.69,42.79 C22.99,43.23 25.29,44.49 27.59,45.15 C29.89,45.82 32.18,46.35 34.48,46.78 C36.78,47.22 39.08,47.45 41.38,47.74 C43.68,48.04 45.98,48.22 48.28,48.56 C50.57,48.9 52.87,49.36 55.17,49.78 C57.47,50.21 59.77,50.57 62.07,51.1 C64.37,51.63 66.67,53.12 68.97,52.98 C71.26,52.84 73.56,50.82 75.86,50.27 C78.16,49.73 80.46,50.25 82.76,49.7 C85.06,49.15 87.36,47.29 89.66,46.96 C91.95,46.64 94.25,47.52 96.55,47.73 C98.85,47.95 101.15,48.52 103.45,48.27 C105.75,48.02 108.05,46.89 110.34,46.23 C112.64,45.56 114.94,44.35 117.24,44.28 C119.54,44.21 121.84,45.98 124.14,45.81 C126.44,45.64 128.74,43.74 131.03,43.26 C133.33,42.78 135.63,42.89 137.93,42.92 C140.23,42.94 142.53,43.28 144.83,43.41 C147.13,43.54 149.43,43.91 151.72,43.69 C154.02,43.48 156.32,42.3 158.62,42.14 C160.92,41.99 163.22,42.93 165.52,42.76 C167.82,42.58 170.11,41.73 172.41,41.1 C174.71,40.46 177.01,39.6 179.31,38.94 C181.61,38.28 183.91,37.13 186.21,37.15 C188.51,37.16 190.8,39.04 193.1,39.02 C195.4,39.01 198.85,37.36 200,37.03";
const POWER_LINE = "M0,9.46 C1.15,9.97 4.6,12.37 6.9,12.51 C9.2,12.66 11.49,10.57 13.79,10.36 C16.09,10.15 18.39,10.4 20.69,11.26 C22.99,12.13 25.29,14.33 27.59,15.55 C29.89,16.77 32.18,17.71 34.48,18.58 C36.78,19.45 39.08,20.22 41.38,20.75 C43.68,21.29 45.98,21.31 48.28,21.78 C50.57,22.25 52.87,22.86 55.17,23.58 C57.47,24.31 59.77,25.15 62.07,26.12 C64.37,27.09 66.67,29.58 68.97,29.4 C71.26,29.23 73.56,25.97 75.86,25.07 C78.16,24.17 80.46,24.83 82.76,23.98 C85.06,23.12 87.36,20.43 89.66,19.94 C91.95,19.45 94.25,20.76 96.55,21.03 C98.85,21.3 101.15,22.09 103.45,21.56 C105.75,21.03 108.05,18.91 110.34,17.87 C112.64,16.82 114.94,15.35 117.24,15.29 C119.54,15.24 121.84,17.79 124.14,17.53 C126.44,17.27 128.74,14.38 131.03,13.73 C133.33,13.08 135.63,13.54 137.93,13.63 C140.23,13.71 142.53,14.15 144.83,14.25 C147.13,14.35 149.43,14.71 151.72,14.23 C154.02,13.74 156.32,11.71 158.62,11.35 C160.92,11 163.22,12.48 165.52,12.1 C167.82,11.73 170.11,10.19 172.41,9.09 C174.71,8 177.01,6.53 179.31,5.52 C181.61,4.5 183.91,2.95 186.21,3 C188.51,3.05 190.8,5.82 193.1,5.85 C195.4,5.88 198.85,3.62 200,3.18";
const REF_Y = 3.36;

export default function WhoItsFor() {
  const { ownerFees } = useLiveMarket();
  const fees = formatUsdAmount(ownerFees);
  const gpu = exampleBySymbol("GPU-H100");
  const dram = exampleBySymbol("DRAM-DDR5");
  const eggs = exampleBySymbol("PRICE-EGGS");
  return (
    <section className="dx-who" data-reveal aria-labelledby="who-title">
      <div className="dx-who__hdr">
        <div className="dx-who__hdr-l">
          <div className="dx-who__eyebrow">Who it's for</div>
          <h2 id="who-title">For anyone with exposure to a number.</h2>
        </div>
        <p className="dx-who__lede">
          Businesses hedge the inputs that move their margins. Traders take a view. Experts list what they know. Anyone with a wallet can take part.
        </p>
      </div>

      <div className="dx-who__grid">
        <article className="dx-who__card">
          <div className="dx-who__viz">
            <div className="dx-who__legend">
              <span style={{ color: "var(--red)" }}><i className="sw" />UNHEDGED COST</span>
              <span style={{ color: "var(--t2)" }}><i className="sw dash" />HEDGED</span>
            </div>
            <div className="dx-who__plot">
              <svg viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="dxw-g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--red)" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="var(--red)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="0" x2="200" y1={REF_Y} y2={REF_Y} stroke="var(--line4)" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
                <path d={UNHEDGED_FILL} fill="url(#dxw-g1)" />
                <path d={UNHEDGED_LINE} fill="none" stroke="var(--red)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <span className="dx-who__num">01 / BUSINESSES</span>
          <span className="dx-who__title">Hedge the number that moves your margin.</span>
          <span className="dx-who__body">Importers, data centers, miners and farmers can take the other side of the price that drives their costs.</span>
          <a className="dx-who__chip" href="https://dexetera.xyz/explore">{gpu.symbol} →</a>
        </article>

        <article className="dx-who__card">
          <div className="dx-who__viz">
            <div className="dx-who__legend">
              <span style={{ color: "var(--green)" }}><i className="sw" />POWER</span>
              <span style={{ color: "var(--t3)" }}><i className="sw" />GAS</span>
              <span style={{ color: "var(--t4)" }}><i className="sw box" />GAP</span>
            </div>
            <div className="dx-who__plot">
              <svg viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
                <path d={SPREAD_FILL} fill="var(--green)" fillOpacity={0.1} />
                <path d={GAS_LINE} fill="none" stroke="var(--t3)" strokeWidth={1.25} vectorEffect="non-scaling-stroke" />
                <path d={POWER_LINE} fill="none" stroke="var(--green)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <span className="dx-who__num">02 / FUNDS &amp; TRADERS</span>
          <span className="dx-who__title">Trade a macro print, a spread or a KPI.</span>
          <span className="dx-who__body">Direct exposure to real-world numbers, long or short, with leverage in USDC. Exit any time.</span>
          <a className="dx-who__chip" href="https://dexetera.xyz/explore">POWER / GAS →</a>
        </article>

        <article className="dx-who__card">
          <div className="dx-who__viz dx-who__viz--stat">
            <span className="dx-who__vlabel">CREATOR FEES · DRAM-DDR5</span>
            <span className="dx-who__big">{fees}</span>
            <div className="dx-who__row"><span style={{ color: "var(--t4)" }}>PAID PER TRADE</span><span style={{ color: "var(--green)" }}>▲ LIVE</span></div>
          </div>
          <span className="dx-who__num">03 / DATA OWNERS</span>
          <span className="dx-who__title">List what you know. Earn on every trade.</span>
          <span className="dx-who__body">If you know a number and where it is published, the wizard turns it into a market in minutes.</span>
          <a className="dx-who__chip" href="https://dexetera.xyz/new-market">{dram.symbol} →</a>
        </article>

        <article className="dx-who__card">
          <div className="dx-who__viz dx-who__viz--stat dx-who__viz--list">
            <span className="dx-who__vlabel">WHAT YOU NEED</span>
            <div className="dx-who__row"><span style={{ color: "var(--t3)" }}>Wallet</span><span style={{ color: "var(--green)" }}>✓</span></div>
            <div className="dx-who__row"><span style={{ color: "var(--t3)" }}>Collateral</span><span>USDC</span></div>
            <div className="dx-who__row"><span style={{ color: "var(--t3)" }}>Gas</span><span>$0</span></div>
            <div className="dx-who__row"><span style={{ color: "var(--t3)" }}>Signatures per trade</span><span>1</span></div>
          </div>
          <span className="dx-who__num">04 / GLOBAL INVESTORS</span>
          <span className="dx-who__title">Hedging tools, open to anyone.</span>
          <span className="dx-who__body">Most hedging products are built for institutions. Dexetera is open to anyone with a wallet.</span>
          <a className="dx-who__chip" href="https://dexetera.xyz/token/PRICE-EGGS">{eggs.symbol} →</a>
        </article>
      </div>
    </section>
  );
}
