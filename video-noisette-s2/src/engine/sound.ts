import type { Cue as EpCue } from "./types";

type Cue = EpCue;

/** Cues every episode shares: badge ding, end-card ta-da, the typing bubble until the end. */
export const commonCues = (endAt: number, duration: number): Cue[] => {
  const typing: Cue[] = [];
  for (let t = endAt + 0.8; t < duration - 1.0; t += 1.2) typing.push({ file: "sfx-typing.wav", t, gainDb: -18 });
  return [{ file: "sfx-ding.wav", t: 0.15, gainDb: -6 }, { file: "sfx-tada.wav", t: endAt, gainDb: -4 }, ...typing];
};

/** One xylophone note per number of a count (notes climb). */
export const countCues = (times: number[], gainDb = -5): Cue[] => times.map((t, i) => ({ file: `sfx-xylo-${Math.min(8, i + 1)}.wav`, t, gainDb }));
