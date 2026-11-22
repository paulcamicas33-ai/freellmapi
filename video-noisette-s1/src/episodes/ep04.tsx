import React from "react";
import { Episode, GROUND } from "../engine/types";
import { Actor, NOI, POMPON } from "../engine/actor";
import { Face, PopWord, Snowball } from "../engine/props";
import { Snowfall, Sparkles } from "../engine/fx";
import { arrive, pop, prog } from "../lib/ease";

const lines = [
  { id: "l1", text: "Il neige ! Noisette veut faire un *bonhomme*.", start: 3.4, end: 6.8 },
  { id: "l2", text: "Mais ses piquants font… *pop* !", start: 7.2, end: 10.6 },
  { id: "l3", text: "Pompon ! On le *construit* ensemble ?", start: 11.0, end: 14.8, speaker: "Noisette" },
  { id: "l4", text: "Pompon roule les boules, Noisette porte la *tête* !", start: 15.2, end: 19.2 },
  { id: "l5", text: "Et voilà mon *écharpe* !", start: 19.6, end: 23.0, speaker: "Noisette" },
  { id: "l6", text: "Seul c'est dur, mais ensemble c'est *facile* !", start: 23.6, end: 27.6 },
  { id: "l7", text: "À très *vite* !", start: 32.7, end: 35.6, speaker: "Noisette" },
];

export const ep04: Episode = {
  id: "ep04", number: 4, title: "La première neige", duration: 36, endAt: 28.4, lines,
  scenes: [{
    id: "all", start: 0, end: 36, place: "snow", zoom: [[0, 1], [15, 1.04], [36, 1.03]],
    world: (t) => {
      const firstR = t < 9.0 ? 30 + arrive(prog(t, 7.0, 8.8)) * 70 : 0;
      const sx = 760;
      const base = arrive(prog(t, 15.2, 17.0)) * 120;
      const mid = pop(prog(t, 17.2, 17.7)) * 88;
      const placed = t >= 19.3;
      const noiX = 300 + 260 * prog(t, 17.8, 19.0);
      const drop = arrive(prog(t, 19.0, 19.3));
      const hx = placed ? sx : noiX + (sx - noiX) * drop;
      const hy = placed ? GROUND - 330 : GROUND - 520 + (GROUND - 330 - (GROUND - 520)) * drop - Math.sin(drop * Math.PI) * 60;
      const scarf = pop(prog(t, 20.6, 21.1));
      return (
        <g>
          {firstR > 0 ? <Snowball x={430} y={GROUND - firstR + 10} r={firstR} /> : null}
          <PopWord t={t} at={9.0} x={430} y={GROUND - 260} text="POP !" size={110} color="#5ab0e6" />
          <Sparkles t={t} at={9.0} x={430} y={GROUND - 80} n={16} color="#ffffff" />
          {base > 0 ? <Snowball x={sx} y={GROUND - base + 10} r={base} /> : null}
          {mid > 0 ? <Snowball x={sx} y={GROUND - 2 * 120 - mid + 26} r={mid} /> : null}
          {t >= 17.8 ? (
            <g>
              <Snowball x={hx} y={hy} r={62} />
              {placed ? (
                <g transform={`translate(${hx},${hy})`}>
                  <Face s={110} smile={1} />
                  <path d="M -6 10 L 46 18 L -6 26 Z" fill="#ff8a3c" stroke="#b5502a" strokeWidth={3} />
                </g>
              ) : null}
            </g>
          ) : null}
          {scarf > 0 ? (
            <g transform={`translate(${sx},${GROUND - 268}) scale(${scarf})`}>
              <rect x={-70} y={-14} width={140} height={28} rx={14} fill="#4fb36c" stroke="#2d6e40" strokeWidth={4} />
              <path d="M 30 8 L 52 70 L 22 64 Z" fill="#4fb36c" stroke="#2d6e40" strokeWidth={4} strokeLinejoin="round" />
            </g>
          ) : null}
          <Sparkles t={t} at={21.0} x={sx} y={GROUND - 300} n={16} />
          <Actor id="pompon" who={POMPON} t={t} lines={lines} x={[[0, 1250], [10.4, 1250], [12.0, 960], [15.2, 960], [17.0, 920]]} facing={[[0, -1]]}
            beats={[
              { at: 10.4, to: 12.0, act: "walk", speed: 2.6 }, { at: 12.0, to: 15.2, act: "curious", look: [1, 0] },
              { at: 15.2, to: 17.2, act: "push" }, { at: 17.2, to: 23.6, act: "joy", look: [1, -0.3] }, { at: 23.6, to: 36, act: "open" },
            ]} />
          <Actor id="noi" who={NOI} t={t} lines={lines} x={[[0, 100], [2.6, 300], [17.8, 300], [19.0, 560]]} facing={[[0, 1]]}
            extra={(tt) => (tt >= 17.8 && tt < 19.0 ? { armL: 172, armR: -172, reachL: 1, reachR: 1, lookY: -0.9 } : {})}
            beats={[
              { at: 0, to: 2.6, act: "walk", speed: 1.8 }, { at: 3.4, to: 7.0, act: "joy", look: [0.4, -0.6] },
              { at: 7.0, to: 9.0, act: "push" }, { at: 9.0, to: 10.0, act: "surprise" }, { at: 10.0, to: 11.0, act: "sad" },
              { at: 11.0, to: 15.2, act: "open" }, { at: 15.2, to: 17.8, act: "curious", look: [1, 0] },
              { at: 17.8, to: 19.0, act: "walk", speed: 1.6 }, { at: 19.0, to: 19.6, act: "open" },
              { at: 19.6, to: 23.6, act: "proud" }, { at: 23.6, to: 28.4, act: "joy" }, { at: 28.4, to: 36, act: "wave" },
            ]} />
          <Snowfall t={t} />
        </g>
      );
    },
  }],
};
