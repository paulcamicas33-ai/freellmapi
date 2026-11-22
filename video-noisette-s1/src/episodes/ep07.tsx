import React from "react";
import { Episode, GROUND } from "../engine/types";
import { Actor, NOI, LOU } from "../engine/actor";
import { Cake, PopWord } from "../engine/props";
import { CountUp, Sparkles } from "../engine/fx";
import { prog, pop } from "../lib/ease";

const lines = [
  { id: "l1", text: "Aujourd'hui, c'est l'anniversaire de *Lou* !", start: 3.4, end: 6.8 },
  { id: "l2", text: "Oups ! Le gâteau *tombe*…", start: 7.4, end: 10.6 },
  { id: "l3", text: "Pas de souci ! On va en *refaire* un !", start: 11.0, end: 14.8, speaker: "Noisette" },
  { id: "l4", text: "Des fruits, de la crème… un *nouveau* gâteau !", start: 15.2, end: 19.0 },
  { id: "l5", text: "Souffle avec Lou : 1, 2, 3… *Fffff* !", start: 19.4, end: 23.4, speaker: "Noisette" },
  { id: "l6", text: "Un gâteau raté, ça se *répare* entre amis.", start: 23.8, end: 27.6 },
  { id: "l7", text: "Joyeux anniversaire ! À très *vite* !", start: 32.4, end: 35.9, speaker: "Noisette" },
];

export const ep07: Episode = {
  id: "ep07", number: 7, title: "Le gâteau de Lou", duration: 36, endAt: 27.8, lines,
  scenes: [{
    id: "all", start: 0, end: 36, place: "sunset", zoom: [[0, 1], [15, 1.04], [36, 1.03]],
    world: (t) => {
      const fallen = t >= 8.2 && t < 15.6 ? 1 : 0;
      const back = pop(prog(t, 15.6, 16.1));
      const fruits = prog(t, 16.4, 18.6);
      const carry = t < 8.2;
      const cakeX = carry ? 120 + Math.min(1, t / 7.6) * 210 : 540;
      const cakeY = carry ? GROUND - 470 : GROUND + 40;
      return (
        <g>
          {t >= 15.6 ? (
            <g transform={`translate(540,${GROUND + 40}) scale(${back}) translate(-540,${-(GROUND + 40)})`}>
              <Cake x={540} y={GROUND + 40} s={1.15} t={t} fruits={fruits} lit={t < 22.8 ? 1 : 0} />
            </g>
          ) : (
            <Cake x={cakeX} y={cakeY} s={carry ? 0.75 : 1.15} t={t} fallen={fallen} lit={1} />
          )}
          <PopWord t={t} at={8.2} x={540} y={GROUND - 260} text="SPLAT !" size={110} color="#e85a8a" />
          <Sparkles t={t} at={15.7} x={540} y={GROUND - 120} n={16} color="#ffd166" />
          <Sparkles t={t} at={22.8} x={540} y={GROUND - 200} n={14} color="#ffffff" />
          <Actor id="lou" who={LOU} t={t} lines={lines} x={[[0, 1250], [3.4, 1250], [5.4, 860]]} facing={[[0, -1]]}
            beats={[
              { at: 3.4, to: 5.4, act: "walk", speed: 2.6 }, { at: 5.4, to: 8.2, act: "joy" }, { at: 8.2, to: 11.0, act: "sad", look: [1, 0.6] },
              { at: 11.0, to: 15.6, act: "curious", look: [1, 0.4] }, { at: 15.6, to: 21.6, act: "joy" },
              { at: 21.6, to: 23.4, act: "blow", look: [1, 0.4] }, { at: 23.4, to: 36, act: "joy" },
            ]} />
          <Actor id="noi" who={NOI} t={t} lines={lines} x={[[0, 120], [7.6, 330]]} facing={[[0, 1]]}
            beats={[
              { at: 0, to: 7.6, act: "walk", speed: 0.9 }, { at: 8.2, to: 9.4, act: "surprise" }, { at: 9.4, to: 11.0, act: "sad", look: [1, 0.6] },
              { at: 11.0, to: 15.2, act: "open" }, { at: 15.2, to: 19.4, act: "joy" }, { at: 19.4, to: 23.4, act: "point" },
              { at: 23.4, to: 28.4, act: "proud" }, { at: 28.4, to: 36, act: "wave" },
            ]}
            extra={(tt) => (tt < 7.6 ? { armL: 172, armR: -172, reachL: 1, reachR: 1, lookY: -0.8 } : {})} />
        </g>
      );
    },
    overlay: (t) => <CountUp t={t} items={[{ at: 20.4, text: "1" }, { at: 21.1, text: "2" }, { at: 21.8, text: "3" }]} y={300} />,
  }],
};
