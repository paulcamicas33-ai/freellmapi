import { clamp01, prog } from "./ease";
import { noise1, rand } from "./noise";

/** Idle breathing: a slow vertical scale, never fully still. */
export const breathe = (t: number, seed = 0) => 1 + Math.sin(t * 2.2 + seed) * 0.012;

/** Eyelid closure 0..1, a blink every 2.5–4.5 s, seeded per character. */
export const blink = (t: number, seed = 0) => {
  const period = 2.6 + rand(seed, 1) * 1.9;
  const local = (t + rand(seed, 2) * period) % period;
  return local < 0.14 ? Math.sin((local / 0.14) * Math.PI) : 0;
};

/** Mouth openness 0..1 while a line is spoken (start..end), irregular like speech. */
export const talk = (t: number, start: number, end: number, seed = 0) => {
  if (t < start || t > end) return 0;
  const env = Math.min(1, (t - start) / 0.08, (end - t) / 0.08);
  return env * clamp01(0.25 + 0.75 * Math.abs(Math.sin((t - start) * 10.5 + noise1(t * 5, seed) * 1.6)));
};

/** Walk cycle: steps per second `speed`. Angles in degrees, bob in px (at scale 1). */
export const walk = (t: number, speed = 1.8) => {
  const p = t * speed * Math.PI;
  return {
    bob: -Math.abs(Math.sin(p)) * 10,
    legL: Math.sin(p) * 26,
    legR: -Math.sin(p) * 26,
    armL: -Math.sin(p) * 24,
    armR: Math.sin(p) * 24,
    tilt: Math.sin(p) * 2,
  };
};

/** A hop from a to b seconds: height in px, with squash before take-off and on landing. */
export const hop = (t: number, a: number, b: number, height: number) => {
  const k = prog(t, a, b);
  const y = t > a && t < b ? -4 * height * k * (1 - k) : 0;
  const pre = t > a - 0.12 && t <= a ? Math.sin(((t - (a - 0.12)) / 0.12) * Math.PI) : 0;
  const land = t >= b && t < b + 0.18 ? Math.sin(((t - b) / 0.18) * Math.PI) : 0;
  const stretch = t > a && t < b ? Math.sin(k * Math.PI) * 0.08 : 0;
  const sy = 1 - (pre + land) * 0.16 + stretch;
  return { y, sy, sx: 1 / sy };
};

/** A one-shot squash at time `at` (a surprise, a bump, a laugh). */
export const squashAt = (t: number, at: number, amount = 0.15, dur = 0.3) => {
  const d = t - at;
  if (d < 0 || d > dur) return { sx: 1, sy: 1 };
  const s = Math.sin((d / dur) * Math.PI) * Math.exp(-d * 4);
  return { sx: 1 + s * amount, sy: 1 - s * amount };
};

/** Gentle sway for trees, grass, tails: degrees. */
export const sway = (t: number, seed = 0, amp = 3, speed = 0.8) =>
  Math.sin(t * speed * Math.PI * 2 + seed) * amp + noise1(t * 0.7, seed) * amp * 0.4;
