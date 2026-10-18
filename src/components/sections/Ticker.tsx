'use client';

import { useMemo } from 'react';
import { TICKER } from '@/lib/data';
import { useLiveMarket } from '@/hooks/useLiveMarket';

interface TickerProps {
  durationSec?: number;
  reverse?: boolean;
  pausable?: boolean;
}

export function Ticker({ durationSec = 60, reverse = false, pausable = true }: TickerProps) {
  const { eggPrice, eggChg24 } = useLiveMarket();

  // Build ticker items with live egg price
  const items = useMemo(() => {
    return TICKER.map(([symbol, price, change]) => {
      if (symbol === 'PRICE-EGGS') {
        return {
          symbol,
          price: '$' + eggPrice.toFixed(3),
          change: eggChg24,
        };
      }
      return { symbol, price, change };
    });
  }, [eggPrice, eggChg24]);

  // Double the items for seamless loop
  const doubledItems = [...items, ...items];

  return (
    <div
      className="h-[46px] overflow-hidden"
      style={{
        background: 'var(--bg)',
        borderBottom: '1px solid var(--hair)',
      }}
    >
      <div
        className="flex items-center h-[46px] font-mono text-[11px]"
        style={{
          width: 'max-content',
          animation: `${reverse ? 'dx-ticker-r' : 'dx-ticker'} ${durationSec}s linear infinite`,
          animationPlayState: pausable ? undefined : 'running',
        }}
        onMouseEnter={(e) => {
          if (pausable) {
            e.currentTarget.style.animationPlayState = 'paused';
          }
        }}
        onMouseLeave={(e) => {
          if (pausable) {
            e.currentTarget.style.animationPlayState = 'running';
          }
        }}
      >
        {doubledItems.map((item, i) => (
          <span
            key={`${item.symbol}-${i}`}
            className="inline-flex items-center gap-2 px-[22px] whitespace-nowrap"
            style={{ borderRight: '1px solid var(--hair)' }}
          >
            <span className="text-t3">{item.symbol}</span>
            <span className="text-line4">•</span>
            <span className="text-t1">{item.price}</span>
            <span
              style={{
                color:
                  item.change > 0
                    ? 'var(--green)'
                    : item.change < 0
                    ? 'var(--red)'
                    : 'var(--t2)',
              }}
            >
              {item.change > 0 ? '+' : ''}
              {item.change.toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
