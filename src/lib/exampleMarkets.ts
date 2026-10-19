// Single source for example market prices shown across the landing page.

import { formatUsd } from "@/lib/format";

export type ExampleMarket = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  decimals: number;
};

export const EXAMPLE_MARKETS: ExampleMarket[] = [
  { symbol: "PRICE-EGGS", name: "Eggs, Grade A", price: 2.715, change: 0.77, decimals: 3 },
  { symbol: "PRICE-MILK-US", name: "Milk, US average", price: 4.12, change: 0.24, decimals: 2 },
  { symbol: "CRUDE-OIL", name: "Crude Oil, WTI", price: 71.84, change: -0.62, decimals: 2 },
  { symbol: "GOLD", name: "Gold, spot", price: 2412.3, change: 0.31, decimals: 2 },
  { symbol: "SILVER", name: "Silver", price: 29.84, change: 0.48, decimals: 2 },
  { symbol: "NASDAQ", name: "Nasdaq", price: 18240.11, change: -0.12, decimals: 2 },
  { symbol: "GPU-H100", name: "GPU compute, H100", price: 2, change: 1.2, decimals: 2 },
  { symbol: "ERCOT-N", name: "ERCOT North power", price: 38.4, change: 1.12, decimals: 2 },
  { symbol: "DRAM-DDR5", name: "DRAM DDR5 spot", price: 4.85, change: -0.41, decimals: 2 },
  { symbol: "FREIGHT-FEU", name: "Asia to US freight", price: 2140, change: 0.66, decimals: 0 },
  { symbol: "BTC", name: "Bitcoin", price: 64210, change: 0.86, decimals: 2 },
  { symbol: "ETH", name: "Ethereum", price: 3120.45, change: -0.33, decimals: 2 },
  { symbol: "NINO34-DEC26", name: "Niño 3.4", price: 5400, change: 1.69, decimals: 2 },
  { symbol: "US-CPI-YOY", name: "US CPI, year on year", price: 2.9, change: -0.1, decimals: 2 },
  { symbol: "BTC-MINE-M", name: "BTC mining margin", price: 48.2, change: 0.35, decimals: 2 },
];

const bySymbol = new Map(EXAMPLE_MARKETS.map((market) => [market.symbol, market]));

export function exampleBySymbol(symbol: string): ExampleMarket {
  const market = bySymbol.get(symbol);
  if (!market) throw new Error(`Unknown example market ${symbol}`);
  return market;
}

export function formatExamplePrice(market: ExampleMarket, price = market.price): string {
  return formatUsd(price);
}

/** Percent label. A change that rounds to 0.00 is a neutral dash with no arrow. */
export function formatExampleChange(
  change: number,
  opts?: { arrow?: boolean },
): { text: string; color: string; flat: boolean } {
  const rounded = Math.round(change * 100) / 100;
  if (rounded === 0) {
    return { text: "–", color: "var(--t4)", flat: true };
  }
  const up = rounded > 0;
  const magnitude = Math.abs(rounded).toFixed(2) + "%";
  const text = opts?.arrow
    ? (up ? "▲ " : "▼ ") + magnitude
    : (up ? "+" : "-") + magnitude;
  return { text, color: up ? "var(--green)" : "var(--red)", flat: false };
}

export function tickerFromExamples(): [string, string, number][] {
  return EXAMPLE_MARKETS.map((market) => [
    market.symbol,
    formatExamplePrice(market),
    market.change,
  ]);
}

/** Keep a live nudge inside plus or minus `band` of the list price. */
export function clampToBand(value: number, base: number, band = 0.01): number {
  return Math.min(base * (1 + band), Math.max(base * (1 - band), value));
}
