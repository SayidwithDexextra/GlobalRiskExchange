'use client';

import { useEffect } from 'react';
import { Header } from '@/components/Header';
import './whitepaper.css';
import './route.css';

export default function WhitepaperPage() {
  useEffect(() => {
    const hdr = document.getElementById('hdr');
    const bar = document.getElementById('progress');
    const pct = document.getElementById('pct');
    const L = document.getElementById('rockL');
    const R = document.getElementById('rockR');
    const hero = document.getElementById('top');
    const RK = document.getElementById('rocks');
    const lang = document.getElementById('hdrLang');
    const cre = document.getElementById('hdrCreate');
    const root = document.querySelector('.dx-whitepaper');
    const links = Array.from(root?.querySelectorAll('.toc a') ?? []);
    const secs = links.map((a) => document.querySelector(a.getAttribute('href') || ''));
    if (!L || !R || !hero || !RK || !bar) return;
    const rockL = L;
    const rockR = R;
    const heroEl = hero;
    const rocks = RK;
    const progress = bar;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function size() {
      const w = window.innerWidth;
      const D = w > 1024;
      const T = w > 768;
      const dashW = D ? Math.min(880, w * 0.72) : T ? w * 0.86 : w - 32;
      const m = (w - dashW) / 2;
      const ov = T ? 70 : 20;
      const sc = Math.max((m + ov) / 515, D ? 0 : (w * 0.22) / 515);
      rocks.style.zIndex = T ? '3' : '0';
      rockL.style.width = (530 * sc).toFixed(1) + 'px';
      rockL.style.height = (1080 * sc).toFixed(1) + 'px';
      rockR.style.width = (m + ov + 10 * sc).toFixed(1) + 'px';
      rockR.style.height = (1080 * sc).toFixed(1) + 'px';
      const bs = (1920 * sc).toFixed(1) + 'px ' + (1080 * sc).toFixed(1) + 'px';
      const li = rockL.firstChild as HTMLElement;
      const ri = rockR.firstChild as HTMLElement;
      li.style.backgroundSize = bs;
      ri.style.backgroundSize = bs;
      ri.style.backgroundPosition = (-1300 * sc).toFixed(1) + 'px 0px';
      if (lang) lang.style.display = w >= 1180 ? 'flex' : 'none';
      if (cre) cre.style.display = w >= 1000 ? 'flex' : 'none';
    }
    function onScroll() {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      hdr?.classList.toggle('scrolled', y > 24);
      const p = h > 0 ? Math.min(1, y / h) : 0;
      progress.style.width = (p * 100) + '%';
      if (pct) pct.textContent = Math.round(p * 100) + '%';
      if (reduce || window.innerWidth <= 768) {
        rockL.style.transform = '';
        rockR.style.transform = '';
      } else {
        const t = Math.min(1, Math.max(0, (y - heroEl.offsetTop) / (window.innerHeight * 0.8)));
        rockL.style.transform = 'translateX(' + (-28 * t).toFixed(2) + '%) scale(' + (1 + 0.12 * t) + ')';
        rockR.style.transform = 'translateX(' + (28 * t).toFixed(2) + '%) scale(' + (1 + 0.12 * t) + ')';
      }
      let cur = 0;
      secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < 140) cur = i; });
      links.forEach((a, i) => a.classList.toggle('on', i === cur));
    }
    function onResize() { size(); onScroll(); }
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    size();
    onScroll();
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        (rockL.firstChild as HTMLElement).style.transform = 'scale(1)';
        (rockR.firstChild as HTMLElement).style.transform = 'scale(1)';
      });
    });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
      <Header currentPath="/whitepaper" />
      <div className="dx-whitepaper" style={{ ['--rocks' as string]: "url('/hero_rocks.webp')" }}>
        <div className='progress' id='progress'></div>
        <section className='hero' id='top'>
        <div aria-hidden='true' id='rocks' style={{position: 'absolute', inset: '0', pointerEvents: 'none', WebkitMaskImage: 'linear-gradient(to bottom,#000 calc(100% - 220px),transparent)', maskImage: 'linear-gradient(to bottom,#000 calc(100% - 220px),transparent)'}}>
        <div id='rockL' style={{position: 'absolute', left: '0', bottom: '0', transformOrigin: 'left bottom', willChange: 'transform'}}><div className='rk' style={{width: '100%', height: '100%', backgroundImage: 'var(--rocks)', backgroundRepeat: 'no-repeat', backgroundPosition: '0px 0px', transform: 'scale(1.08)', transformOrigin: 'left bottom', transition: 'transform 1200ms cubic-bezier(.2,.7,.2,1)'}}></div></div>
        <div id='rockR' style={{position: 'absolute', right: '0', bottom: '0', transformOrigin: 'right bottom', willChange: 'transform'}}><div className='rk' style={{width: '100%', height: '100%', backgroundImage: 'var(--rocks)', backgroundRepeat: 'no-repeat', transform: 'scale(1.08)', transformOrigin: 'right bottom', transition: 'transform 1200ms cubic-bezier(.2,.7,.2,1)'}}></div></div>
        </div>
        <div className='grain'></div>
        <div className='hero-in'>
        <span className='chip'><i></i>Whitepaper</span>
        <h1><span className='g'>Commercial risk,</span>made tradable.</h1>
        <p className='lede'>Bringing business risk on-chain. An on-chain marketplace for risk, built on Dexetera.</p>
        <div className='cta'>
        <a className='btn btn-w' href='#summary'>Start reading <svg width='14' height='14' viewBox='0 0 14 14' fill='none'><path d='M3 7h8M7.5 3.5L11 7l-3.5 3.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg></a>
        <a className='btn btn-d' href='https://dexetera.xyz'>Launch app</a>
        </div>
        <div className='cover'>
        <div className='l'>
        <div className='k'>Commercial Risk Markets</div>
        <h3>If a risk can be measured, it can be traded.</h3>
        <p>How any objectively measurable economic variable becomes a standardized, continuously traded market that settles against public data.</p>
        </div>
        <div className='r'>
        <div><div className='k'>Chapters</div><div className='v'>07</div></div>
        <div><div className='k'>Reading time</div><div className='v'>14 min</div></div>
        <div><div className='k'>Collateral</div><div className='v'>USDC</div></div>
        <div><div className='k'>Settlement</div><div className='v'>UMA Optimistic Oracle</div></div>
        <div><div className='k'>Market type</div><div className='v'>Scalar futures</div></div>
        <div><div className='k'>Trading</div><div className='v'>On-chain orderbook</div></div>
        </div>
        </div>
        </div>
        <div className='scrollhint'><svg width='12' height='14' viewBox='0 0 12 14' fill='none'><rect x='1' y='1' width='10' height='12' rx='5' stroke='currentColor' /><path d='M6 4v2' stroke='currentColor' strokeLinecap='round' /></svg>Scroll to read</div>
        </section>
        <div className='doc'>
        <aside className='toc'>
        <span className='eyebrow'>Contents</span>
        <a href='#summary'><span>00</span>Executive Summary</a>
        <a href='#problem'><span>01</span>The Problem</a>
        <a href='#existing'><span>02</span>Why Existing Markets Stop Short</a>
        <a href='#opportunity'><span>03</span>The Opportunity</a>
        <a href='#protocol'><span>04</span>The Protocol</a>
        <a href='#customers'><span>05</span>The Customer Model</a>
        <a href='#onchain'><span>06</span>Why On-Chain Markets Matter</a>
        <a href='#vision'><span>07</span>Long Term Vision</a>
        <a href='#links'><span>08</span>Links</a>
        <div className='meta'>
        <span className='eyebrow'>Reading</span>
        <div className='v' id='pct'>0%</div>
        </div>
        </aside>
        <main className='body'>
        <section className='ch' id='summary'>
        <div className='num'>00 / Executive Summary</div>
        <h2><span className='g'>Every business decides</span>under uncertainty.</h2>
        <p className='intro'>Every business makes decisions under uncertainty. A festival operator worries about attendance. A data center worries about the price of electricity and GPUs. A manufacturer worries about commodity and freight costs. A conference organizer worries about consumer confidence and travel demand.</p>
        <p>These exposures are not abstract. They determine whether a season is profitable or ruinous, whether a facility is built, whether a product ships. Collectively they represent trillions of dollars of economic risk, and yet only a small fraction of it can be efficiently hedged through today's financial system.</p>
        <p>Commercial risk transfer is still dominated by private negotiations between banks, brokers, insurers, and large corporations. These over the counter (OTC) markets are opaque, expensive, relationship gated, and inaccessible to the vast majority of businesses. For most companies, the only realistic option is to absorb the risk and hope.</p>
        <p>This paper proposes a new category of financial infrastructure: <strong>an on-chain marketplace for risk.</strong> These are decentralized commercial risk markets that settle against existing, authoritative public data sources. By turning any objectively measurable economic variable into a standardized, continuously traded market, businesses can hedge real world exposures transparently, without brokers, minimum ticket sizes, or institutional relationships.</p>
        <p>The objective is not to replace insurance or traditional derivatives. It is to make commercial risk transfer more accessible, more liquid, and more efficient, and to expand the universe of risks that can be hedged at all.</p>
        <p>Dexetera is permissionless infrastructure for that marketplace. Anyone can create a market on any measurable metric, trade it on an on-chain orderbook with USDC collateral, and settle from verifiable public evidence secured by UMA's Optimistic Oracle.</p>
        <div className='pull'>No exchange. No gatekeeper. No one who controls the outcome.</div>
        </section>
        <section className='ch' id='problem'>
        <div className='num'>01 / The Problem</div>
        <h2><span className='g'>Every business is exposed</span>to risks it cannot control.</h2>
        <ul className='list'>
        <li>A festival cannot control national travel demand.</li>
        <li>A conference cannot control consumer confidence.</li>
        <li>A cloud provider cannot control GPU prices.</li>
        <li>A manufacturer cannot control freight costs.</li>
        <li>A data center cannot control electricity prices.</li>
        </ul>
        <p>Each of these variables has a direct, measurable impact on profitability. Yet when a business wants to protect itself against an adverse move, it has only three options:</p>
        <div className='grid3'>
        <div className='card'><div className='k'>Option 01</div><h4>Absorb the risk</h4><p>Carry the exposure on the balance sheet and accept the volatility.</p></div>
        <div className='card'><div className='k'>Option 02</div><h4>Purchase insurance</h4><p>Where a product even exists for the exposure.</p></div>
        <div className='card'><div className='k'>Option 03</div><h4>Negotiate a hedge</h4><p>A customized hedge with a bank or dealer, through a bespoke OTC contract.</p></div>
        </div>
        <p>For most businesses, only the first option is realistically available.</p>
        <p>Insurance is designed for catastrophic, binary events such as a fire, a flood, or a total loss. It is not designed for the continuous, ongoing volatility that actually erodes margins. It pays out on a claim, not on a gradual, quantitative move in an economic variable.</p>
        <p>OTC derivatives, meanwhile, require specialized legal agreements (ISDA documentation), institutional relationships, large minimum transaction sizes, and credit underwriting. These requirements exclude nearly every small and mid sized business, and even many large ones, from hedging anything outside a handful of standardized markets.</p>
        <p>The result is that enormous amounts of economic risk remain unmanaged, not because businesses do not want to hedge, but because the infrastructure to do so does not exist.</p>
        </section>
        <section className='ch' id='existing'>
        <div className='num'>02 / Why Existing Markets Stop Short</div>
        <h2><span className='g'>Markets standardized</span>only a thin frontier.</h2>
        <p className='intro'>Financial markets have successfully standardized only a small subset of commercial risks.</p>
        <div className='fig'>
        <div className='fig-h'><span className='k'>Fig. 1  Hedgeable today vs. measurable but untradeable</span><span className='k'>Illustrative</span></div>
        <svg viewBox='0 0 760 300' fill='none' fontFamily='JetBrains Mono, monospace'>
        <circle cx='380' cy='150' r='128' stroke='#222' strokeDasharray='2 5' />
        <circle cx='380' cy='150' r='62' fill='#141414' stroke='#333' />
        <text x='380' y='138' fill='#fff' fontSize='10' textAnchor='middle' letterSpacing='1.2'>HEDGEABLE</text>
        <text x='380' y='154' fill='#808080' fontSize='9' textAnchor='middle'>oil · gas · rates</text>
        <text x='380' y='168' fill='#808080' fontSize='9' textAnchor='middle'>FX · equities · ags</text>
        <g fontSize='9.5' fill='#A1A1A1'>
        <g><rect x='40' y='34' width='168' height='28' rx='6' fill='#0F0F0F' stroke='#222' /><text x='54' y='52'>Air travel demand</text></g>
        <g><rect x='40' y='96' width='168' height='28' rx='6' fill='#0F0F0F' stroke='#222' /><text x='54' y='114'>Consumer confidence</text></g>
        <g><rect x='40' y='158' width='168' height='28' rx='6' fill='#0F0F0F' stroke='#222' /><text x='54' y='176'>Disease surveillance</text></g>
        <g><rect x='40' y='220' width='168' height='28' rx='6' fill='#0F0F0F' stroke='#222' /><text x='54' y='238'>Port throughput</text></g>
        <g><rect x='552' y='52' width='168' height='28' rx='6' fill='#0F0F0F' stroke='#222' /><text x='566' y='70'>GPU pricing</text></g>
        <g><rect x='552' y='128' width='168' height='28' rx='6' fill='#0F0F0F' stroke='#222' /><text x='566' y='146'>Data center utilization</text></g>
        <g><rect x='552' y='204' width='168' height='28' rx='6' fill='#0F0F0F' stroke='#222' /><text x='566' y='222'>Electricity, grid load</text></g>
        </g>
        <g stroke='#333'><path d='M208 48 C270 48 290 110 318 130' /><path d='M208 110 C260 110 290 138 318 146' /><path d='M208 172 C260 172 290 160 318 156' /><path d='M208 234 C270 234 290 190 320 172' /><path d='M552 66 C490 66 470 120 442 134' /><path d='M552 142 C500 142 470 148 442 150' /><path d='M552 218 C490 218 470 180 440 168' /></g>
        <g fill='#606060' fontSize='8.5' letterSpacing='1'><text x='40' y='22'>MEASURABLE, NO MARKET</text><text x='720' y='40' textAnchor='end'>MEASURABLE, NO MARKET</text></g>
        </svg>
        <div className='fig-c'>Thousands of variables are published by credible institutions, yet sit outside the small circle of risks with a standardized market.</div>
        </div>
        <p>Today a business can readily hedge:</p>
        <ul className='list'>
        <li>Oil and natural gas</li><li>Interest rates</li><li>Foreign exchange</li><li>Equity indices</li><li>A small set of agricultural and metals commodities</li>
        </ul>
        <p>A few specialized risks, such as weather derivatives, exist, but almost entirely inside illiquid OTC markets accessible only to large players.</p>
        <p>Beyond that thin frontier, thousands of economically significant variables remain untradeable, despite being objectively measurable and published by credible institutions:</p>
        <ul className='list'>
        <li>National air travel demand</li><li>Consumer confidence</li><li>Public health and disease surveillance indicators</li><li>Freight congestion and port throughput</li><li>GPU availability and pricing</li><li>Data center utilization</li><li>Electricity and grid load</li>
        </ul>
        <p>These variables influence billions of dollars of business activity every year. Authoritative data on each is published regularly by trusted sources. And yet no standardized market exists to transfer the risk, because the cost of building, listing, and operating a conventional exchange traded product for each one is prohibitive.</p>
        <p>The reason is structural. Traditional markets standardize a risk only when the expected volume justifies the fixed cost of regulatory approval, clearing infrastructure, and market maker incentives. Everything below that threshold, which is to say almost everything, defaults to private negotiation or goes unhedged entirely.</p>
        </section>
        <section className='ch' id='opportunity'>
        <div className='num'>03 / The Opportunity</div>
        <h2><span className='g'>Blockchain collapses</span>coordination costs.</h2>
        <p className='intro'>Historically, commercial hedging required intermediaries because coordinating a market is expensive. Someone has to define the contract, list it, clear it, hold collateral, discover the price, and adjudicate settlement. Each of those functions carried a cost that only large, standardized markets could amortize.</p>
        <p>A decentralized, on-chain marketplace for risk makes it economically feasible to stand up markets that were previously too small, too fragmented, or too expensive to support. Specifically, it enables:</p>
        <div className='grid3'>
        <div className='card'><div className='k'>01</div><h4>Continuous trading</h4><p>Markets that price risk in real time, not at the pace of quarterly renegotiation.</p></div>
        <div className='card'><div className='k'>02</div><h4>Transparent pricing</h4><p>A public orderbook where every participant sees the same bid and ask.</p></div>
        <div className='card'><div className='k'>03</div><h4>Objective settlement</h4><p>Contracts that resolve against published, verifiable data rather than a counterparty's discretion.</p></div>
        <div className='card'><div className='k'>04</div><h4>Global participation</h4><p>Access defined by an internet connection and collateral, not geography or institutional standing.</p></div>
        <div className='card'><div className='k'>05</div><h4>Programmable collateral</h4><p>Margin and payouts enforced by code, not by credit departments.</p></div>
        <div className='card'><div className='k'>06</div><h4>Reduced counterparty risk</h4><p>Collateral held in a non-custodial vault, not on a dealer's balance sheet.</p></div>
        </div>
        <p>Instead of negotiating a bespoke contract with a bank, a business can access a standardized market built around publicly verifiable economic data. This is the new financial primitive: open commercial risk markets, where the barrier to hedging a risk is no longer "will an institution build this for me?" but simply "does credible public data measure it?"</p>
        </section>
        <section className='ch' id='protocol'>
        <div className='num'>04 / The Protocol</div>
        <h2><span className='g'>From idea to market</span>to verified payout.</h2>
        <p className='intro'>Dexetera is the infrastructure that makes an on-chain marketplace for risk real. It is a permissionless protocol that lets anyone turn a measurable economic variable into a scalar futures market, a position on a continuous number, and lets anyone trade it, with settlement secured trustlessly by public evidence and UMA's Optimistic Oracle.</p>
        <p>The protocol is three tightly linked systems that carry a real world risk from <em>idea</em> to <em>tradable market</em> to <em>final, verified payout.</em></p>
        <div className='fig'>
        <div className='fig-h'><span className='k'>Fig. 2  Three linked systems</span><span className='k'>Create · Trade · Settle</span></div>
        <svg viewBox='0 0 760 220' fill='none' fontFamily='JetBrains Mono, monospace'>
        <defs><radialGradient id='wg' cx='50%' cy='50%' r='50%'><stop offset='0' stopColor='#fff' stopOpacity='.10' /><stop offset='1' stopColor='#fff' stopOpacity='0' /></radialGradient></defs>
        <g>
        <rect x='24' y='46' width='208' height='128' rx='12' fill='#141414' stroke='#222' />
        <circle cx='48' cy='72' r='4' fill='#8B5CF6' /><text x='60' y='76' fill='#fff' fontSize='10.5' letterSpacing='1'>CREATE</text>
        <text x='40' y='104' fill='#A1A1A1' fontSize='9.5'>Market Creation Wizard</text>
        <text x='40' y='122' fill='#808080' fontSize='9'>metric · source URL</text>
        <text x='40' y='138' fill='#808080' fontSize='9'>settlement date · start price</text>
        <text x='40' y='158' fill='#606060' fontSize='8.5'>Diamond proxy (EIP-2535)</text>
        </g>
        <g>
        <ellipse cx='380' cy='110' rx='140' ry='90' fill='url(#wg)' />
        <rect x='276' y='46' width='208' height='128' rx='12' fill='#141414' stroke='#333' />
        <circle cx='300' cy='72' r='4' fill='#fff' /><text x='312' y='76' fill='#fff' fontSize='10.5' letterSpacing='1'>TRADE</text>
        <text x='292' y='104' fill='#A1A1A1' fontSize='9.5'>On-chain orderbook</text>
        <text x='292' y='124' fill='#4ADE80' fontSize='9'>BID  5,390   12</text>
        <text x='292' y='140' fill='#F87171' fontSize='9'>ASK  5,410    8</text>
        <text x='292' y='158' fill='#606060' fontSize='8.5'>USDC in CoreVault</text>
        </g>
        <g>
        <rect x='528' y='46' width='208' height='128' rx='12' fill='#141414' stroke='#222' />
        <circle cx='552' cy='72' r='4' fill='#FACC15' /><text x='564' y='76' fill='#fff' fontSize='10.5' letterSpacing='1'>SETTLE</text>
        <text x='544' y='104' fill='#A1A1A1' fontSize='9.5'>Propose · challenge</text>
        <text x='544' y='122' fill='#808080' fontSize='9'>evidence hashed on-chain</text>
        <text x='544' y='138' fill='#808080' fontSize='9'>UMA Optimistic Oracle</text>
        <text x='544' y='158' fill='#606060' fontSize='8.5'>SettlementManager pays out</text>
        </g>
        <g stroke='#333'><path d='M232 110 H276' /><path d='M484 110 H528' /></g>
        <circle r='2.5' fill='#fff'><animateMotion dur='2.4s' repeatCount='indefinite' path='M232 110 H276' /></circle>
        <circle r='2.5' fill='#fff'><animateMotion dur='2.4s' begin='1.2s' repeatCount='indefinite' path='M484 110 H528' /></circle>
        <text x='380' y='204' fill='#606060' fontSize='8.5' textAnchor='middle' letterSpacing='1'>ALL MARKETS SHARE ONE FACETREGISTRY</text>
        </svg>
        </div>
        <h3 className='sub'><span>4.1</span>Permissionless Market Creation</h3>
        <p>Anyone can deploy a new risk market. There is no listing committee and no exchange approval.</p>
        <ul className='list'>
        <li>Creation runs through a guided Market Creation Wizard (metric, then trading configuration, then settlement and oracle configuration, then review and deploy), with an AI assistant that validates the metric and suggests a fair starting price.</li>
        <li>Each market is deployed as its own on-chain Diamond (EIP-2535) proxy with isolated per market storage, so a problem in one market can never affect another.</li>
        <li>All markets share a single global <code>FacetRegistry</code>, so trading and settlement logic can be improved atomically across every market at once, without touching any individual market's funds or positions.</li>
        <li>A creator defines the metric, its canonical public data source (URL), a settlement date (from one day to one year out), a starting price, and descriptive tags. A creation fee and a refundable creator bond keep spam out, and creators earn 20% of the trading fees their market generates, ongoing.</li>
        <li>Creation can be gasless. The creator signs an EIP-712 message and a relayer submits the transaction.</li>
        </ul>
        <div className='pull'>Markets are scalar futures, not binary bets. A business takes a continuous position on how high or how low a real economic variable will settle, which is exactly the shape of a genuine hedge.</div>
        <h3 className='sub'><span>4.2</span>Market Selection Framework</h3>
        <p>Not every number makes a good risk market. To function as durable commercial infrastructure rather than a novelty, a listed market should satisfy four requirements.</p>
        <div className='grid2'>
        <div className='card'><div className='k'>01</div><h4>Publicly Verifiable</h4><p>The settlement value must be published by an independent, trusted source that can be archived and audited after the fact. Examples: TSA passenger throughput, CDC surveillance data, Bureau of Labor Statistics releases, Energy Information Administration (EIA) data, NOAA weather and climate data, The Conference Board (consumer confidence).</p></div>
        <div className='card'><div className='k'>02</div><h4>Commercial Relevance</h4><p>The metric must materially affect business profitability. A market exists to transfer real exposure, not to manufacture it.</p></div>
        <div className='card'><div className='k'>03</div><h4>Natural Two Sided Demand</h4><p>One industry's cost exposure should correspond to another industry's revenue or economic exposure. When a rise in a variable helps one business and hurts another, both have a reason to trade, creating sustainable commercial participation beyond speculation.</p></div>
        <div className='card'><div className='k'>04</div><h4>Standardization</h4><p>Every participant trades the same contract. This lets liquidity concentrate in one deep market rather than fragmenting across countless bespoke agreements, the core efficiency that OTC markets can never achieve.</p></div>
        </div>
        <p>The best markets track a number that is continuously observable (it moves on its own, so there is always a reason for longs and shorts to disagree) and settles from a credible, public, archivable source. Metrics that sit frozen until a single reveal event trade poorly and make weak hedges. Variables that tick week to week make strong ones.</p>
        <h3 className='sub'><span>4.3</span>On-Chain Orderbook Trading</h3>
        <p>Unlike AMM or pool based platforms, Dexetera runs a true on-chain orderbook, the market structure institutions actually recognize as a market.</p>
        <ul className='list'>
        <li>Traders deposit USDC into a shared, non-custodial <code>CoreVault</code> that holds collateral, positions, and margin.</li>
        <li>They open long or short positions using limit and market orders (with slippage protection), matched by an on-chain matching engine with real bid and ask price discovery.</li>
        <li>A mark price derived from market activity drives unrealized PnL and liquidation thresholds. Keeper callable liquidation protects protocol solvency.</li>
        <li>Every order, fill, and cancellation is recorded on-chain. Gasless (meta) trading is supported via signed sessions and relayers.</li>
        </ul>
        <p>For a hedger, this means a festival can <em>short</em> a travel demand market to offset weak attendance, while an airline or hotel chain, whose revenue rises with the same variable, takes the natural <em>long</em>. Their opposing commercial exposures meet in a transparent, continuously priced market.</p>
        <h3 className='sub'><span>4.4</span>Metric Tracking and Trustless Settlement</h3>
        <p>This is what makes "any measurable risk" both real and safe to settle.</p>
        <p><strong>Metric tracking.</strong> Each market carries its own defined data source. An AI metric worker reads and analyzes the source at creation and near settlement, proposing values with confidence and reasoning, and feeds a time series for charting.</p>
        <p><strong>Settlement lifecycle.</strong> Markets move through the states Unsettled, Rollover, ChallengeWindow, and Settled, automated by scheduled jobs:</p>
        <div className='fig'>
        <div className='fig-h'><span className='k'>Fig. 3  Settlement lifecycle</span><span className='k'>Optimistic</span></div>
        <svg viewBox='0 0 760 170' fill='none' fontFamily='JetBrains Mono, monospace'>
        <path d='M60 70 H700' stroke='#333' />
        <rect x='250' y='56' width='250' height='28' rx='14' fill='#FACC15' fillOpacity='.08' stroke='#FACC15' strokeOpacity='.5' />
        <text x='375' y='74' fill='#FACC15' fontSize='9' textAnchor='middle' letterSpacing='1.2'>CHALLENGE WINDOW</text>
        <g fontSize='9' letterSpacing='1'>
        <circle cx='60' cy='70' r='7' fill='#0F0F0F' stroke='#A1A1A1' /><text x='60' y='44' fill='#fff' textAnchor='middle'>UNSETTLED</text><text x='60' y='104' fill='#808080' textAnchor='middle' letterSpacing='0'>open to trade</text>
        <circle cx='170' cy='70' r='7' fill='#0F0F0F' stroke='#A1A1A1' /><text x='170' y='44' fill='#fff' textAnchor='middle'>ROLLOVER</text><text x='170' y='104' fill='#808080' textAnchor='middle' letterSpacing='0'>trading pauses</text>
        <circle cx='290' cy='70' r='5' fill='#FACC15' /><text x='290' y='104' fill='#808080' textAnchor='middle' letterSpacing='0'>propose value</text><text x='290' y='120' fill='#606060' textAnchor='middle' letterSpacing='0'>+ evidence hash</text>
        <circle cx='460' cy='70' r='5' fill='#FACC15' /><text x='460' y='104' fill='#808080' textAnchor='middle' letterSpacing='0'>challenge with bond</text><text x='460' y='120' fill='#606060' textAnchor='middle' letterSpacing='0'>→ UMA DVM vote</text>
        <circle cx='700' cy='70' r='8' fill='#fff' /><text x='700' y='44' fill='#fff' textAnchor='middle'>SETTLED</text><text x='700' y='104' fill='#808080' textAnchor='middle' letterSpacing='0'>vault pays PnL</text>
        </g>
        <circle r='3' fill='#fff'><animateMotion dur='5s' repeatCount='indefinite' path='M60 70 H700' /></circle>
        <text x='380' y='156' fill='#606060' fontSize='8.5' textAnchor='middle' letterSpacing='1'>POSITIONS CLOSE AT THE ORACLE VERIFIED PRICE, NOT THE MARK PRICE</text>
        </svg>
        </div>
        <ol className='steps'>
        <li>At the settlement date, trading pauses and a challenge window opens.</li>
        <li>Anyone can propose the final settlement value, with on-chain evidence (for example a screenshot and a Wayback Machine archive of the source, hashed on-chain for immutability).</li>
        <li>Anyone can challenge the proposal by posting a bond.</li>
        <li>Disputes escalate to UMA's Optimistic Oracle and DVM, where the correct answer is decided by tokenholder vote.</li>
        <li>Once resolved, positions close at the oracle verified settlement price (not the mark price), and the vault pays out PnL, with bad debt haircuts and batch settlement for very large markets.</li>
        </ol>
        <p>Settlement is optimistic. A proposal is assumed correct unless it is economically worth challenging. Honest settlement therefore happens without constant oracle intervention, while the bond mechanics make dishonest settlement unprofitable. The evidence chain means that even months later, anyone can independently verify that a market resolved correctly.</p>
        <h3 className='sub'><span>4.5</span>How the Pieces Fit Together</h3>
        <p>The lifecycle of a market runs end to end as follows:</p>
        <ol className='steps'>
        <li>A creator defines a metric in the Market Creation Wizard, assisted by AI, and deploys it through the <code>FuturesMarketFactoryV2</code> as its own Diamond market proxy.</li>
        <li>Every market proxy shares global trading and settlement logic through the <code>FacetRegistry</code>, while keeping its own orderbook and storage.</li>
        <li>A hedger or counterparty deposits USDC into the <code>CoreVault</code> and places limit or market orders.</li>
        <li>The on-chain matching engine fills orders and records positions and margin in the <code>CoreVault</code>.</li>
        <li>When the settlement date is reached, trading pauses and anyone may propose the final value.</li>
        <li>If the proposal is challenged, the dispute escalates to UMA's Optimistic Oracle and DVM.</li>
        <li>The <code>SettlementManager</code> closes positions at the verified price, and the vault pays out.</li>
        </ol>
        </section>
        <section className='ch' id='customers'>
        <div className='num'>05 / The Customer Model</div>
        <h2><span className='g'>Three groups whose interests</span>complement one another.</h2>
        <p className='intro'>An on-chain marketplace for risk works because it brings together three participant groups whose interests naturally complement one another.</p>
        <div className='fig'>
        <div className='fig-h'><span className='k'>Fig. 4  Natural counterparties meet in one market</span><span className='k'>Travel demand</span></div>
        <svg viewBox='0 0 760 230' fill='none' fontFamily='JetBrains Mono, monospace'>
        <defs><radialGradient id='wg2' cx='50%' cy='50%' r='50%'><stop offset='0' stopColor='#fff' stopOpacity='.09' /><stop offset='1' stopColor='#fff' stopOpacity='0' /></radialGradient></defs>
        <rect x='28' y='40' width='200' height='104' rx='12' fill='#141414' stroke='#222' />
        <text x='46' y='66' fill='#606060' fontSize='8.5' letterSpacing='1.2'>COMMERCIAL HEDGER</text>
        <text x='46' y='90' fill='#fff' fontSize='11'>Festival</text>
        <text x='46' y='110' fill='#808080' fontSize='9'>fears LOW travel demand</text>
        <text x='46' y='130' fill='#F87171' fontSize='9.5' letterSpacing='1'>SHORT</text>
        <rect x='532' y='40' width='200' height='104' rx='12' fill='#141414' stroke='#222' />
        <text x='550' y='66' fill='#606060' fontSize='8.5' letterSpacing='1.2'>NATURAL COUNTERPARTY</text>
        <text x='550' y='90' fill='#fff' fontSize='11'>Airline · hotel chain</text>
        <text x='550' y='110' fill='#808080' fontSize='9'>benefits from HIGH demand</text>
        <text x='550' y='130' fill='#4ADE80' fontSize='9.5' letterSpacing='1'>LONG</text>
        <ellipse cx='380' cy='92' rx='110' ry='70' fill='url(#wg2)' />
        <rect x='290' y='56' width='180' height='72' rx='12' fill='#0F0F0F' stroke='#333' />
        <text x='380' y='82' fill='#606060' fontSize='8.5' textAnchor='middle' letterSpacing='1.2'>ONE STANDARD MARKET</text>
        <text x='380' y='106' fill='#fff' fontSize='11' textAnchor='middle'>TSA throughput</text>
        <path d='M228 92 H290' stroke='#333' /><path d='M470 92 H532' stroke='#333' />
        <circle r='2.5' fill='#F87171'><animateMotion dur='2.2s' repeatCount='indefinite' path='M228 92 H290' /></circle>
        <circle r='2.5' fill='#4ADE80'><animateMotion dur='2.2s' repeatCount='indefinite' path='M532 92 H470' /></circle>
        <rect x='290' y='168' width='180' height='40' rx='12' fill='#141414' stroke='#222' />
        <text x='380' y='192' fill='#A1A1A1' fontSize='9' textAnchor='middle' letterSpacing='1'>LIQUIDITY PROVIDERS</text>
        <path d='M380 168 V128' stroke='#333' strokeDasharray='3 4' />
        <text x='486' y='192' fill='#606060' fontSize='8.5'>bridge timing gaps, tighten spreads</text>
        </svg>
        </div>
        <h3 className='sub'><span>5.1</span>Commercial Hedgers</h3>
        <p>Businesses seeking predictable financial outcomes. They come to the market to <em>reduce</em> risk. Examples:</p>
        <ul className='list'>
        <li>Festivals, sporting events, and conferences hedging attendance and travel demand</li>
        <li>Data centers hedging electricity and GPU prices</li>
        <li>Manufacturers hedging commodity and input costs</li>
        <li>Logistics companies hedging fuel and freight costs</li>
        </ul>
        <p>Their objective is not profit from the market itself. It is to convert an uncertain future cost or revenue into a known one.</p>
        <h3 className='sub'><span>5.2</span>Natural Counterparties</h3>
        <p>Businesses whose economics move in the opposite direction to a given hedger. When one company's costs rise with a variable and another's revenue rises with the same variable, they are natural counterparties.</p>
        <p>A festival fears <em>low</em> travel demand, while an airline benefits from <em>high</em> travel demand. A data center fears <em>high</em> electricity prices, while a power producer benefits from them. When these participants trade against each other, they offset commercial risk <em>and</em> sharpen price discovery, turning what would otherwise be a zero sum speculation into genuine risk transfer between real economic actors.</p>
        <h3 className='sub'><span>5.3</span>Liquidity Providers</h3>
        <p>Institutional and individual capital providers who earn returns by supplying liquidity to markets where natural buyers and sellers are temporarily imbalanced. They bridge the timing gaps between hedgers and their natural counterparties, tighten spreads, and are compensated for warehousing risk.</p>
        <p>For liquidity providers, an on-chain marketplace for risk is a new asset class: a source of returns uncorrelated with traditional markets, accessible without the institutional infrastructure that gates OTC derivatives desks today.</p>
        </section>
        <section className='ch' id='onchain'>
        <div className='num'>06 / Why On-Chain Markets Matter</div>
        <h2><span className='g'>Expanding the universe</span>of hedgeable risks.</h2>
        <p className='intro'>Moving commercial risk on-chain is not about replacing existing exchanges. It is about expanding the universe of hedgeable risks.</p>
        <p>Today, only a small number of economic variables generate enough volume to justify a conventional exchange traded market. Everything else defaults to private negotiation, or simply goes unhedged.</p>
        <p>Blockchain changes the economics. When market creation is permissionless, collateral is programmable, settlement is objective, and infrastructure is shared across every market via a common registry, the fixed cost of standing up a new market collapses toward zero. Markets that were previously too small, too fragmented, or too expensive to support suddenly become viable.</p>
        <p>This lowers the barrier to entry for businesses while increasing transparency and competition in commercial risk transfer. A protocol level comparison makes the shift concrete:</p>
        <div className='tbl'>
        <table className='cmp'>
        <thead><tr><th>Dimension</th><th>CEX Futures</th><th>Most Perp DEXs</th><th>OTC / Insurance</th><th className='dx'>Dexetera</th></tr></thead>
        <tbody>
        <tr><td>Who can list</td><td>Exchange only</td><td>Team / governance</td><td>Dealer / underwriter</td><td className='dx'>Anyone</td></tr>
        <tr><td>What you can hedge</td><td>A handful of products</td><td>Mostly crypto</td><td>Bespoke, negotiated</td><td className='dx'>Any measurable metric</td></tr>
        <tr><td>Trading model</td><td>Orderbook</td><td>AMM / mark price</td><td>Private negotiation</td><td className='dx'>On-chain orderbook</td></tr>
        <tr><td>Access</td><td>Institutional</td><td>Retail crypto</td><td>Relationship gated</td><td className='dx'>Open, global</td></tr>
        <tr><td>Custody</td><td>Custodial</td><td>Non-custodial</td><td>Counterparty balance sheet</td><td className='dx'>Non-custodial (USDC in CoreVault)</td></tr>
        <tr><td>Settlement</td><td>Centralized</td><td>Mark price / funding</td><td>Counterparty discretion</td><td className='dx'>Optimistic proposal plus UMA DVM</td></tr>
        </tbody>
        </table>
        </div>
        </section>
        <section className='ch' id='vision'>
        <div className='num'>07 / Long Term Vision</div>
        <h2><span className='g'>If a risk can be measured,</span>it can be traded.</h2>
        <p className='intro'>The long term vision is a world where businesses no longer need bespoke financial products to manage ordinary commercial uncertainty.</p>
        <p>Any objectively measurable economic variable, from air travel demand to GPU pricing to port throughput, can become a standardized, continuously traded financial market. Businesses gain access to transparent, on demand risk transfer. Liquidity providers gain access to a new asset class. And the economy as a whole becomes more efficient at distributing uncertainty to the participants best able to bear it.</p>
        <p>Commercial risk becomes as accessible to hedge as foreign exchange or commodities are today.</p>
        <div className='pull'>The question becomes not "who will let me hedge this?" but simply "what risk do I want to transfer?"</div>
        <div className='cta' style={{justifyContent: 'flex-start', marginTop: '28px'}}>
        <a className='btn btn-w' href='https://dexetera.xyz'>Launch app</a>
        <a className='btn btn-d' href='/#markets'>Explore markets</a>
        </div>
        </section>
        <section className='ch' id='links'>
        <div className='num'>08 / Links</div>
        <div className='links'>
        <a href='https://www.dexetera.xyz'>www.dexetera.xyz<span>Website</span></a>
        <a href='https://dexetera.xyz'>dexetera.xyz<span>Application</span></a>
        <a href='https://doc.dexetera.org'>doc.dexetera.org<span>Documentation</span></a>
        <a href='https://x.com/dexeteralabs'>@dexeteralabs<span>Twitter</span></a>
        </div>
        <p className='disc'>This document is for informational purposes only and does not constitute financial or investment advice. Trading derivatives involves significant risk of loss.</p>
        </section>
        </main>
        </div>
        <footer>
        <div className='ft'>
        <div>
        <a className='brand' href='/'><img src='/dexetera-logo.svg' alt='' /><span>DEXETERA</span></a>
        <p>The marketplace for risk. Create a futures market on any number you can measure.</p>
        </div>
        <div><h5>Product</h5><a href='/#markets'>Markets</a><a href='https://dexetera.xyz'>Launch app</a><a href='https://dexetera.xyz/new-market'>Create a market</a></div>
        <div><h5>Learn</h5><a href='/#how'>How it works</a><a href='#top'>Whitepaper</a></div>
        <div><h5>Community</h5><a href='/team'>Team</a><a href='/contact'>Contact</a><a href='https://x.com/dexeteralabs'>X / Twitter</a><a href='https://www.dexetera.xyz'>Website</a></div>
        </div>
        <div className='fb'><span>© 2026 Dexetera</span><span>Settled by public data</span></div>
        </footer>
      </div>
    </>
  );
}
