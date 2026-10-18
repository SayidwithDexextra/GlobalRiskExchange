// Park-Miller PRNG - seeded at 11 for deterministic data
let seed = 11;

export function rnd(): number {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
}

export function resetSeed(s: number = 11): void {
  seed = s;
}

export function walk(base: number, n: number, drift: number, vol: number): number[] {
  let v = base;
  const a: number[] = [];
  for (let i = 0; i < n; i++) {
    v *= 1 + drift + (rnd() - 0.5) * vol;
    a.push(v);
  }
  const f = base / a[n - 1];
  return a.map(x => x * f);
}
