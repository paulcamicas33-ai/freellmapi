import React from "react";
import { Html5Audio, Sequence, staticFile } from "remotion";
import cues from "../data/cues.json";
import { toFrame } from "../lib/time";

type Cue = { id: string; file: string; t: number; syncAt: number; gainDb: number };

/** One Sequence per cue so each file's sync point lands on its cue time. No cues: silent film. */
export const Sound: React.FC = () => (
  <>
    {(cues as Cue[]).map((cue) => {
      const start = toFrame(cue.t) - toFrame(cue.syncAt);
      const volume = Math.min(1, 10 ** (cue.gainDb / 20));
      return start < 0 ? (
        <Sequence key={cue.id} from={0}>
          <Html5Audio src={staticFile(`audio/${cue.file}`)} trimBefore={-start} volume={volume} />
        </Sequence>
      ) : (
        <Sequence key={cue.id} from={start}>
          <Html5Audio src={staticFile(`audio/${cue.file}`)} volume={volume} />
        </Sequence>
      );
    })}
  </>
);
