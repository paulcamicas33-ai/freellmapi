import React from "react";
import { Episode, GROUND } from "../engine/types";
import { Actor, NOI, PISTA } from "../engine/actor";
import { PopWord } from "../engine/props";
import { Star } from "../world/Props";
import { CountUp, Sparkles } from "../engine/fx";
import { cam, pop, prog } from "../lib/ease";

const lines = [
  { id: "l1", text: "Cette nuit, les étoiles *s'allument* une à une.", start: 3.4, end: 7.0 },
  { id: "l2", text: "On les compte *ensemble* ?", start: 7.4, end: 11.0, speaker: "Noisette" },
  { id: "l3", text: "Compte avec nous : 1, 2, 3, 4, *5* !", start: 11.4, end: 16.6 },
  { id: "l4", text: "Oh ! Une étoile *filante* ! Fais un souhait !", start: 17.0, end: 20.8, speaker: "Noisette" },
  { id: "l5", text: "Je voudrais rester ton *ami* pour toujours !", start: 21.2, end: 25.0, speaker: "Pistache" },
  { id: "l6", text: "Moi *aussi* !", start: 25.4, end: 28.2, speaker: "Noisette" },
  { id: "l7", text: "À très *vite* !", start: 33.2, end: 35.9, speaker: "Noisette" },
];
const STARS = [
  { at: 12.2, x: 200, y: 360 }, { at: 13.1, x: 430, y: 250 }, { at: 14.0, x: 660, y: 330 }, { at: 14.9, x: 880, y: 230 }, { at: 15.8, x: 540, y: 520 },
];

export const ep09: Episode = {
  id: "ep09", season: 2, number: 9, title: "Compter les étoiles", duration: 36, endAt: 29.0, lines,
  scenes: [{
    id: "all", start: 0, end: 36, place: "night", zoom: [[0, 1], [36, 1.03]],
    world: (t) => {
      const shoot = prog(t, 17.4, 18.8);
      return (
        <g>
          {STARS.map((s, i) => {
            const k = pop(prog(t, s.at, s.at + 0.4));
            return k > 0 ? <Star key={i} x={s.x} y={s.y} r={46 * k} glow={0.7 + 0.3 * Math.sin(t * 3 + i)} rot={Math.sin(t + i) * 8} face={{ blink: 0 }} /> : null;
          })}
          {shoot > 0 && shoot < 1 ? (
            <g>
              <line x1={1000 - cam(shoot) * 900 + 220} y1={160 + cam(shoot) * 300 - 90} x2={1000 - cam(shoot) * 900} y2={160 + cam(shoot) * 300} stroke="#fff3c4" strokeWidth={8} strokeLinecap="round" opacity={0.7} />
              <Star x={1000 - cam(shoot) * 900} y={160 + cam(shoot) * 300} r={30} glow={1} rot={t * 300} />
            </g>
          ) : null}
          <Sparkles t={t} at={18.8} x={150} y={460} n={14} color="#fff3a0" />
          <PopWord t={t} at={17.2} x={540} y={GROUND - 760} text="OH !" size={100} color="#ffd166" />
          <Actor id="pis" who={PISTA} t={t} lines={lines} x={[[0, 740]]} facing={[[0, -1]]}
            beats={[
              { at: 0, to: 3.4, act: "wave" }, { at: 3.4, to: 11.4, act: "lookUp", look: [0, -0.9] }, { at: 11.4, to: 17.0, act: "point", look: [0, -0.9] },
              { at: 17.0, to: 21.2, act: "surprise", look: [-0.8, -0.8] }, { at: 21.2, to: 25.4, act: "hideEyes" },
              { at: 25.4, to: 29.0, act: "hug" }, { at: 29.0, to: 36, act: "wave" },
            ]} />
          <Actor id="noi" who={NOI} t={t} lines={lines} lantern={[[0, 36]]} x={[[0, 330]]} facing={[[0, 1]]}
            beats={[
              { at: 0, to: 3.4, act: "wave" }, { at: 3.4, to: 7.4, act: "lookUp", look: [0.4, -0.9] }, { at: 7.4, to: 11.4, act: "open" },
              { at: 11.4, to: 17.0, act: "lookUp", look: [0.4, -0.9] }, { at: 17.0, to: 21.2, act: "point" },
              { at: 21.2, to: 25.4, act: "curious", look: [1, 0] }, { at: 25.4, to: 29.0, act: "hug" }, { at: 29.0, to: 36, act: "wave" },
            ]} />
        </g>
      );
    },
    overlay: (t) => <CountUp t={t} items={STARS.map((s, i) => ({ at: s.at, text: String(i + 1) }))} y={760} />,
  }],
};
