import type React from "react";
import type { Line } from "../lib/time";

export const W = 1080, H = 1920; // season 1 is 9:16 only
export const GROUND = Math.round(H * 0.57);

export type Place = "meadow" | "sunset" | "night" | "forest" | "snow" | "rain" | "beach" | "burrow-night";

export type Scene = {
  id: string; start: number; end: number; place: Place;
  /** camera keys [time, value] (absolute film time) */
  camX?: [number, number][]; camY?: [number, number][]; zoom?: [number, number][];
  /** world content on the characters' plane (depth 1), drawn in order */
  world: (t: number) => React.ReactNode;
  /** content above everything in the world but under captions (DOM or SVG overlays) */
  overlay?: (t: number) => React.ReactNode;
};

export type Episode = {
  id: string; number: number; title: string; duration: number; season?: number;
  scenes: Scene[]; lines: Line[];
  /** end card starts here (comment call) */
  endAt: number;
  /** sound: one music bed + timed effects (files in public/audio/) */
  music?: { file: string; gainDb: number };
  cues?: { file: string; t: number; syncAt?: number; gainDb?: number }[];
  /** voice files <voicePrefix>-<lineId>.wav, each starting just after its caption appears */
  voicePrefix?: string;
  /** other on-screen words that are read aloud (pop words): file <voicePrefix>-<id>.wav at time t */
  extraVoices?: { id: string; text: string; t: number; speaker?: string }[];
};
