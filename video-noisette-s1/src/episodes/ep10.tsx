import React from "react";
import { Episode, GROUND } from "../engine/types";
import { Actor, NOI } from "../engine/actor";
import { Burrow, MoonFace, PopWord, Toothbrush } from "../engine/props";
import { Fireflies, Zzz } from "../engine/fx";
import { prog } from "../lib/ease";

const lines = [
  { id: "l1", text: "Le soleil s'est couché. C'est l'heure du *dodo* !", start: 3.4, end: 7.0 },
  { id: "l2", text: "D'abord, on se brosse les *dents* !", start: 7.4, end: 10.8, speaker: "Noisette" },
  { id: "l3", text: "Brosse avec moi : en haut, en bas, *ensemble* !", start: 11.2, end: 15.0, speaker: "Noisette" },
  { id: "l4", text: "Puis on dit bonne nuit à la *Lune*.", start: 15.4, end: 19.0 },
  { id: "l5", text: "Bonne nuit la Lune ! Bonne nuit les *étoiles* !", start: 19.4, end: 23.2, speaker: "Noisette" },
  { id: "l6", text: "Noisette fait de beaux *rêves*…", start: 23.6, end: 27.6 },
  { id: "l7", text: "Bonne nuit les enfants… À très *vite* !", start: 32.7, end: 35.6 },
];

export const ep10: Episode = {
  id: "ep10", number: 10, title: "Bonne nuit, Noisette", duration: 36, endAt: 28.4, lines,
  scenes: [{
    id: "all", start: 0, end: 36, place: "night", zoom: [[0, 1], [15, 1.05], [23, 1.08], [36, 1.08]],
    world: (t) => {
      const nx = 600;
      const brushing = t >= 8.0 && t < 15.0;
      const mouth = { x: nx + 24, y: GROUND + 8 - 202 * NOI.scale };
      return (
        <g>
          <Burrow x={200} y={GROUND + 6} s={0.85} light={t < 23.6 ? 1 : 0.4} />
          <MoonFace x={300} y={560} r={95} t={t} blink={t > 23.6 ? 1 : 0} smile={1} mouth={t > 19.4 && t < 20.4 ? 0.5 : 0} />
          {t > 15.4 ? <Fireflies t={t} cx={540} cy={GROUND - 520} spread={420} k={Math.min(1, prog(t, 15.4, 16.6)) * 0.8} /> : null}
          <Actor id="noi" who={NOI} t={t} lines={lines} lantern={[[0, 8.0], [15.0, 36]]} x={[[0, nx]]} facing={[[0, 1], [15.4, -1]]}
            beats={[
              { at: 0, to: 3.4, act: "wave" }, { at: 3.4, to: 7.4, act: "yawn" }, { at: 7.4, to: 8.0, act: "open" },
              { at: 8.0, to: 15.0, act: "brush" }, { at: 15.4, to: 19.4, act: "lookUp", look: [1, -0.8] },
              { at: 19.4, to: 23.6, act: "wave", look: [1, -0.8] }, { at: 23.6, to: 36, act: "sleep" },
            ]} />
          {brushing ? (
            <g>
              <Toothbrush x={mouth.x + 20} y={mouth.y + 40 + Math.sin(t * 14) * 10} rot={-60} s={1.1} />
              {[0, 1, 2, 3].map((i) => {
                const k = (t * 1.2 + i / 4) % 1;
                return <circle key={i} cx={mouth.x - 20 + i * 14 + k * 30} cy={mouth.y - k * 80} r={6 + k * 6} fill="#ffffff" opacity={0.9 * (1 - k)} />;
              })}
            </g>
          ) : null}
          <PopWord t={t} at={12.4} x={nx + 220} y={GROUND - 560} text="EN HAUT !" size={70} color="#5ab0e6" />
          <PopWord t={t} at={13.6} x={nx + 220} y={GROUND - 380} text="EN BAS !" size={70} color="#5ab0e6" />
          {t > 24.4 ? <Zzz t={t} x={nx + 80} y={GROUND - 520} /> : null}
        </g>
      );
    },
  }],
};
