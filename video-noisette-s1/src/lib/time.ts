import { useCurrentFrame } from "remotion";
import timeline from "../data/timeline.json";

export type Line = { id: string; text: string; start: number; end: number; speaker?: string; accent?: number };
export type Scene = { id: string; start: number; end: number };

export const FPS: number = timeline.fps;
export const DURATION_FRAMES = Math.round(timeline.duration * FPS);
const lines = timeline.lines as Line[];
const scenes = timeline.scenes as Scene[];

/** Narration or dialogue line by id (seconds). */
export const L = (id: string): Line => {
  const l = lines.find((x) => x.id === id);
  if (!l) throw new Error(`Unknown line ${id}`);
  return l;
};
/** Scene window by id (seconds). */
export const S = (id: string): Scene => {
  const s = scenes.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown scene ${id}`);
  return s;
};
export const allLines = () => lines;
export const F = (n: number) => n / FPS;
export const toFrame = (s: number) => Math.round(s * FPS);
export const useTime = () => {
  const frame = useCurrentFrame();
  return { frame, t: frame / FPS };
};
/** True while the frame is inside the scene window [start, end) in whole frames. */
export const inScene = (frame: number, id: string) => {
  const s = S(id);
  return frame >= toFrame(s.start) && frame < toFrame(s.end);
};
