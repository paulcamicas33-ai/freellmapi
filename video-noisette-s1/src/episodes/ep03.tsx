import React from "react";
import { Episode, GROUND } from "../engine/types";
import { Actor, NOI, LOU } from "../engine/actor";
import { Fish, Pond, PopWord } from "../engine/props";
import { Sparkles } from "../engine/fx";
import { arrive, cam, prog } from "../lib/ease";

const lines = [
  { id: "l1", text: "Sur la plage, un petit poisson est *coincé* !", start: 3.4, end: 6.8 },
  { id: "l2", text: "Il est de quelle couleur ? *Orange* !", start: 7.2, end: 10.6, speaker: "Noisette" },
  { id: "l3", text: "Ne t'en fais pas ! On essaie *ensemble* ?", start: 11.0, end: 14.6, speaker: "Noisette" },
  { id: "l4", text: "Ils creusent un petit *chemin* jusqu'à la mer.", start: 15.0, end: 18.8 },
  { id: "l5", text: "Plouf ! Le poisson retrouve sa *maman* !", start: 19.2, end: 22.8 },
  { id: "l6", text: "Aider un ami, ça rend tout *joyeux* !", start: 23.2, end: 27.2, speaker: "Noisette" },
  { id: "l7", text: "À très *vite* !", start: 32.7, end: 35.6, speaker: "Noisette" },
];

export const ep03: Episode = {
  id: "ep03", number: 3, title: "Le petit poisson perdu", duration: 36, endAt: 28.0, lines,
  scenes: [{
    id: "all", start: 0, end: 36, place: "beach", zoom: [[0, 1], [15, 1.04], [36, 1.03]],
    world: (t) => {
      const pond = { x: 560, y: GROUND + 70 };
      const dig = prog(t, 15.0, 18.8);
      const swim = cam(prog(t, 19.0, 20.6));
      const sea = { x: 700, y: GROUND - 190 };
      const fx = pond.x + (sea.x - pond.x) * swim, fy = pond.y - 10 + (sea.y - pond.y) * swim - Math.sin(swim * Math.PI) * 90;
      const happy = t > 19 ? 1 : 0;
      const momK = arrive(prog(t, 20.6, 21.2));
      return (
        <g>
          {dig > 0 ? (
            <path d={`M ${pond.x + 40} ${pond.y - 30} Q ${pond.x + 120} ${pond.y - 200} ${sea.x} ${sea.y + 40}`} fill="none" stroke="#4fa6d8" strokeWidth={34} strokeLinecap="round"
              strokeDasharray="700 700" strokeDashoffset={700 * (1 - dig)} opacity={0.9} />
          ) : null}
          <Pond x={pond.x} y={pond.y} rx={150} t={t} />
          {momK > 0 ? <Fish x={sea.x + 170} y={sea.y - 30 - Math.sin((t - 20.6) * 3) * 20} s={1.3 * momK} color="#ff9e6b" flip t={t} /> : null}
          <Fish x={fx} y={fy} s={0.9} t={t} happy={happy} flip={t > 19} />
          <Sparkles t={t} at={20.6} x={sea.x + 80} y={sea.y} n={14} color="#bfe8ff" />
          <PopWord t={t} at={9.0} dur={1.4} x={560} y={GROUND - 620} text="ORANGE !" size={96} color="#ff8a5c" />
          <PopWord t={t} at={20.4} x={760} y={GROUND - 420} text="PLOUF !" size={80} color="#3fa0d0" />
          <Actor id="lou" who={LOU} t={t} lines={lines} x={[[0, 1250], [10.6, 1250], [12.4, 860]]} facing={[[0, -1]]}
            beats={[
              { at: 10.6, to: 12.4, act: "walk", speed: 2.4 }, { at: 12.4, to: 15.0, act: "curious", look: [1, 0.4] },
              { at: 15.0, to: 18.8, act: "dig" }, { at: 19.0, to: 23.2, act: "joy", look: [0.2, -0.6] },
              { at: 23.2, to: 36, act: "open" },
            ]} />
          <Actor id="noi" who={NOI} t={t} lines={lines} x={[[0, 100], [2.8, 290]]} facing={[[0, 1]]}
            beats={[
              { at: 0, to: 2.8, act: "walk", speed: 1.7 }, { at: 3.4, to: 4.6, act: "surprise", look: [1, 0.6] },
              { at: 4.6, to: 7.2, act: "sad", look: [1, 0.6] }, { at: 7.2, to: 9.0, act: "think" }, { at: 9.0, to: 11.0, act: "joy" },
              { at: 11.0, to: 15.0, act: "open" }, { at: 15.0, to: 18.8, act: "dig" }, { at: 19.0, to: 23.2, act: "joy", look: [1, -0.6] },
              { at: 23.2, to: 28.0, act: "proud" }, { at: 28.0, to: 36, act: "wave" },
            ]} />
        </g>
      );
    },
  }],
};
