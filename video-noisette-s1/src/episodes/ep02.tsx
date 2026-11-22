import React from "react";
import { Episode, GROUND } from "../engine/types";
import { Actor, NOI, POMPON } from "../engine/actor";
import { Acorn, Chest, MapScroll, PopWord } from "../engine/props";
import { CountUp, Sparkles } from "../engine/fx";
import { arrive, pop, prog } from "../lib/ease";

const lines = [
  { id: "l1", text: "Sous une feuille, Noisette trouve une *carte* !", start: 3.4, end: 6.6 },
  { id: "l2", text: "Une carte au trésor ! On va le *chercher* ensemble !", start: 7.0, end: 10.6, speaker: "Noisette" },
  { id: "l3", text: "Ils creusent, creusent… sous le vieux *chêne*.", start: 11.0, end: 14.8 },
  { id: "l4", text: "Des glands ! Comptons : 1, 2, 3, 4, *5* !", start: 15.4, end: 19.8, speaker: "Noisette" },
  { id: "l5", text: "Un pour toi, un pour moi… on *partage* !", start: 20.6, end: 24.2, speaker: "Noisette" },
  { id: "l6", text: "Le vrai trésor, c'est de *partager* avec ses amis.", start: 24.6, end: 28.8 },
  { id: "l7", text: "À très *vite* !", start: 33.4, end: 35.9, speaker: "Noisette" },
];
const ACORNS = [16.4, 17.25, 18.1, 18.95, 19.8];

export const ep02: Episode = {
  id: "ep02", number: 2, title: "Le trésor du vieux chêne", duration: 36, endAt: 29.4, lines,
  scenes: [{
    id: "all", start: 0, end: 36, place: "forest", zoom: [[0, 1], [11, 1.05], [36, 1.04]],
    world: (t) => {
      const rise = arrive(prog(t, 14.4, 15.2));
      const open = arrive(prog(t, 15.4, 15.9));
      const chestX = 540, chestY = GROUND + 60 + (1 - rise) * 120;
      return (
        <g>
          {t > 3.5 && t < 11 ? <MapScroll x={540} y={GROUND - 640} k={arrive(prog(t, 3.6, 4.3)) * (1 - prog(t, 10.4, 10.9))} /> : null}
          {t > 11 ? (
            <g>
              {t < 15.2 ? [0, 1, 2, 3, 4, 5].map((i) => {
                const k = ((t * 1.6 + i / 6) % 1);
                return <circle key={i} cx={chestX - 60 + i * 24 + k * (i % 2 ? 40 : -40)} cy={GROUND + 40 - Math.sin(k * Math.PI) * 120} r={9} fill="#7a4f2a" opacity={1 - k} />;
              }) : null}
              {rise > 0 ? <Chest x={chestX} y={chestY} s={1.1} open={open} glow={open} /> : null}
            </g>
          ) : null}
          <Sparkles t={t} at={15.5} x={chestX} y={GROUND - 40} n={14} />
          {ACORNS.map((a, i) => {
            const k = pop(prog(t, a, a + 0.4));
            if (k <= 0) return null;
            const give = arrive(prog(t, 21.0 + i * 0.4, 21.5 + i * 0.4));
            const left = i % 2 === 0;
            const x0 = 330 + i * 105, y0 = GROUND - 330;
            const x1 = left ? 230 + i * 22 : 790 + i * 18, y1 = GROUND + 30;
            return <Acorn key={i} x={x0 + (x1 - x0) * give} y={y0 + (y1 - y0) * give - Math.sin(give * Math.PI) * 120} s={k * 1.4} rot={Math.sin(t * 3 + i) * 10} />;
          })}
          <PopWord t={t} at={3.5} x={540} y={GROUND - 860} text="OH !" size={80} color="#4fb36c" />
          <Actor id="pompon" who={POMPON} t={t} lines={lines} x={[[0, 1250], [7.0, 1250], [8.6, 830]]} facing={[[0, -1]]}
            beats={[
              { at: 7.0, to: 8.6, act: "walk", speed: 2.6 }, { at: 8.6, to: 11.0, act: "curious", look: [1, 0] },
              { at: 11.0, to: 14.6, act: "dig" }, { at: 14.6, to: 15.6, act: "surprise" }, { at: 15.6, to: 20.2, act: "joy" },
              { at: 20.2, to: 24.6, act: "open" }, { at: 24.6, to: 29.4, act: "hug" }, { at: 29.4, to: 36, act: "joy" },
            ]} />
          <Actor id="noi" who={NOI} t={t} lines={lines} x={[[0, 120], [2.8, 300]]} facing={[[0, 1]]}
            beats={[
              { at: 0, to: 2.8, act: "walk", speed: 1.6 }, { at: 3.4, to: 4.6, act: "surprise", look: [0.6, -0.6] },
              { at: 4.6, to: 7.0, act: "curious", look: [0.6, -0.7] }, { at: 7.0, to: 11.0, act: "open" },
              { at: 11.0, to: 14.6, act: "dig" }, { at: 14.6, to: 15.6, act: "surprise" }, { at: 15.6, to: 20.2, act: "joy", look: [0.6, -0.5] },
              { at: 20.2, to: 24.6, act: "point" }, { at: 24.6, to: 29.4, act: "hug" }, { at: 29.4, to: 36, act: "wave" },
            ]} />
        </g>
      );
    },
    overlay: (t) => <CountUp t={t} items={ACORNS.map((a, i) => ({ at: a, text: String(i + 1), color: "#c98a4a" }))} y={300} />,
  }],
};
