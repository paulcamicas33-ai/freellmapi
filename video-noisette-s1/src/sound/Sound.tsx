import React from "react";
import { Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import cues from "../data/cues.json";
import { toFrame, DURATION_FRAMES } from "../lib/time";

type Cue = { id: string; file: string; t: number; syncAt: number; gainDb: number; music?: boolean };

/** One Sequence per cue so each file's sync point lands on its cue time. No cues: a silent film. */
export const Sound: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {(cues as Cue[]).map((cue) => {
        const start = toFrame(cue.t) - toFrame(cue.syncAt);
        const base = Math.min(1, 10 ** (cue.gainDb / 20));
        // music: fade in over 9 frames, out over the last second
        const vol = cue.music
          ? () => base * Math.min(1, frame / 9, (DURATION_FRAMES - frame) / 30)
          : base;
        const audio = <Html5Audio src={staticFile(`audio/${cue.file}`)} volume={vol} {...(start < 0 ? { trimBefore: -start } : {})} />;
        return (
          <Sequence key={cue.id} from={Math.max(0, start)}>
            {audio}
          </Sequence>
        );
      })}
    </>
  );
};
