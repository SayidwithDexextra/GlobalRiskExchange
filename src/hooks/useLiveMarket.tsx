'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { rnd, resetSeed } from '@/lib/prng';
import { clampToBand, exampleBySymbol } from '@/lib/exampleMarkets';

const EGG_BASE = exampleBySymbol('PRICE-EGGS').price;

interface Candle {
  o: number;
  h: number;
  l: number;
  c: number;
}

interface Trade {
  p: number;
  s: number;
  up: boolean;
  t: number;
}

interface BookLevel {
  price: number;
  size: number;
  total: number;
}

interface LiveMarketState {
  eggPrice: number;
  eggChg24: number;
  open24: number;
  candles: Candle[];
  series: number[][];
  trades: Trade[];
  book: { bids: BookLevel[]; asks: BookLevel[] };
  flash: number;
  flashRow: number;
  ownerFees: number;
}

const LiveMarketContext = createContext<LiveMarketState | null>(null);

export function useLiveMarket() {
  const ctx = useContext(LiveMarketContext);
  if (!ctx) throw new Error('useLiveMarket must be used within LiveMarketProvider');
  return ctx;
}

function makeBook(mid: number): { bids: BookLevel[]; asks: BookLevel[] } {
  const tick = 0.001;
  const bids: BookLevel[] = [];
  const asks: BookLevel[] = [];
  let bidTotal = 0;
  let askTotal = 0;
  
  for (let i = 0; i < 8; i++) {
    const bidSize = Math.round(300 + rnd() * 3200);
    const askSize = Math.round(300 + rnd() * 3200);
    bidTotal += bidSize;
    askTotal += askSize;
    bids.push({
      price: mid - (i + 1) * tick,
      size: bidSize,
      total: bidTotal,
    });
    asks.push({
      price: mid + (i + 1) * tick,
      size: askSize,
      total: askTotal,
    });
  }
  
  return { bids, asks };
}

function seedTrades(price: number, baseTime?: number): Trade[] {
  const trades: Trade[] = [];
  // Use baseTime if provided, otherwise use 0 (will be relative offsets)
  const now = baseTime ?? 0;
  for (let i = 0; i < 9; i++) {
    trades.push({
      p: price * (1 + (rnd() - 0.5) * 0.002),
      s: Math.round(50 + rnd() * 900),
      up: rnd() > 0.5,
      t: now - i * 30000,
    });
  }
  return trades;
}

interface LiveMarketProviderProps {
  children: ReactNode;
}

export function LiveMarketProvider({ children }: LiveMarketProviderProps) {
  const [state, setState] = useState<LiveMarketState>(() => {
    // Initialize with deterministic seed
    resetSeed(11);
    
    // Generate initial candles (44)
    const candles: Candle[] = [];
    let v = 2.6;
    for (let i = 0; i < 44; i++) {
      const o = v;
      v = v * (1 + (rnd() - 0.46) * 0.014);
      const h = Math.max(o, v) * (1 + rnd() * 0.005);
      const l = Math.min(o, v) * (1 - rnd() * 0.005);
      candles.push({ o, h, l, c: v });
    }
    
    // Scale to make last close = 2.715
    const scale = 2.715 / v;
    candles.forEach(c => {
      c.o *= scale;
      c.h *= scale;
      c.l *= scale;
      c.c *= scale;
    });
    
    const eggPrice = candles[candles.length - 1].c;
    const open24 = candles[20].c;
    const eggChg24 = (eggPrice / open24 - 1) * 100;
    
    // Generate series for other markets
    const series: number[][] = [];
    for (let i = 0; i < 6; i++) {
      const base = [2.0, 2.715, 38.4, 2140, 4.85, 2.9][i];
      const drift = i % 3 === 2 ? -0.003 : 0.0025;
      const s: number[] = [];
      let sv = base;
      for (let j = 0; j < 40; j++) {
        sv *= 1 + drift + (rnd() - 0.5) * 0.03;
        s.push(sv);
      }
      const sf = base / s[s.length - 1];
      series.push(s.map(x => x * sf));
    }
    
    const book = makeBook(eggPrice);
    const trades = seedTrades(eggPrice);
    
    return {
      eggPrice,
      eggChg24,
      open24,
      candles,
      series,
      trades,
      book,
      flash: 0,
      flashRow: 0,
      ownerFees: 1284.20,
    };
  });

  // Hydrate timestamps on mount
  useEffect(() => {
    const now = Date.now();
    setState(prev => ({
      ...prev,
      trades: prev.trades.map((t, i) => ({ ...t, t: now - i * 30000 })),
    }));
  }, []);

  // Tick every 1500ms
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    let tn = 0;
    const interval = setInterval(() => {
      setState(prev => {
        const lastCandle = prev.candles[prev.candles.length - 1];
        const m = clampToBand(lastCandle.c * (1 + (rnd() - 0.5) * 0.004), EGG_BASE);
        
        const newCandles = [...prev.candles];
        tn++;
        
        if (tn % 6 === 0) {
          // New candle
          newCandles.shift();
          newCandles.push({
            o: lastCandle.c,
            h: Math.max(lastCandle.c, m),
            l: Math.min(lastCandle.c, m),
            c: m,
          });
        } else {
          // Update last candle
          const last = { ...newCandles[newCandles.length - 1] };
          last.c = m;
          last.h = Math.max(last.h, m);
          last.l = Math.min(last.l, m);
          newCandles[newCandles.length - 1] = last;
        }
        
        // Update series (50% chance each)
        const newSeries = prev.series.map((s, i) => {
          if (i >= 2 && rnd() > 0.5) {
            const ns = [...s];
            ns.shift();
            ns.push(s[s.length - 1] * (1 + (rnd() - 0.5) * 0.012));
            return ns;
          }
          return s;
        });
        
        // New trade
        const newTrades = [
          {
            p: m,
            s: Math.round(50 + rnd() * 900),
            up: m >= lastCandle.c,
            t: Date.now(),
          },
          ...prev.trades.slice(0, 8),
        ];
        
        const newBook = makeBook(m);
        const flash = m >= lastCandle.c ? 1 : -1;
        const flashRow = Math.floor(rnd() * 16);
        
        return {
          ...prev,
          eggPrice: m,
          eggChg24: (m / prev.open24 - 1) * 100,
          candles: newCandles,
          series: newSeries,
          trades: newTrades,
          book: newBook,
          flash,
          flashRow,
          ownerFees: prev.ownerFees + 0.4 + rnd() * 2.6,
        };
      });
      
      // Clear flash after 450ms
      setTimeout(() => {
        setState(prev => ({ ...prev, flash: 0 }));
      }, 450);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <LiveMarketContext.Provider value={state}>
      {children}
    </LiveMarketContext.Provider>
  );
}
