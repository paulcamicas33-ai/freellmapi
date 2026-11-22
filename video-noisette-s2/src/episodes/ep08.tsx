import React from "react";
import { Episode, GROUND } from "../engine/types";
import { Actor, NOI, PISTA } from "../engine/actor";
import { Face, PopWord, Snowball } from "../engine/props";
import { Bonnet } from "../engine/props2";
import { Snowfall, Sparkles } from "../engine/fx";
import { arrive, pop, prog } from "../lib/ease";

const lines = [
  { id: "l1", text: "Brrr ! Pistache a perdu son *bonnet*.", start: 3.4, end: 7.0 },
  { id: "l2", text: "On va le *chercher* ensemble !", start: 7.4, end: 11.0, speaker: "Noisette" },
  { id: "l3", text: "Celui-là est bleu… celui-là est *vert*…", start: 11.4, end: 15.4 },
  { id: "l4", text: "Il est de quelle couleur, ton bonnet ? *Orange* !", start: 15.8, end: 19.8, speaker: "Noisette" },
  { id: "l5", text: "Le voilà ! Sur la tête du *bonhomme* de neige !", start: 20.2, end: 24.2 },
  { id: "l6", text: "Moi *aussi* j'ai bien chaud maintenant !", start: 24.6, end: 28.4, speaker: "Pistache" },
  { id: "l7", text: "À très *vite* !", start: 33.3, end: 35.9, speaker: "Noisette" },
];

export const ep08: Episode = {
  id: "ep08", season: 2, number: 8, title: "Le bonnet perdu", duration: 36, endAt: 29.2, lines,
  scenes: [{
    id: "all", start: 0, end: 36, place: "snow", zoom: [[0, 1], [20, 1.04], [36, 1.04]],
    world: (t) => {
      const sm = { x: 860, y: GROUND };
      const take = arrive(prog(t, 22.6, 23.6));
      const pisHead = { x: 700, y: GROUND + 8 - 380 * 1.12 };
      const smHead = { x: sm.x, y: sm.y - 330 - 70 };
      const bx = smHead.x + (pisHead.x - smHead.x) * take, by = smHead.y + (pisHead.y - 30 - smHead.y) * take - Math.sin(take * Math.PI) * 120;
      return (
        <g>
          <Snowball x={sm.x} y={sm.y - 110} r={120} />
          <Snowball x={sm.x} y={sm.y - 262} r={84} />
          <Snowball x={sm.x} y={sm.y - 390} r={62} />
          <g transform={`translate(${sm.x},${sm.y - 390})`}><Face s={110} smile={1} /><path d="M -6 10 L 46 18 L -6 26 Z" fill="#ff8a3c" stroke="#b5502a" strokeWidth={3} /></g>
          {t > 11.6 && t < 15.6 ? <Bonnet x={240} y={GROUND - 640} s={pop(prog(t, 11.6, 12.0))} color="#4dabf7" rot={-8} /> : null}
          {t > 13.4 && t < 15.6 ? <Bonnet x={480} y={GROUND - 700} s={pop(prog(t, 13.4, 13.8))} color="#69db7c" rot={6} /> : null}
          <Bonnet x={bx} y={by} s={0.88} color="#ff9f43" rot={take * -6} />
          <PopWord t={t} at={18.4} dur={1.4} x={540} y={GROUND - 780} text="ORANGE !" size={110} color="#ff9f43" />
          <Sparkles t={t} at={20.4} x={sm.x} y={sm.y - 460} n={16} color="#ff9f43" />
          <Actor id="pis" who={PISTA} t={t} lines={lines} x={[[0, 700]]} facing={[[0, -1], [20.2, 1]]}
            beats={[
              { at: 0, to: 3.4, act: "scared" }, { at: 3.4, to: 7.4, act: "sad", look: [0, -0.5] }, { at: 7.4, to: 11.4, act: "curious", look: [-1, 0] },
              { at: 11.4, to: 20.2, act: "think" }, { at: 20.2, to: 22.6, act: "surprise", look: [1, -0.5] },
              { at: 22.6, to: 29.2, act: "joy" }, { at: 29.2, to: 36, act: "wave" },
            ]}
            extra={(tt) => (tt < 22.6 ? { sx: 1 + Math.sin(tt * 40) * 0.008 } : {})} />
          <Actor id="noi" who={NOI} t={t} lines={lines} x={[[0, 280]]} facing={[[0, 1]]}
            beats={[
              { at: 0, to: 3.4, act: "wave" }, { at: 3.4, to: 7.4, act: "curious", look: [1, 0] }, { at: 7.4, to: 11.4, act: "open" },
              { at: 11.4, to: 15.8, act: "think" }, { at: 15.8, to: 20.2, act: "point" }, { at: 20.2, to: 24.6, act: "joy", look: [1, -0.5] },
              { at: 24.6, to: 29.2, act: "proud" }, { at: 29.2, to: 36, act: "wave" },
            ]} />
          <Snowfall t={t} n={70} />
        </g>
      );
    },
  }],
};
