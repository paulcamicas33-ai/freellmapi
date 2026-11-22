import React from "react";
import { Episode, GROUND } from "../engine/types";
import { Actor, NOI, POMPON } from "../engine/actor";
import { Bubble, Dragon, PopWord } from "../engine/props";
import { Sparkles } from "../engine/fx";
import { rand } from "../lib/noise";

const lines = [
  { id: "l1", text: "Voici Flamme, un tout petit *dragon*.", start: 3.4, end: 6.8 },
  { id: "l2", text: "Il veut cracher du feu… mais il fait des *bulles* !", start: 7.2, end: 11.0 },
  { id: "l3", text: "Des bulles ? Mais c'est *magique* !", start: 11.4, end: 14.8, speaker: "Noisette" },
  { id: "l4", text: "Souffle encore ! On essaie *ensemble* ?", start: 15.2, end: 18.8, speaker: "Noisette" },
  { id: "l5", text: "Des bulles partout ! Tout le monde *rit*.", start: 19.2, end: 23.0 },
  { id: "l6", text: "Sois *toi-même* : c'est ça, ta magie !", start: 23.4, end: 27.6, speaker: "Noisette" },
  { id: "l7", text: "À très *vite* !", start: 32.7, end: 35.6, speaker: "Noisette" },
];

/** Bubbles emitted from the dragon's mouth between a and b, rising and drifting. */
const bubbles = (t: number, a: number, b: number, from: { x: number; y: number }, n: number, seed: number) =>
  Array.from({ length: n }, (_, i) => {
    const born = a + (i / n) * (b - a);
    const age = t - born;
    if (age < 0 || age > 5) return null;
    const x = from.x + age * (60 + rand(seed, i) * 140) * (rand(seed + 1, i) > 0.5 ? 1 : -1) + Math.sin(age * 2 + i) * 20;
    const y = from.y - age * (80 + rand(seed + 2, i) * 90);
    return <Bubble key={`${seed}-${i}`} x={x} y={y} r={18 + rand(seed + 3, i) * 30} t={t} />;
  });

export const ep09: Episode = {
  id: "ep09", number: 9, title: "Le tout petit dragon", duration: 36, endAt: 28.4, lines,
  scenes: [{
    id: "all", start: 0, end: 36, place: "meadow", zoom: [[0, 1], [15, 1.04], [36, 1.03]],
    world: (t) => {
      const dx = 790;
      const mouth = { x: dx - 70, y: GROUND - 150 };
      const blowing = (t > 8.4 && t < 10.4) || (t > 19.2 && t < 26);
      const happy = t > 11.4 ? 1 : t > 10.4 ? 0 : 0.7;
      return (
        <g>
          {bubbles(t, 8.4, 10.4, mouth, 8, 11)}
          {bubbles(t, 19.2, 26.0, mouth, 34, 21)}
          <Dragon x={dx} y={GROUND + 20} s={1.15} t={t} facing={-1} blow={blowing ? 1 : 0} happy={happy} />
          <PopWord t={t} at={8.5} x={dx} y={GROUND - 520} text="PFFF…" size={80} color="#7fcf8a" />
          <Sparkles t={t} at={19.3} x={mouth.x} y={mouth.y - 60} n={14} color="#f9a8d4" />
          <Actor id="pompon" who={POMPON} t={t} lines={lines} x={[[0, -200], [18.6, -200], [20.2, 140]]} facing={[[0, 1]]} scale={0.95}
            beats={[{ at: 18.6, to: 20.2, act: "walk", speed: 2.8 }, { at: 20.2, to: 36, act: "laugh" }]} />
          <Actor id="noi" who={NOI} t={t} lines={lines} x={[[0, 100], [2.8, 360]]} facing={[[0, 1]]}
            beats={[
              { at: 0, to: 2.8, act: "walk", speed: 1.9 }, { at: 3.4, to: 7.2, act: "curious", look: [1, 0] },
              { at: 7.2, to: 11.4, act: "surprise", look: [1, -0.5] }, { at: 11.4, to: 15.2, act: "joy", look: [0.6, -0.6] },
              { at: 15.2, to: 19.2, act: "open" }, { at: 19.2, to: 23.4, act: "laugh" }, { at: 23.4, to: 28.4, act: "point" },
              { at: 28.4, to: 36, act: "wave" },
            ]} />
        </g>
      );
    },
  }],
};
