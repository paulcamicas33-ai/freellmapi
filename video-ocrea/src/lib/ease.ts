// Cubic-bezier easing, deterministic (Newton + bisection on x).
const bezier = (x1: number, y1: number, x2: number, y2: number) => {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x;
      const d = dx(t);
      if (Math.abs(e) < 1e-6) return sy(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    let lo = 0, hi = 1;
    t = x;
    for (let i = 0; i < 30; i++) {
      const v = sx(t);
      if (Math.abs(v - x) < 1e-6) break;
      if (v < x) lo = t; else hi = t;
      t = (lo + hi) / 2;
    }
    return sy(t);
  };
};

export const arrive = bezier(0.16, 1, 0.3, 1);
export const cam = bezier(0.65, 0, 0.35, 1);
export const exit = bezier(0.7, 0, 0.84, 0);

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** Progress 0..1 of t through [a, b], clamped. */
export const prog = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** Small overshoot (<= 2 %) arrival. */
export const arriveOver = (x: number) => {
  const k = arrive(x);
  return k + Math.sin(clamp01(x) * Math.PI) * 0.02 * (1 - clamp01(x));
};
