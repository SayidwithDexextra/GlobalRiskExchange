'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import './film-card.css';

const FILM = '/film/dexetera-film-1080p.mp4';
const LOOP = '/film/dexetera-film-loop.mp4';
const POSTER = '/film/dexetera-film-poster.jpg';
const LOOP_POSTER = '/film/dexetera-film-loop-poster.jpg';
const CAPTIONS = '/film/dexetera-film-captions.vtt';
const HIDE_KEY = 'dx-film-hidden';

type PH = { capture: (event: string, props?: Record<string, unknown>) => void };
function track(event: string, props?: Record<string, unknown>) {
  try {
    (window as unknown as { posthog?: PH }).posthog?.capture(event, props);
  } catch {
    /* analytics must never break the page */
  }
}

export function FilmCard() {
  const [ready, setReady] = useState(false); // past the hero
  const [hidden, setHidden] = useState(true); // dismissed or watched before
  const [open, setOpen] = useState(false);
  const [reduced, setReduced] = useState(false);
  const loopRef = useRef<HTMLVideoElement>(null);
  const filmRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const marks = useRef<Set<number>>(new Set());

  // Remember dismissals, respect reduced motion
  useEffect(() => {
    let h = false;
    try {
      h = localStorage.getItem(HIDE_KEY) === '1';
    } catch {}
    setHidden(h);
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Show the card only once the visitor has scrolled past the hero
  useEffect(() => {
    const onScroll = () => setReady(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const showCard = ready && !hidden && !open;

  // Play the silent loop only while the card is on screen
  useEffect(() => {
    const v = loopRef.current;
    if (!v) return;
    if (showCard && !reduced) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [showCard, reduced]);

  const remember = () => {
    try {
      localStorage.setItem(HIDE_KEY, '1');
    } catch {}
  };

  const openFilm = useCallback(() => {
    setOpen(true);
    marks.current = new Set();
    track('film_opened', { source: 'corner_card' });
    requestAnimationFrame(() => {
      const v = filmRef.current;
      if (!v) return;
      v.currentTime = 0;
      v.muted = false;
      if (v.textTracks[0]) v.textTracks[0].mode = 'showing';
      v.play().catch(() => {});
    });
  }, []);

  const closeFilm = useCallback((reason: string) => {
    const v = filmRef.current;
    if (v) {
      track('film_closed', { reason, seconds: Math.round(v.currentTime) });
      v.pause();
    }
    setOpen(false);
  }, []);

  // Esc closes, page doesn't scroll behind the player
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeFilm('escape');
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, closeFilm]);

  const onLoopTime = () => {
    const v = loopRef.current;
    if (v && barRef.current && v.duration) {
      barRef.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
    }
  };

  const onFilmTime = () => {
    const v = filmRef.current;
    if (!v || !v.duration) return;
    const pct = (v.currentTime / v.duration) * 100;
    [25, 50, 75].forEach((m) => {
      if (pct >= m && !marks.current.has(m)) {
        marks.current.add(m);
        track('film_progress', { percent: m });
      }
    });
  };

  const onFilmEnded = () => {
    track('film_completed');
    remember();
    setHidden(true);
    setOpen(false);
  };

  const dismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    track('film_card_dismissed');
    remember();
    setHidden(true);
  };

  return (
    <>
      <div
        className={`dx-film-card${showCard ? ' show' : ''}`}
        role="button"
        tabIndex={showCard ? 0 : -1}
        aria-hidden={!showCard}
        aria-label="Watch the Dexetera film, 60 seconds, with sound"
        onClick={openFilm}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openFilm();
          }
        }}
      >
        <div className="tile">
          <video
            ref={loopRef}
            src={ready ? LOOP : undefined}
            poster={LOOP_POSTER}
            muted
            loop
            playsInline
            preload="none"
            onTimeUpdate={onLoopTime}
            aria-hidden="true"
          />
          <span className="tag">
            <i />
            FILM
          </span>
          <button type="button" className="x" aria-label="Hide film" onClick={dismiss}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
          <div className="foot">
            <span className="txt">
              See Dexetera
              <small>in 60 seconds</small>
            </span>
            <span className="pl" aria-hidden="true" />
          </div>
          <div className="bar" ref={barRef} />
        </div>
      </div>

      <div
        className={`dx-film-theater${open ? ' open' : ''}`}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Dexetera film"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeFilm('backdrop');
        }}
      >
        <button type="button" className="close" aria-label="Close film" onClick={() => closeFilm('button')}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="frame">
          <video
            ref={filmRef}
            poster={POSTER}
            preload="none"
            playsInline
            controls
            onTimeUpdate={onFilmTime}
            onEnded={onFilmEnded}
          >
            <source src={FILM} type="video/mp4" />
            <track kind="captions" src={CAPTIONS} srcLang="en" label="English" default />
          </video>
          <div className="meta">
            <span>
              <b>Dexetera</b> in 60 seconds
            </span>
            <a href="https://dexetera.xyz/new-market" onClick={() => track('film_cta_clicked')}>
              Create a market
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M3.5 8.5l5-5M4.5 3.5h4v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default FilmCard;
