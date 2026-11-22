import React from "react";
import { Episode, GROUND } from "../engine/types";
import { Actor, NOI } from "../engine/actor";
import { PopWord, Snail } from "../engine/props";
import { CountUp, Sparkles } from "../engine/fx";
import { keys } from "../lib/ease";

const lines = [
  { id: "l1", text: "Aujourd'hui, c'est la grande *course* !", start: 3.4, end: 6.8 },
  { id: "l2", text: "Prêts ? On compte : 3, 2, *1* !", start: 7.2, end: 10.6, speaker: "Noisette" },
  { id: "l3", text: "Lili l'escargot avance tout *doucement*…", start: 11.8, end: 15.0 },
  { id: "l4", text: "Je t'attends ! On avance *ensemble* ?", start: 15.4, end: 19.0, speaker: "Noisette" },
  { id: "l5", text: "Ils avancent côte à côte, pas à *pas*.", start: 19.4, end: 23.4 },
  { id: "l6", text: "Le plus beau, c'est d'arriver *ensemble* !", start: 25.1, end: 28.8, speaker: "Noisette" },
  { id: "l7", text: "À très *vite* !", start: 33.3, end: 35.9, speaker: "Noisette" },
];
const FINISH = 900;

export const ep06: Episode = {
  id: "ep06", number: 6, title: "La course des escargots", duration: 36, endAt: 29.2, lines,
  scenes: [{
    id: "all", start: 0, end: 36, place: "meadow", camX: [[0, 0], [36, 0]], zoom: [[0, 1], [11, 1.03], [36, 1.03]],
    world: (t) => {
      const snailX = keys(t, [[0, 200], [11.0, 200], [19.4, 330], [24.0, 760]], (x) => x);
      return (
        <g>
          <g>
            <rect x={FINISH - 6} y={GROUND - 300} width={12} height={320} fill="#8a5a3a" />
            {Array.from({ length: 6 }, (_, i) => (
              <rect key={i} x={FINISH + 6 + (i % 2) * 40} y={GROUND - 300 + Math.floor(i / 2) * 40} width={40} height={40} fill={i % 3 === (i % 2 ? 1 : 0) ? "#ffffff" : "#3b2416"} />
            ))}
            <path d={`M 120 ${GROUND + 30} L 260 ${GROUND + 30}`} stroke="#ffffff" strokeWidth={8} strokeDasharray="16 10" />
          </g>
          <Snail x={snailX} y={GROUND + 30} s={0.95} t={t} moving={t > 11 && t < 24} happy={t > 15.4 ? 1 : 0.6} />
          <PopWord t={t} at={10.9} dur={1.2} x={540} y={GROUND - 640} text="PARTEZ !" size={110} color="#ff7a59" />
          <PopWord t={t} at={24.1} dur={1.4} x={760} y={GROUND - 600} text="BRAVO !" size={110} color="#4fb36c" />
          <Sparkles t={t} at={24.1} x={FINISH - 60} y={GROUND - 300} n={20} spread={300} />
          <Actor id="noi" who={NOI} t={t} lines={lines} x={[[0, 360], [11.0, 360], [12.6, 700], [15.4, 700], [17.0, 470], [19.4, 470], [24.0, 800]]}
            facing={[[0, 1], [12.6, -1], [17.0, 1]]}
            beats={[
              { at: 0, to: 3.4, act: "wave" }, { at: 3.4, to: 7.2, act: "joy" }, { at: 7.2, to: 11.0, act: "open" },
              { at: 11.0, to: 12.6, act: "walk", speed: 2.8 }, { at: 12.6, to: 15.4, act: "curious", look: [1, 0.4] },
              { at: 15.4, to: 17.0, act: "walk", speed: 1.8 }, { at: 17.0, to: 19.4, act: "open" },
              { at: 19.4, to: 24.0, act: "walk", speed: 1.2 }, { at: 24.0, to: 29.2, act: "joy" }, { at: 29.2, to: 36, act: "wave" },
            ]} />
        </g>
      );
    },
    overlay: (t) => <CountUp t={t} items={[{ at: 8.6, text: "3" }, { at: 9.4, text: "2" }, { at: 10.2, text: "1" }]} y={300} />,
  }],
};
