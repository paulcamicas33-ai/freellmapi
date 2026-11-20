// Seeded, deterministic noise. Never Math.random.
export const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
};
export const rand = (seed: number, i: number) => hash(seed * 1000.13 + i * 7.77);
export const noise1 = (x: number, seed = 0) => {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return (rand(seed, i) * (1 - u) + rand(seed, i + 1) * u) * 2 - 1;
};
