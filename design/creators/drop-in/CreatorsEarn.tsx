"use client";
import { Fragment, useState } from "react";
import "./creators.css";

/** Monthly trading volume stops (USD). Default index 4 = $25,000,000. */
export const CREATOR_VOLUME_STOPS = [1e6, 2e6, 5e6, 10e6, 25e6, 50e6, 100e6, 250e6, 500e6];
export const TRADING_FEE = 0.001; // ~0.10% per trade
export const CREATOR_SHARE = 0.2; // creators earn 20% of trading fees, ongoing

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

const STEPS: [string, string][] = [
  ["List a number.", "Describe it in plain language and the wizard builds the market."],
  ["Traders trade it.", "Every fill pays the ~0.10% fee."],
  ["You earn 20%.", "Your share is paid per trade to your creator wallet."],
];

export default function CreatorsEarn() {
  const [idx, setIdx] = useState(4);
  const vol = CREATOR_VOLUME_STOPS[idx];
  const fees = vol * TRADING_FEE;
  const month = fees * CREATOR_SHARE;
  const cells: [string, string][] = [
    ["VOLUME", usd(vol)],
    ["FEE", "0.10%"],
    ["FEES", usd(fees)],
    ["CREATOR SHARE", "20%"],
  ];
  const ops = ["×", "=", "×", "="];

  return (
    <section className="dx-cr" data-screen-label="Creators" id="creators">
      <div className="dx-cr__card">
        <div className="dx-cr__left">
          <div className="dx-cr__eyebrow">Creators earn 20%</div>
          <h2 className="dx-cr__title">List a market. Earn 20% of every trade.</h2>
          <p className="dx-cr__lede">
            Every trade on Dexetera pays a ~0.10% fee. 20% of that fee goes straight to the wallet that
            created the market, on every trade, for as long as the market trades. No cap, no expiry.
          </p>
          <div className="dx-cr__steps">
            {STEPS.map(([b, t], i) => (
              <div className="dx-cr__step" key={b}>
                <span className="dx-cr__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="dx-cr__stxt"><span className="dx-cr__sb">{b}</span> {t}</span>
              </div>
            ))}
          </div>
          <a className="dx-cr__btn" href="https://dexetera.xyz/new-market">+ Create a market</a>
        </div>

        <div className="dx-cr__right">
          <div className="dx-cr__calc">
            <div className="dx-cr__head">
              <span className="dx-cr__label">CREATOR EARNINGS · ESTIMATE</span>
              <span className="dx-cr__pill">EXAMPLE</span>
            </div>
            <div className="dx-cr__vol">
              <div className="dx-cr__volrow">
                <span className="dx-cr__vollabel">Monthly trading volume</span>
                <span className="dx-cr__volval">{usd(vol)}</span>
              </div>
              <input
                className="dx-cr__range" type="range" min={0} max={CREATOR_VOLUME_STOPS.length - 1} step={1}
                value={idx} onChange={(e) => setIdx(+e.target.value)} aria-label="Monthly trading volume"
              />
              <div className="dx-cr__ends"><span>$1M</span><span>$500M</span></div>
            </div>
            <div className="dx-cr__eq">
              {cells.map(([k, v], i) => (
                <Fragment key={k}>
                  <div className="dx-cr__cell"><span className="dx-cr__ck">{k}</span><span className="dx-cr__cv">{v}</span></div>
                  <span className="dx-cr__op">{ops[i]}</span>
                </Fragment>
              ))}
            </div>
            <div className="dx-cr__result">
              <span className="dx-cr__month">{usd(month)} / month</span>
              <span className="dx-cr__year">{usd(month * 12)} / year</span>
            </div>
            <div className="dx-cr__split">
              <div className="dx-cr__bar"><span className="dx-cr__bar-c" /><span className="dx-cr__bar-p" /></div>
              <div className="dx-cr__barlbl"><span className="dx-cr__g">Creator 20%</span><span>Protocol 80%</span></div>
            </div>
            <p className="dx-cr__note">Illustrative. Earnings depend on your market&apos;s actual trading volume.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
