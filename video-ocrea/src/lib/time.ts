import { useCurrentFrame } from "remotion";
import timeline from "../data/timeline.json";

export type Line = { id: string; text: string; start: number; end: number; accent: number };
export type Act = { id: string; start: number; end: number };

export const FPS: number = timeline.fps;
export const DURATION_FRAMES = Math.round(timeline.duration * FPS);

const lines = timeline.lines as Line[];
const acts = timeline.acts as Act[];

/** The timeline line with this id (seconds). */
export const L = (id: string): Line => {
  const l = lines.find((x) => x.id === id);
  if (!l) throw new Error(`Unknown line ${id}`);
  return l;
};
/** The act window with this id (seconds). */
export const A = (id: string): Act => {
  const a = acts.find((x) => x.id === id);
  if (!a) throw new Error(`Unknown act ${id}`);
  return a;
};
/** n frames expressed in seconds. */
export const F = (n: number) => n / FPS;
/** Seconds to a whole frame number. */
export const toFrame = (s: number) => Math.round(s * FPS);

/** Global frame and its time in seconds (time is frame-quantised). */
export const useTime = () => {
  const frame = useCurrentFrame();
  return { frame, t: frame / FPS };
};

/** Act window in integer frames: [from, to). */
export const actFrames = (id: string) => {
  const a = A(id);
  return { from: toFrame(a.start), to: toFrame(a.end) };
};
