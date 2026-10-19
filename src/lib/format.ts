// Format a number as money: +$1,234.00 or -$1,234.00
export function money(v: number, decimals: number = 2): string {
  const absVal = Math.abs(v);
  if (absVal < 0.5 && decimals <= 0) return '$0';
  const sign = v >= 0 ? '+' : '-';
  const formatted = absVal.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${sign}$${formatted}`;
}

// Get color based on value
export function col(v: number): string {
  if (Math.abs(v) < 0.5) return 'var(--t2)';
  return v > 0 ? 'var(--green)' : 'var(--red)';
}

// Grouped dollars, always two fraction digits: $1,284.20
export function formatUsdAmount(v: number): string {
  return (
    "$" +
    v.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

// Format price with proper decimals
export function fmtP(v: number, dec: number = 2): string {
  return '$' + v.toLocaleString('en-US', {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });
}

// Format percent change
export function fmtPct(v: number): string {
  const sign = v >= 0 ? '+' : '';
  return `${sign}${v.toFixed(2)}%`;
}
