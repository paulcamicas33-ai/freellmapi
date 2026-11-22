import React from "react";
import { Episode, GROUND } from "../engine/types";
import { Actor, NOI, PISTA } from "../engine/actor";
import { PopWord } from "../engine/props";
import { CountUp, Sparkles } from "../engine/fx";
import { Bush } from "../world/Props";
import { arrive, prog } from "../lib/ease";

const lines = [
  { id: "l1", text: "On joue à *cache-cache* ! Noisette compte.", start: 3.4, end: 6.8 },
  { id: "l2", text: "Compte avec moi : 1, 2, 3, 4, *5* !", start: 7.2, end: 12.4, speaker: "Noisette" },
  { id: "l3", text: "Où est Pistache ? Tu le *vois* ?", start: 12.8, end: 16.4, speaker: "Noisette" },
  { id: "l4", text: "Sa *queue* dépasse du buisson !", start: 16.8, end: 20.4 },
  { id: "l5", text: "Trouvé ! À toi de *compter* maintenant !", start: 20.8, end: 24.6, speaker: "Noisette" },
  { id: "l6", text: "Moi *aussi* je veux encore jouer !", start: 25.0, end: 28.6, speaker: "Pistache" },
  { id: "l7", text: "À très *vite* !", start: 33.3, end: 35.9, speaker: "Noisette" },
];
const COUNT = [8.3, 9.2, 10.1, 11.0, 11.9];

export const ep02: Episode = {
  id: "ep02", season: 2, number: 2, title: "Cache-cache", duration: 36, endAt: 29.2, lines,
  scenes: [{
    id: "all", start: 0, end: 36, place: "forest", zoom: [[0, 1], [12, 1.04], [36, 1.04]],
    world: (t) => {
      const hidden = t >= 9.0 && t < 20.4;
      const found = arrive(prog(t, 20.2, 20.8));
      const tailWag = Math.sin(t * 6) * 10;
      return (
        <g>
          {t < 9.0 ? (
            <Actor id="pis-run" who={PISTA} t={t} lines={lines} x={[[0, 640], [7.2, 640], [9.0, 880]]} facing={[[0, -1], [7.2, 1]]}
              beats={[{ at: 0, to: 7.2, act: "joy" }, { at: 7.2, to: 9.0, act: "walk", speed: 3 }]} />
          ) : null}
          {hidden ? (
            <path d={`M 940 ${GROUND - 40} C 1010 ${GROUND - 60} ${1030 + tailWag} ${GROUND - 140} ${1000 + tailWag} ${GROUND - 190}`} fill="none" stroke="#e8a0b4" strokeWidth={9} strokeLinecap="round" />
          ) : null}
          <Bush x={870} y={GROUND + 30} scale={2.0} color="#3f8a45" />
          {t >= 20.2 ? (
            <Actor id="pis" who={PISTA} t={t} lines={lines} x={[[20.2, 870]]} y={GROUND + 8 - found * 0} facing={[[0, -1]]}
              beats={[{ at: 20.2, to: 21.4, act: "surprise" }, { at: 21.4, to: 25.0, act: "laugh" }, { at: 25.0, to: 29.2, act: "joy" }, { at: 29.2, to: 36, act: "wave" }]} />
          ) : null}
          <PopWord t={t} at={15.6} dur={1.4} x={940} y={GROUND - 360} text="LÀ !" size={110} color="#ff9f43" />
          <PopWord t={t} at={20.3} dur={1.2} x={700} y={GROUND - 640} text="TROUVÉ !" size={100} color="#4fb36c" />
          <Sparkles t={t} at={20.3} x={870} y={GROUND - 200} n={16} />
          <Actor id="noi" who={NOI} t={t} lines={lines} x={[[0, 330], [17.6, 330], [19.6, 560]]} facing={[[0, 1], [7.2, -1], [12.8, 1]]}
            beats={[
              { at: 0, to: 3.4, act: "wave" }, { at: 3.4, to: 7.2, act: "joy" }, { at: 7.2, to: 12.6, act: "hideEyes" },
              { at: 12.8, to: 16.8, act: "curious", look: [1, 0] }, { at: 16.8, to: 17.6, act: "point" },
              { at: 17.6, to: 19.6, act: "walk", speed: 2.2 }, { at: 19.6, to: 20.8, act: "surprise" },
              { at: 20.8, to: 25.0, act: "laugh" }, { at: 25.0, to: 29.2, act: "joy" }, { at: 29.2, to: 36, act: "wave" },
            ]} />
        </g>
      );
    },
    overlay: (t) => <CountUp t={t} items={COUNT.map((a, i) => ({ at: a, text: String(i + 1), color: "#ff9f43" }))} y={300} />,
  }],
};
