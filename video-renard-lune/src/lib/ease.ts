const bezier = (x1: number, y1: number, x2: number, y2: number) => {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0, hi = 1, t = x;
    for (let i = 0; i < 40; i++) {
      const v = sx(t);
      if (Math.abs(v - x) < 1e-6) break;
      if (v < x) lo = t; else hi = t;
      t = (lo + hi) / 2;
    }
    return sy(t);
  };
};
/** Cartoon arrivals overshoot a little more than cinematic ones: that is the bounce. */
export const arrive = bezier(0.16, 1, 0.3, 1);
export const pop = bezier(0.34, 1.56, 0.64, 1); // up to ~10 % overshoot, for characters and props only
export const cam = bezier(0.65, 0, 0.35, 1);
export const exit = bezier(0.7, 0, 0.84, 0);
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const prog = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** Piecewise-linear keys [time, value][] eased by `ease` between keys. */
export const keys = (t: number, k: [number, number][], ease = cam) => {
  if (t <= k[0][0]) return k[0][1];
  for (let i = 0; i < k.length - 1; i++) {
    const [ta, va] = k[i], [tb, vb] = k[i + 1];
    if (t <= tb) return lerp(va, vb, ease(prog(t, ta, tb)));
  }
  return k[k.length - 1][1];
};
