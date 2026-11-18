export type Format = "landscape" | "portrait";
export const W = 1920;
export const H = 1080;
export const pick = <T,>(format: Format, portrait: T, landscape: T): T =>
  format === "portrait" ? portrait : landscape;
export const SAFE = { x0: 110, x1: 1810, y0: 80, y1: 1000 };
