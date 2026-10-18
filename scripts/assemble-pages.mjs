import fs from 'fs';

const contact = fs.readFileSync('/tmp/contact.jsx', 'utf8').trim();
const wp = fs.readFileSync('/tmp/whitepaper.jsx', 'utf8').trim();
const indent = (src) => src.split('\n').map((l) => (l ? '        ' + l : '')).join('\n');

const contactPage = `'use client';

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
    const form = document.getElementById('cform') as HTMLFormElement | null;
    if (!L || !R || !hero || !form) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function size() {
      const w = window.innerWidth;
      const D = w > 1024;
      const T = w > 768;
      const dashW = D ? Math.min(880, w * 0.72) : T ? w * 0.86 : w - 32;
      const m = (w - dashW) / 2;
      const ov = T ? 70 : 20;
      const sc = Math.max((m + ov) / 515, D ? 0 : (w * 0.22) / 515);
      L.style.width = (530 * sc).toFixed(1) + 'px';
      R.style.width = (m + ov + 10 * sc).toFixed(1) + 'px';
      L.style.height = R.style.height = (1080 * sc).toFixed(1) + 'px';
      const bs = (1920 * sc).toFixed(1) + 'px ' + (1080 * sc).toFixed(1) + 'px';
      const li = L.firstChild as HTMLElement;
      const ri = R.firstChild as HTMLElement;
      li.style.backgroundSize = ri.style.backgroundSize = bs;
      ri.style.backgroundPosition = (-1300 * sc).toFixed(1) + 'px 0px';
    }
    function onScroll() {
      const y = window.scrollY;
      hdr?.classList.toggle('scrolled', y > 24);
      if (reduce || window.innerWidth <= 768) {
        L.style.transform = '';
        R.style.transform = '';
        return;
      }
      const p = Math.min(1, Math.max(0, y / (window.innerHeight * 0.8)));
      const s2 = 1 + 0.12 * p;
      L.style.transform = 'translateX(' + (-28 * p).toFixed(2) + '%) scale(' + s2 + ')';
      R.style.transform = 'translateX(' + (28 * p).toFixed(2) + '%) scale(' + s2 + ')';
    }
    function onResize() { size(); onScroll(); }
    function onSubmit(e: Event) {
      e.preventDefault();
      let ok = true;
      const checks: [string, (v: string) => boolean][] = [
        ['name', (v) => v.trim().length > 1],
        ['email', (v) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v)],
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
          if (!res.ok) return;
          card?.classList.add('sent');
          form.reset();
        })
        .catch(() => {});
    }
    function onInput(e: Event) {
      (e.currentTarget as HTMLElement).parentElement?.classList.remove('err');
    }
    const fields = form.querySelectorAll('.in');
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    form.addEventListener('submit', onSubmit);
    fields.forEach((el) => el.addEventListener('input', onInput));
    size();
    onScroll();
    if (reduce) hero.classList.add('in');
    else requestAnimationFrame(() => { requestAnimationFrame(() => { hero.classList.add('in'); }); });

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
${indent(contact)}
      </div>
    </>
  );
}
`;

const wpPage = `'use client';

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
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function size() {
      const w = window.innerWidth;
      const D = w > 1024;
      const T = w > 768;
      const dashW = D ? Math.min(880, w * 0.72) : T ? w * 0.86 : w - 32;
      const m = (w - dashW) / 2;
      const ov = T ? 70 : 20;
      const sc = Math.max((m + ov) / 515, D ? 0 : (w * 0.22) / 515);
      RK.style.zIndex = T ? '3' : '0';
      L.style.width = (530 * sc).toFixed(1) + 'px';
      L.style.height = (1080 * sc).toFixed(1) + 'px';
      R.style.width = (m + ov + 10 * sc).toFixed(1) + 'px';
      R.style.height = (1080 * sc).toFixed(1) + 'px';
      const bs = (1920 * sc).toFixed(1) + 'px ' + (1080 * sc).toFixed(1) + 'px';
      const li = L.firstChild as HTMLElement;
      const ri = R.firstChild as HTMLElement;
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
      bar.style.width = (p * 100) + '%';
      if (pct) pct.textContent = Math.round(p * 100) + '%';
      if (reduce || window.innerWidth <= 768) {
        L.style.transform = '';
        R.style.transform = '';
      } else {
        const t = Math.min(1, Math.max(0, (y - hero.offsetTop) / (window.innerHeight * 0.8)));
        L.style.transform = 'translateX(' + (-28 * t).toFixed(2) + '%) scale(' + (1 + 0.12 * t) + ')';
        R.style.transform = 'translateX(' + (28 * t).toFixed(2) + '%) scale(' + (1 + 0.12 * t) + ')';
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
        (L.firstChild as HTMLElement).style.transform = 'scale(1)';
        (R.firstChild as HTMLElement).style.transform = 'scale(1)';
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
${indent(wp)}
      </div>
    </>
  );
}
`;

fs.writeFileSync('src/app/contact/page.tsx', contactPage);
fs.writeFileSync('src/app/whitepaper/page.tsx', wpPage);
console.log('wrote pages', contactPage.length, wpPage.length);
