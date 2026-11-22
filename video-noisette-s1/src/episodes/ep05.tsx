import React from "react";
import { Episode, GROUND } from "../engine/types";
import { Actor, NOI, PIPO } from "../engine/actor";
import { Burrow } from "../engine/props";
import { Fireflies, Sparkles } from "../engine/fx";
import { prog } from "../lib/ease";

const lines = [
  { id: "l1", text: "La nuit tombe. Pipo l'ourson a *peur* du noir.", start: 3.4, end: 7.0 },
  { id: "l2", text: "Le noir, c'est *effrayant*…", start: 7.4, end: 10.6, speaker: "Pipo" },
  { id: "l3", text: "Viens avec ma lanterne ! On regarde *ensemble* ?", start: 11.0, end: 14.8, speaker: "Noisette" },
  { id: "l4", text: "Regarde ! Des *lucioles* et des étoiles !", start: 15.2, end: 19.0, speaker: "Noisette" },
  { id: "l5", text: "Oh… La nuit est *belle*, en fait !", start: 19.4, end: 23.2, speaker: "Pipo" },
  { id: "l6", text: "Quand on est deux, on a moins *peur*.", start: 23.6, end: 27.6 },
  { id: "l7", text: "Bonne nuit et à très *vite* !", start: 32.7, end: 35.6, speaker: "Noisette" },
];

export const ep05: Episode = {
  id: "ep05", number: 5, title: "Pipo a peur du noir", duration: 36, endAt: 28.4, lines,
  scenes: [{
    id: "all", start: 0, end: 36, place: "burrow-night", zoom: [[0, 1], [15, 1.05], [36, 1.04]],
    world: (t) => (
      <g>
        <Burrow x={180} y={GROUND + 6} s={0.8} />
        {t > 15.2 ? <Fireflies t={t} cx={540} cy={GROUND - 560} spread={440} k={Math.min(1, prog(t, 15.2, 16.4))} /> : null}
        <Sparkles t={t} at={15.3} x={540} y={GROUND - 600} n={18} color="#fff3a0" spread={320} />
        <Actor id="pipo" who={PIPO} t={t} lines={lines} x={[[0, 1250], [3.4, 1250], [5.6, 820]]} facing={[[0, -1]]}
          beats={[
            { at: 3.4, to: 5.6, act: "walk", speed: 2.0 }, { at: 5.6, to: 15.2, act: "scared", look: [-0.6, 0.2] },
            { at: 15.2, to: 19.4, act: "lookUp", look: [0, -0.9] }, { at: 19.4, to: 23.6, act: "joy", look: [0.3, -0.6] },
            { at: 23.6, to: 28.4, act: "hug" }, { at: 28.4, to: 36, act: "open" },
          ]} />
        <Actor id="noi" who={NOI} t={t} lines={lines} lantern={[[0, 36]]} x={[[0, 420], [11.0, 420], [12.4, 560]]} facing={[[0, 1]]}
          beats={[
            { at: 0, to: 3.4, act: "wave" }, { at: 3.4, to: 7.4, act: "curious", look: [1, 0] }, { at: 7.4, to: 11.0, act: "sad", look: [1, 0] },
            { at: 11.0, to: 12.4, act: "walk", speed: 1.6 }, { at: 12.4, to: 15.2, act: "point" },
            { at: 15.2, to: 19.4, act: "lookUp", look: [0, -0.9] }, { at: 19.4, to: 23.6, act: "joy" },
            { at: 23.6, to: 28.4, act: "hug" }, { at: 28.4, to: 36, act: "wave" },
          ]} />
      </g>
    ),
  }],
};
