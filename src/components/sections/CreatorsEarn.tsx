"use client";
import "./creators.css";

const STEPS: [string, string][] = [
  ["List a number.", "Describe it in plain language and the wizard builds the market."],
  ["Traders trade it.", "Every fill pays a small fee."],
  ["You earn a share.", "Your share is paid per trade to your creator wallet."],
];

const PERKS: [string, string][] = [
  ["PAID", "Per trade, straight to your creator wallet"],
  ["DURATION", "For as long as the market trades"],
  ["CAP", "None"],
];

export default function CreatorsEarn() {
  return (
    <section className="dx-cr" data-screen-label="Creators" id="creators">
      <div className="dx-cr__card">
        <div className="dx-cr__left">
          <div className="dx-cr__eyebrow">Creators earn</div>
          <h2 className="dx-cr__title">List a market. Earn on every trade.</h2>
          <p className="dx-cr__lede">
            Every trade on Dexetera pays a small fee. A share of that fee goes straight to the wallet that
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
              <span className="dx-cr__label">CREATOR EARNINGS</span>
              <span className="dx-cr__pill">HOW IT WORKS</span>
            </div>
            <div className="dx-cr__eq" style={{ flexDirection: "column", alignItems: "stretch" }}>
              {PERKS.map(([k, v]) => (
                <div className="dx-cr__cell" key={k} style={{ flex: "none" }}><span className="dx-cr__ck">{k}</span><span className="dx-cr__cv" style={{ whiteSpace: "normal" }}>{v}</span></div>
              ))}
            </div>
            <div className="dx-cr__split">
              <div className="dx-cr__bar"><span className="dx-cr__bar-c" /><span className="dx-cr__bar-p" /></div>
              <div className="dx-cr__barlbl"><span className="dx-cr__g">Creator share</span><span>Protocol</span></div>
            </div>
            <p className="dx-cr__note">Earnings depend on your market&apos;s actual trading volume.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
