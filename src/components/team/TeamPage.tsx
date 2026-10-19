"use client";

// Dexetera Team page body (hero + team cards + CTA strip).
// Markup and class names are a 1:1 port of design/source/Team.dc.html.
// Styles: ./team.css (scoped under .dx-team, pixel-identical to the design).
// The site's shared header and footer render around this component (from the root layout
// or the same wrapper the Contact and Whitepaper pages use). Do not duplicate them here.

import Link from "next/link";
import { useEffect, useRef } from "react";
import { TEAM, type TeamLink } from "./teamData";
import "./team.css";
import "./route.css";

function SocialIcon({ kind }: { kind: TeamLink["kind"] }) {
  if (kind === "x")
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78zm-1.08 16.2h1.7L7.4 4.73H5.58z" />
      </svg>
    );
  if (kind === "crunchbase")
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21.6 0H2.4A2.41 2.41 0 0 0 0 2.4v19.2A2.41 2.41 0 0 0 2.4 24h19.2a2.41 2.41 0 0 0 2.4-2.4V2.4A2.41 2.41 0 0 0 21.6 0zM7.045 14.465A2.11 2.11 0 0 0 9.84 13.42h1.66a3.69 3.69 0 1 1 0-1.75H9.84a2.11 2.11 0 1 0-2.795 2.795zm11.345.845a3.55 3.55 0 0 1-1.06.63 3.68 3.68 0 0 1-3.39-.38v.38h-1.51V5.37h1.5v4.11a3.74 3.74 0 0 1 1.8-.63H16a3.67 3.67 0 0 1 2.39 6.46zm-.223-2.766a2.104 2.104 0 1 1-4.207 0 2.104 2.104 0 0 1 4.207 0z" />
      </svg>
    );
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.7V21h-4z" />
    </svg>
  );
}

export default function TeamPage() {
  const heroRef = useRef<HTMLElement>(null);
  const rockL = useRef<HTMLDivElement>(null);
  const rockR = useRef<HTMLDivElement>(null);

  // Rock sizing + scroll parallax, ported 1:1 from the inline script in Team.dc.html.
  useEffect(() => {
    const hero = heroRef.current, L = rockL.current, R = rockR.current;
    if (!hero || !L || !R) return;
    const Li = L.firstElementChild as HTMLElement, Ri = R.firstElementChild as HTMLElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const size = () => {
      const w = innerWidth, D = w > 1024, T = w > 768;
      const dashW = D ? Math.min(880, w * 0.72) : T ? w * 0.86 : w - 32;
      const m = (w - dashW) / 2, ov = T ? 70 : 20;
      const sc = Math.max((m + ov) / 515, D ? 0 : (w * 0.22) / 515);
      L.style.width = (530 * sc).toFixed(1) + "px";
      R.style.width = (m + ov + 10 * sc).toFixed(1) + "px";
      L.style.height = R.style.height = (1080 * sc).toFixed(1) + "px";
      const bs = (1920 * sc).toFixed(1) + "px " + (1080 * sc).toFixed(1) + "px";
      Li.style.backgroundSize = Ri.style.backgroundSize = bs;
      Ri.style.backgroundPosition = (-1300 * sc).toFixed(1) + "px 0px";
    };
    const onScroll = () => {
      if (reduce || innerWidth <= 768) { L.style.transform = R.style.transform = ""; return; }
      const p = Math.min(1, Math.max(0, scrollY / (innerHeight * 0.8))), s2 = 1 + 0.12 * p;
      L.style.transform = `translateX(${(-28 * p).toFixed(2)}%) scale(${s2})`;
      R.style.transform = `translateX(${(28 * p).toFixed(2)}%) scale(${s2})`;
    };
    const onResize = () => { size(); onScroll(); };

    addEventListener("resize", onResize);
    addEventListener("scroll", onScroll, { passive: true });
    size(); onScroll();
    let raf = 0;
    if (reduce) hero.classList.add("in");
    else raf = requestAnimationFrame(() => { raf = requestAnimationFrame(() => hero.classList.add("in")); });

    return () => {
      removeEventListener("resize", onResize);
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="dx-team" style={{ ["--rocks" as string]: "url('/assets/hero_rocks.webp')" }}>
      <section className="hero compact" id="top" ref={heroRef}>
        <div className="rock l" ref={rockL}><i /></div>
        <div className="rock r" ref={rockR}><i /></div>
        <div className="grain" />
        <div className="hero-in">
          <span className="chip"><i />Team</span>
          <h1>The people building Dexetera.</h1>
          <p className="lede">A small team shipping a live exchange for real-world markets.</p>
        </div>
      </section>

      <div className="wrap">
        <section className="tsec">
          <div className="team">
            {TEAM.map((p, i) => (
              <article className={i === TEAM.length - 1 && TEAM.length % 2 === 1 ? "pc pc-solo" : "pc"} key={p.name}>
                <div className="pc-top">
                  <div className="ph" aria-hidden="true">
                    {p.photo ? <img src={p.photo} alt="" /> : p.initials}
                  </div>
                  <div>
                    <h2>{p.name}</h2>
                    <span className="role">{p.role}</span>
                  </div>
                </div>
                {p.bio ? <p className="bio">{p.bio}</p> : null}
                {p.tags.length > 0 ? (
                  <div className="tags">
                    {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                  </div>
                ) : null}
                {p.links.length > 0 ? (
                  <div className="soc">
                    {p.links.map((l) => (
                      <a key={l.href} href={l.href} aria-label={l.label} target="_blank" rel="noopener noreferrer">
                        <SocialIcon kind={l.kind} />
                      </a>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>

          <div className="strip">
            <div>
              <h3>Want to build with us?</h3>
              <p>Market creators, market makers and builders welcome.</p>
            </div>
            <div className="acts">
              <Link className="btn btn-p" href="/contact">Get in touch</Link>
              <Link className="btn btn-s" href="/whitepaper">Read the whitepaper</Link>
            </div>
          </div>
        </section>
      </div>
      <footer>
        <div className="ft">
          <div>
            <a className="brand" href="/"><img src="/dexetera-logo.svg" alt="" /><span>DEXETERA</span></a>
            <p>The marketplace for risk. Create a futures market on any number you can measure.</p>
          </div>
          <div><h5>Product</h5><a href="/#markets">Markets</a><a href="https://dexetera.xyz">Launch app</a><a href="https://dexetera.xyz/new-market">Create a market</a></div>
          <div><h5>Learn</h5><a href="/#how">How it works</a><a href="/whitepaper">Whitepaper</a></div>
          <div><h5>Company</h5><a href="#top">Team</a><a href="/contact">Contact</a><a href="https://x.com/dexeteralabs">X / Twitter</a><a href="mailto:admin@dexetera.xyz">admin@dexetera.xyz</a></div>
        </div>
        <div className="fb"><span>© 2026 Dexetera</span><span>Settled by public data</span></div>
      </footer>
    </div>
  );
}
