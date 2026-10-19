// One currency formatter for every dollar amount on the landing page.
const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** $1,043.00 or -$1,043.00 */
export function formatUsd(value: number): string {
  return usdFormatter.format(value);
}

/** +$1,043.00 or -$1,043.00 */
export function formatSignedUsd(value: number): string {
  const text = usdFormatter.format(Math.abs(value));
  if (value > 0) return `+${text}`;
  if (value < 0) return `-${text}`;
  return text;
}

// Format a number as money: +$1,234.00 or -$1,234.00
export function money(v: number): string {
  return formatSignedUsd(v);
}

// Get color based on value
export function col(v: number): string {
  if (Math.abs(v) < 0.5) return 'var(--t2)';
  return v > 0 ? 'var(--green)' : 'var(--red)';
}

// Grouped dollars, always two fraction digits: $1,284.20
export function formatUsdAmount(v: number): string {
  return formatUsd(v);
}

// Format price with proper decimals
export function fmtP(v: number): string {
  return formatUsd(v);
}

// Format percent change
export function fmtPct(v: number): string {
  const sign = v >= 0 ? '+' : '';
  return `${sign}${v.toFixed(2)}%`;
}
