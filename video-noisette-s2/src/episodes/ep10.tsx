import React from "react";
import { Episode, GROUND } from "../engine/types";
import { Actor, NOI, PISTA } from "../engine/actor";
import { Burrow, MoonFace, PopWord } from "../engine/props";
import { Fence, Sheep } from "../engine/props2";
import { CountUp, Zzz } from "../engine/fx";
import { prog } from "../lib/ease";

const lines = [
  { id: "l1", text: "Ce soir, Pistache dort chez *Noisette* !", start: 3.4, end: 7.0 },
  { id: "l2", text: "Mais Pistache n'a pas *sommeil*…", start: 7.4, end: 10.6 },
  { id: "l3", text: "On compte les *moutons* ensemble ?", start: 11.0, end: 14.8, speaker: "Noisette" },
  { id: "l4", text: "Un mouton, deux moutons, trois *moutons*…", start: 15.2, end: 20.6 },
  { id: "l5", text: "Pistache bâille… Noisette aussi… *Chut* !", start: 21.0, end: 24.8 },
  { id: "l6", text: "Moi *aussi*… j'ai sommeil… Bonne nuit…", start: 25.2, end: 28.8, speaker: "Pistache" },
  { id: "l7", text: "Bonne nuit les enfants… À très *vite* !", start: 33.2, end: 35.6 },
];
const SHEEP = [15.8, 17.6, 19.4];

export const ep10: Episode = {
  id: "ep10", season: 2, number: 10, title: "La soirée pyjama", duration: 36, endAt: 29.4, lines,
  scenes: [{
    id: "all", start: 0, end: 36, place: "night", zoom: [[0, 1], [21, 1.04], [36, 1.07]],
    world: (t) => {
      const fx = 560, fy = GROUND + 40;
      return (
        <g>
          <Burrow x={150} y={GROUND + 6} s={0.75} light={t < 24 ? 1 : 0.4} />
          <MoonFace x={820} y={420} r={85} t={t} blink={t > 22 ? 1 : 0} smile={1} />
          {t > 15 && t < 21.4 ? <Fence x={fx} y={fy} s={1.1} /> : null}
          <PopWord t={t} at={21.4} x={500} y={GROUND - 560} text="CHUT…" size={80} color="#cfd8ff" />
          {t > 25.6 ? <Zzz t={t} x={330} y={GROUND - 500} /> : null}
          {t > 27.0 ? <Zzz t={t + 0.7} x={760} y={GROUND - 480} /> : null}
          <Actor id="pis" who={PISTA} t={t} lines={lines} x={[[0, 1200], [2.0, 1200], [3.8, 760]]} facing={[[0, -1]]}
            beats={[
              { at: 2.0, to: 3.8, act: "walk", speed: 2.6 }, { at: 3.8, to: 7.4, act: "joy" }, { at: 7.4, to: 11.0, act: "dance" },
              { at: 11.0, to: 15.2, act: "curious", look: [-1, 0] }, { at: 15.2, to: 21.0, act: "lookUp", look: [0, -0.7] },
              { at: 21.0, to: 25.2, act: "yawn" }, { at: 25.2, to: 36, act: "sleep" },
            ]} />
          <Actor id="noi" who={NOI} t={t} lines={lines} lantern={[[0, 24]]} x={[[0, 360]]} facing={[[0, 1]]}
            beats={[
              { at: 0, to: 3.4, act: "wave" }, { at: 3.4, to: 7.4, act: "joy" }, { at: 7.4, to: 11.0, act: "curious", look: [1, 0] },
              { at: 11.0, to: 15.2, act: "open" }, { at: 15.2, to: 21.0, act: "lookUp", look: [0.4, -0.7] },
              { at: 21.0, to: 24.8, act: "yawn" }, { at: 24.8, to: 36, act: "sleep" },
            ]} />
          {SHEEP.map((s, i) => {
            const k = prog(t, s, s + 1.6);
            if (k <= 0 || k >= 1) return null;
            return <Sheep key={i} x={-80 + k * 1240} y={fy - 40 - Math.sin(k * Math.PI) * 260} s={1.05} t={t} sleepy={i === 2 ? 0.9 : 0} />;
          })}
        </g>
      );
    },
    overlay: (t) => <CountUp t={t} items={SHEEP.map((s, i) => ({ at: s + 0.7, text: String(i + 1), color: "#ffffff" }))} y={300} />,
  }],
};
