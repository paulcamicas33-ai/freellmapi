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
  /** sound, from src/sound/<id>.json: music bed, effect cues, and the voices (files in public/audio/) */
  sound?: EpisodeSound;
};

export type Cue = { file: string; t: number; syncAt?: number; gainDb?: number };
export type EpisodeSound = {
  music: { file: string; gainDb: number };
  cues: Cue[];
  /** voice file prefix: <prefix>-<id>.wav */
  prefix: string;
  /** what the voice says for a caption when it differs from the caption ("" = the caption is not read, its words are read by `extra`) */
  say?: Record<string, string>;
  /** on-screen words read aloud at their time (numbers, colours, meaningful pop words) */
  extra?: { id: string; text: string; t: number; speaker?: string }[];
};
