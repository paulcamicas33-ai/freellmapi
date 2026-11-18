import { CanvasTexture, SRGBColorSpace, RepeatWrapping } from "three";
import { rand } from "../lib/noise";

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  return { c, ctx };
};

let glowTex: CanvasTexture | null = null;
/** Soft round glow sprite (white, alpha falloff). */
export const glowTexture = () => {
  if (glowTex) return glowTex;
  const { c, ctx } = canvas(128, 128);
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.55)");
  g.addColorStop(0.6, "rgba(255,255,255,0.12)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  glowTex = new CanvasTexture(c);
  return glowTex;
};

/** Warm "film still" gradient for video slab fronts, one per seed. */
const shotCache = new Map<number, CanvasTexture>();
export const shotTexture = (seed: number) => {
  const hit = shotCache.get(seed);
  if (hit) return hit;
  const { c, ctx } = canvas(512, 288);
  const palettes = [
    ["#2a1209", "#c2562f", "#ffcf8a"],
    ["#120a12", "#6b3a52", "#ffb347"],
    ["#0b0d10", "#35506a", "#f3c48a"],
    ["#1a0f0a", "#8a4a22", "#ffe0b0"],
    ["#0d0806", "#a33f1f", "#ff9a3c"],
    ["#101010", "#4b3a2a", "#e8c79a"],
  ];
  const p = palettes[seed % palettes.length];
  const sky = ctx.createLinearGradient(0, 0, 0, 288);
  sky.addColorStop(0, p[0]);
  sky.addColorStop(0.62, p[1]);
  sky.addColorStop(1, p[0]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 512, 288);
  // sun
  const sx = 120 + rand(seed, 1) * 280;
  const sy = 120 + rand(seed, 2) * 60;
  const sun = ctx.createRadialGradient(sx, sy, 0, sx, sy, 90);
  sun.addColorStop(0, p[2]);
  sun.addColorStop(0.3, p[2] + "aa");
  sun.addColorStop(1, p[2] + "00");
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, 512, 288);
  // horizon silhouettes
  ctx.fillStyle = p[0];
  ctx.beginPath();
  ctx.moveTo(0, 288);
  for (let x = 0; x <= 512; x += 16) {
    ctx.lineTo(x, 200 + Math.sin(x * 0.02 + seed) * 14 + rand(seed, x) * 18);
  }
  ctx.lineTo(512, 288);
  ctx.fill();
  // letterbox bars
  ctx.fillStyle = "rgba(0,0,0,0.85)";
  ctx.fillRect(0, 0, 512, 22);
  ctx.fillRect(0, 266, 512, 22);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  shotCache.set(seed, t);
  return t;
};

let woodTex: CanvasTexture | null = null;
/** Varnished dark wood grain, drawn once with seeded noise. */
export const woodTexture = () => {
  if (woodTex) return woodTex;
  const { c, ctx } = canvas(1024, 1024);
  ctx.fillStyle = "#2a160c";
  ctx.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 260; i++) {
    const y = rand(7, i) * 1024;
    const a = 0.05 + rand(8, i) * 0.12;
    ctx.strokeStyle = rand(9, i) > 0.5 ? `rgba(80,40,18,${a})` : `rgba(10,5,2,${a + 0.05})`;
    ctx.lineWidth = 1 + rand(10, i) * 5;
    ctx.beginPath();
    for (let x = 0; x <= 1024; x += 32) {
      const yy = y + Math.sin(x * 0.006 + i) * 10 + Math.sin(x * 0.021 + i * 3) * 3;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
  woodTex = new CanvasTexture(c);
  woodTex.colorSpace = SRGBColorSpace;
  woodTex.wrapS = woodTex.wrapT = RepeatWrapping;
  woodTex.repeat.set(2, 2);
  return woodTex;
};

let screenTex: CanvasTexture | null = null;
/** The phone's lit screen in act 2: dark Ocrea app with a warm preview, matching act 3's UI. */
export const screenTexture = () => {
  if (screenTex) return screenTex;
  const { c, ctx } = canvas(460, 980);
  const bg = ctx.createLinearGradient(0, 0, 0, 980);
  bg.addColorStop(0, "#1c110b");
  bg.addColorStop(1, "#0a0605");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 460, 980);
  // preview grid
  for (let r = 0; r < 3; r++) {
    for (let k = 0; k < 2; k++) {
      const x = 28 + k * 208, y = 110 + r * 150;
      const g = ctx.createLinearGradient(x, y, x, y + 130);
      g.addColorStop(0, "#2a1209");
      g.addColorStop(0.6, ["#c2562f", "#8a4a22", "#a33f1f"][(r + k) % 3]);
      g.addColorStop(1, "#1a0f0a");
      ctx.fillStyle = g;
      ctx.fillRect(x, y, 196, 130);
    }
  }
  // prompt box
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(24, 640, 412, 150);
  ctx.strokeStyle = "rgba(255,179,71,0.6)";
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 640, 412, 150);
  ctx.fillStyle = "#ffb347";
  ctx.beginPath();
  ctx.arc(388, 715, 30, 0, Math.PI * 2);
  ctx.fill();
  screenTex = new CanvasTexture(c);
  screenTex.colorSpace = SRGBColorSpace;
  return screenTex;
};
