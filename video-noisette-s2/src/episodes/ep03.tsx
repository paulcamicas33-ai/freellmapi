import React from "react";
import { Episode, GROUND } from "../engine/types";
import { Actor, NOI, PISTA } from "../engine/actor";
import { PopWord } from "../engine/props";
import { Kite } from "../engine/props2";
import { CountUp, Sparkles } from "../engine/fx";
import { Tree } from "../world/Props";
import { cam, keys, prog } from "../lib/ease";

const lines = [
  { id: "l1", text: "Le vent souffle ! C'est le jour du *cerf-volant*.", start: 3.4, end: 7.0 },
  { id: "l2", text: "Oh non ! Il est coincé dans l'*arbre* !", start: 7.6, end: 11.0, speaker: "Pistache" },
  { id: "l3", text: "On tire la ficelle ? On essaie *ensemble* ?", start: 11.4, end: 15.0, speaker: "Noisette" },
  { id: "l4", text: "Tire avec nous : 1, 2, 3… *tirez* !", start: 15.4, end: 19.6 },
  { id: "l5", text: "Il vole ! Rouge, jaune, *bleu* !", start: 20.2, end: 23.8, speaker: "Noisette" },
  { id: "l6", text: "Moi *aussi*, je vole avec le vent !", start: 24.2, end: 28.0, speaker: "Pistache" },
  { id: "l7", text: "À très *vite* !", start: 32.7, end: 35.6, speaker: "Noisette" },
];

export const ep03: Episode = {
  id: "ep03", season: 2, number: 3, title: "Le cerf-volant", duration: 36, endAt: 28.6, lines,
  scenes: [{
    id: "all", start: 0, end: 36, place: "meadow", zoom: [[0, 1], [20, 1.02], [36, 1.02]], camY: [[0, 0], [19.4, 0], [21, -60], [36, -40]],
    world: (t) => {
      const free = cam(prog(t, 19.2, 20.6));
      const stuck = { x: 860, y: GROUND - 560 };
      const sky = { x: 760, y: 360 + Math.sin(t * 0.8) * 30 };
      const kx = t < 7.4 ? keys(t, [[0, 300], [3, 520], [7.4, stuck.x]]) : stuck.x + (sky.x - stuck.x) * free;
      const ky = t < 7.4 ? keys(t, [[0, 700], [3, 420], [7.4, stuck.y]]) : stuck.y + (sky.y - stuck.y) * free;
      const shake = t > 15.4 && t < 19.2 ? Math.sin(t * 30) * 6 : 0;
      return (
        <g>
          <Tree id="kt" t={t} x={880} y={GROUND - 20} leaf="#5fa84a" scale={1.6} seed={2} />
          <Kite x={kx + shake} y={ky} t={t} sx={430} sy={GROUND - 330} s={1.1} rot={-10} />
          <PopWord t={t} at={7.6} x={820} y={GROUND - 820} text="OH NON !" size={84} color="#ff6b6b" />
          <PopWord t={t} at={19.3} dur={1.2} x={540} y={GROUND - 760} text="HOURRA !" size={100} color="#4fb36c" />
          <Sparkles t={t} at={19.6} x={sky.x} y={sky.y} n={16} />
          <Actor id="pis" who={PISTA} t={t} lines={lines} x={[[0, 520], [11.2, 520]]} facing={[[0, 1]]}
            beats={[
              { at: 0, to: 7.6, act: "joy", look: [0.5, -0.9] }, { at: 7.6, to: 11.4, act: "sad", look: [1, -0.8] },
              { at: 11.4, to: 15.4, act: "curious", look: [-1, 0] }, { at: 15.4, to: 19.4, act: "pull" },
              { at: 19.4, to: 28.6, act: "joy", look: [0.4, -0.9] }, { at: 28.6, to: 36, act: "wave" },
            ]} />
          <Actor id="noi" who={NOI} t={t} lines={lines} x={[[0, 100], [2.6, 300]]} facing={[[0, 1]]}
            beats={[
              { at: 0, to: 2.6, act: "walk", speed: 1.8 }, { at: 2.6, to: 7.6, act: "point", look: [1, -0.8] },
              { at: 7.6, to: 11.4, act: "surprise" }, { at: 11.4, to: 15.4, act: "open" }, { at: 15.4, to: 19.4, act: "pull" },
              { at: 19.4, to: 24.2, act: "point", look: [1, -0.9] }, { at: 24.2, to: 28.6, act: "joy" }, { at: 28.6, to: 36, act: "wave" },
            ]} />
        </g>
      );
    },
    overlay: (t) => <CountUp t={t} items={[{ at: 16.6, text: "1" }, { at: 17.4, text: "2" }, { at: 18.2, text: "3" }]} y={300} />,
  }],
};
