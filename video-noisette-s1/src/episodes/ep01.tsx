import React from "react";
import { Episode, GROUND } from "../engine/types";
import { Actor, NOI, headOf } from "../engine/actor";
import { MoonFace, PopWord } from "../engine/props";
import { CountUp, Fireflies, Sparkles } from "../engine/fx";

const HICS = [3.0, 4.6, 6.2, 7.8, 9.4, 11.0, 12.6, 14.25, 15.7];
const hicAt = (t: number) => Math.max(0, ...HICS.map((h) => (t >= h && t < h + 0.35 ? Math.sin(((t - h) / 0.35) * Math.PI) : 0)));
const MOON = { x: 290, y: 650, r: 115 };

const lines = [
  { id: "l1", text: "Cette nuit, la Lune a le *hoquet* !", start: 3.4, end: 6.5 },
  { id: "l2", text: "Pauvre Lune… On va essayer de la *guérir* !", start: 6.9, end: 10.4, speaker: "Noisette" },
  { id: "l3", text: "Et si on lui faisait peur ? *Bouh* !", start: 11.0, end: 14.8, speaker: "Noisette" },
  { id: "l4", text: "Retiens ton souffle avec nous : 1, 2, *3* !", start: 15.4, end: 20.3, speaker: "Noisette" },
  { id: "l5", text: "Plus de hoquet ! La Lune *brille* de joie.", start: 21.2, end: 25.0 },
  { id: "l6", text: "Ensemble, on y arrive *toujours* !", start: 25.6, end: 29.4, speaker: "Noisette" },
  { id: "l7", text: "À très *vite* !", start: 33.3, end: 35.6, speaker: "Noisette" },
];

export const ep01: Episode = {
  id: "ep01", number: 1, title: "La Lune a le hoquet", duration: 36, endAt: 29.6, lines,
  scenes: [{
    id: "all", start: 0, end: 36, place: "night",
    zoom: [[0, 1.0], [12, 1.04], [21, 1.06], [36, 1.03]], camY: [[0, 0], [36, -10]],
    world: (t) => {
      const breath = t >= 16.4 && t < 20.5 ? Math.min(1, (t - 16.4) / 0.4) : 0;
      const happy = t >= 20.5;
      const noiX = 600;
      return (
        <g>
          {happy ? <Fireflies t={t} cx={540} cy={GROUND - 520} spread={420} k={Math.min(1, (t - 20.5) / 1.5)} /> : null}
          <MoonFace x={MOON.x} y={MOON.y} r={MOON.r} t={t} hic={happy ? 0 : hicAt(t)} puff={breath}
            mouth={t > 20.5 && t < 21.3 ? 0.6 : 0} blink={happy && t > 24 ? 1 : 0} smile={happy ? 1 : 0.6} />
          {HICS.filter((h) => h < 20).map((h) => <PopWord key={h} t={t} at={h} x={MOON.x + 150} y={MOON.y - 120} text="HIC !" size={70} />)}
          <PopWord t={t} at={13.6} dur={1.2} x={noiX + 40} y={headOf(noiX, NOI.scale).y - 200} text="BOUH !" size={96} color="#4fb36c" />
          <Sparkles t={t} at={20.6} x={MOON.x} y={MOON.y} n={16} spread={260} />
          <Actor id="noi" who={NOI} t={t} lines={lines} lantern={[[0, 36]]}
            x={[[0, 170], [2.6, noiX]]} facing={[[0, 1], [3.0, -1], [6.9, 1], [11.0, -1]]}
            beats={[
              { at: 0, to: 2.6, act: "walk", speed: 2.2 },
              { at: 3.0, to: 4.2, act: "surprise", look: [1, -0.7] },
              { at: 4.2, to: 6.9, act: "lookUp", look: [1, -0.8] },
              { at: 6.9, to: 10.4, act: "open" },
              { at: 10.4, to: 13.5, act: "think", look: [1, -0.6] },
              { at: 13.5, to: 14.6, act: "surprise" },
              { at: 14.6, to: 15.4, act: "sad", look: [1, -0.4] },
              { at: 15.4, to: 16.4, act: "open" },
              { at: 16.4, to: 20.5, act: "proud" },
              { at: 20.5, to: 25.6, act: "joy", look: [1, -0.6] },
              { at: 25.6, to: 30.6, act: "open" },
              { at: 30.6, to: 36, act: "wave" },
            ]}
            extra={(tt) => (tt >= 16.4 && tt < 20.5 ? { sx: 1.05, sy: 1.04 } : {})} />
        </g>
      );
    },
    overlay: (t) => <CountUp t={t} items={[{ at: 17.4, text: "1" }, { at: 18.4, text: "2" }, { at: 19.4, text: "3" }]} y={300} />,
  }],
};
