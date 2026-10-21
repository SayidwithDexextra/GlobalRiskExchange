'use client';

import { useEffect } from 'react';
import { Header } from '@/components/Header';
import './contact.css';
import './route.css';

export default function ContactPage() {
  useEffect(() => {
    const hdr = document.getElementById('hdr');
    const L = document.getElementById('rockL');
    const R = document.getElementById('rockR');
    const hero = document.getElementById('top');
    const formEl = document.getElementById('cform') as HTMLFormElement | null;
    if (!L || !R || !hero || !formEl) return;
    const rockL = L;
    const rockR = R;
    const heroEl = hero;
    const form = formEl;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function size() {
      const w = window.innerWidth;
      const D = w > 1024;
      const T = w > 768;
      const dashW = D ? Math.min(880, w * 0.72) : T ? w * 0.86 : w - 32;
      const m = (w - dashW) / 2;
      const ov = T ? 70 : 20;
      const sc = Math.max((m + ov) / 515, D ? 0 : (w * 0.22) / 515);
      rockL.style.width = (530 * sc).toFixed(1) + 'px';
      rockR.style.width = (m + ov + 10 * sc).toFixed(1) + 'px';
      rockL.style.height = rockR.style.height = (1080 * sc).toFixed(1) + 'px';
      const bs = (1920 * sc).toFixed(1) + 'px ' + (1080 * sc).toFixed(1) + 'px';
      const li = rockL.firstChild as HTMLElement;
      const ri = rockR.firstChild as HTMLElement;
      li.style.backgroundSize = ri.style.backgroundSize = bs;
      ri.style.backgroundPosition = (-1300 * sc).toFixed(1) + 'px 0px';
    }
    function onScroll() {
      const y = window.scrollY;
      hdr?.classList.toggle('scrolled', y > 24);
      if (reduce || window.innerWidth <= 768) {
        rockL.style.transform = '';
        rockR.style.transform = '';
        return;
      }
      const p = Math.min(1, Math.max(0, y / (window.innerHeight * 0.8)));
      const s2 = 1 + 0.12 * p;
      rockL.style.transform = 'translateX(' + (-28 * p).toFixed(2) + '%) scale(' + s2 + ')';
      rockR.style.transform = 'translateX(' + (28 * p).toFixed(2) + '%) scale(' + s2 + ')';
    }
    function onResize() { size(); onScroll(); }
    function onSubmit(e: Event) {
      e.preventDefault();
      let ok = true;
      const checks: [string, (v: string) => boolean][] = [
        ['name', (v) => v.trim().length > 1],
        ['email', (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)],
        ['message', (v) => v.trim().length > 3],
      ];
      checks.forEach(([id, test]) => {
        const el = document.getElementById(id) as HTMLInputElement;
        const good = test(el.value);
        el.parentElement?.classList.toggle('err', !good);
        if (!good && ok) { el.focus(); ok = false; }
      });
      if (!ok) return;
      const card = document.getElementById('formcard');
      fetch('/api/contact', { method: 'POST', body: new FormData(form) })
        .then((res) => {
          if (!res.ok) throw new Error('send failed');
          card?.classList.add('sent');
          form.reset();
          if (tEl) tEl.value = String(Date.now());
        })
        .catch(() => {
          alert('Sorry, your message could not be sent. Please email us at admin@dexetera.xyz.');
        });
    }
    function onInput(e: Event) {
      (e.currentTarget as HTMLElement).parentElement?.classList.remove('err');
    }
    const fields = form.querySelectorAll('.in');
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    const tEl = document.getElementById('cf_t') as HTMLInputElement | null;
    if (tEl) tEl.value = String(Date.now());
    form.addEventListener('submit', onSubmit);
    fields.forEach((el) => el.addEventListener('input', onInput));
    size();
    onScroll();
    if (reduce) heroEl.classList.add('in');
    else requestAnimationFrame(() => { requestAnimationFrame(() => { heroEl.classList.add('in'); }); });

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      form.removeEventListener('submit', onSubmit);
      fields.forEach((el) => el.removeEventListener('input', onInput));
    };
  }, []);

  return (
    <>
      <Header currentPath="/contact" />
      <div className="dx-contact" style={{ ['--rocks' as string]: "url('/hero_rocks.webp')" }}>
        <section className='hero' id='top'>
        <div className='rock l' id='rockL'><i></i></div>
        <div className='rock r' id='rockR'><i></i></div>
        <div className='grain'></div>
        <div className='hero-in'>
        <span className='chip'><i></i>Contact</span>
        <h1><span className='g'>Tell us the risk.</span>We'll help you price it.</h1>
        <p className='lede'>Hedging a business exposure, creating a market, providing liquidity or partnering with us. Send a note and the team will reply by email.</p>
        </div>
        </section>
        <div className='wrap'>
        <div className='contact'>
        <div className='card formcard' id='formcard'>
        <form id='cform' noValidate>
        <div aria-hidden='true' style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
          <label htmlFor='cf_website'>Leave this field empty</label>
          <input id='cf_website' name='website' type='text' tabIndex={-1} autoComplete='off' defaultValue='' />
          <input id='cf_t' name='cf_t' type='hidden' defaultValue='' />
        </div>
        <div className='k'>Send a message</div>
        <h2>How can we help?</h2>
        <div className='field'>
        <label>I'm interested in</label>
        <div className='topics' role='radiogroup'>
        <input type='radio' name='topic' id='t1' value='hedge' defaultChecked /><label htmlFor='t1'>Hedging a risk</label>
        <input type='radio' name='topic' id='t2' value='create' /><label htmlFor='t2'>Creating a market</label>
        <input type='radio' name='topic' id='t3' value='liquidity' /><label htmlFor='t3'>Providing liquidity</label>
        <input type='radio' name='topic' id='t4' value='partner' /><label htmlFor='t4'>Partnerships</label>
        <input type='radio' name='topic' id='t5' value='press' /><label htmlFor='t5'>Press</label>
        <input type='radio' name='topic' id='t6' value='other' /><label htmlFor='t6'>Other</label>
        </div>
        </div>
        <div className='row2'>
        <div className='field'><label htmlFor='name'>Name</label><input className='in' id='name' name='name' autoComplete='name' placeholder='Jane Smith' required /><span className='msg'>Please add your name.</span></div>
        <div className='field'><label htmlFor='email'>Work email</label><input className='in' id='email' name='email' type='email' autoComplete='email' placeholder='jane@company.com' required /><span className='msg'>Please add a valid email.</span></div>
        </div>
        <div className='row2'>
        <div className='field'><label htmlFor='company'>Company <em>(optional)</em></label><input className='in' id='company' name='company' autoComplete='organization' placeholder='Company name' /></div>
        <div className='field'><label htmlFor='metric'>Metric or exposure <em>(optional)</em></label><input className='in' id='metric' name='metric' placeholder='e.g. Niño 3.4, ERCOT power, GPU rates' /></div>
        </div>
        <div className='field'><label htmlFor='message'>Message</label><textarea className='in' id='message' name='message' placeholder='What moves your costs or revenue, and what would you like to hedge or build?' required></textarea><span className='msg'>Please add a short message.</span></div>
        <div className='submit'>
        <p>We only use your details to reply to you. Prefer email? Write to <a href='mailto:admin@dexetera.xyz'>admin@dexetera.xyz</a>.</p>
        <button className='btn btn-p' type='submit'>Send message <svg width='14' height='14' viewBox='0 0 14 14' fill='none'><path d='M3 7h8M7.5 3.5L11 7l-3.5 3.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg></button>
        </div>
        </form>
        <div className='done' role='status'>
        <div className='tick'><svg width='18' height='18' viewBox='0 0 18 18' fill='none'><path d='M4 9.5l3.2 3L14 5.5' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' /></svg></div>
        <h3>Message sent.</h3>
        <p>Thanks for reaching out. We'll reply to you by email.</p>
        <button className='btn btn-s' type='button' style={{marginTop: '22px'}} onClick={() => document.getElementById('formcard')?.classList.remove('sent')}>Send another</button>
        </div>
        </div>
        <aside className='side'>
        <a className='card chan' href='mailto:admin@dexetera.xyz'><div><div className='k'>Email</div><div className='v'>admin@dexetera.xyz</div><div className='d'>Hedging, markets, partnerships</div></div><span className='go'><svg width='12' height='12' viewBox='0 0 12 12' fill='none'><path d='M3.5 8.5l5-5M4.5 3.5h4v4' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round' /></svg></span></a>
        <a className='card chan' href='https://x.com/dexeteralabs'><div><div className='k'>X / Twitter</div><div className='v'>@dexeteralabs</div><div className='d'>Product updates and new markets</div></div><span className='go'><svg width='12' height='12' viewBox='0 0 12 12' fill='none'><path d='M3.5 8.5l5-5M4.5 3.5h4v4' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round' /></svg></span></a>
        <a className='card chan' href='https://doc.dexetera.org'><div><div className='k'>Documentation</div><div className='v'>doc.dexetera.org</div><div className='d'>How markets, trading and settlement work</div></div><span className='go'><svg width='12' height='12' viewBox='0 0 12 12' fill='none'><path d='M3.5 8.5l5-5M4.5 3.5h4v4' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round' /></svg></span></a>
        <div className='card next'>
        <div className='k'>What happens next</div>
        <ol>
        <li>We read every message and reply by email.</li>
        <li>If you have an exposure, we look at which public metric tracks it.</li>
        <li>We walk you through creating or trading the market on Dexetera.</li>
        </ol>
        </div>
        </aside>
        </div>
        <section className='sec'>
        <div className='sec-h'>
        <div>
        <span className='k'>Questions</span>
        <h2 className='big'><span className='g'>Before you</span>write to us.</h2>
        </div>
        <div className='faq'>
        <details open><summary>Can you help me find a market for my exposure?<span>+</span></summary><p>Yes. Tell us what moves your costs or revenue. We'll help you check whether a credible, public, archivable data source tracks it, and whether it fits as a market on Dexetera.</p></details>
        <details><summary>Do I need a crypto wallet to talk to you?<span>+</span></summary><p>No. Start with a conversation. When you're ready to trade, positions use USDC held in your own wallet, and creating a market or placing orders can be gasless.</p></details>
        <details><summary>Is there a minimum size?<span>+</span></summary><p>There is no dealer setting a minimum ticket. Positions are sized in contracts on a public on-chain orderbook, so you can start small.</p></details>
        <details><summary>How is a market settled?<span>+</span></summary><p>Each market settles against its named public data source. Anyone can propose the final value with evidence, anyone can challenge it with a bond, and disputes go to UMA's Optimistic Oracle.</p></details>
        </div>
        </div>
        </section>
        </div>
        <footer>
        <div className='ft'>
        <div>
        <a className='brand' href='/'><img src='/dexetera-logo.svg' alt='Dexetera logo' /><span>DEXETERA</span></a>
        <p>The marketplace for risk. Create a futures market on any number you can measure.</p>
        </div>
        <div><h5>Product</h5><a href='/#markets'>Markets</a><a href='https://dexetera.xyz'>Launch app</a><a href='https://dexetera.xyz/new-market'>Create a market</a></div>
        <div><h5>Learn</h5><a href='/#how'>How it works</a><a href='/whitepaper'>Whitepaper</a></div>
        <div><h5>Company</h5><a href='/team'>Team</a><a href='/contact'>Contact</a><a href='https://x.com/dexeteralabs'>X / Twitter</a><a href='mailto:admin@dexetera.xyz'>admin@dexetera.xyz</a></div>
        </div>
        <div className='fb'><span>© 2026 Dexetera</span><span>Settled by public data</span></div>
        </footer>
      </div>
    </>
  );
}
