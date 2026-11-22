import React from "react";
import { Episode, GROUND } from "../engine/types";
import { Actor, NOI, PISTA } from "../engine/actor";
import { PopWord } from "../engine/props";
import { Basket, Blanket, Fruit } from "../engine/props2";
import { CountUp, Sparkles } from "../engine/fx";
import { arrive, pop, prog } from "../lib/ease";

const lines = [
  { id: "l1", text: "C'est l'heure du *pique-nique* !", start: 3.4, end: 6.6 },
  { id: "l2", text: "Une pomme, une fraise, une banane… du *fromage* !", start: 7.0, end: 11.8 },
  { id: "l3", text: "Tout pour moi ! Miam miam *miam* !", start: 12.2, end: 15.4, speaker: "Pistache" },
  { id: "l4", text: "Et si on *partageait* ? C'est plus gentil !", start: 15.8, end: 19.6, speaker: "Noisette" },
  { id: "l5", text: "Un pour toi, un pour moi. Compte : 1, 2, 3, *4* !", start: 20.0, end: 24.8 },
  { id: "l6", text: "Moi *aussi* j'aime partager ! C'est meilleur !", start: 25.2, end: 28.8, speaker: "Pistache" },
  { id: "l7", text: "À très *vite* !", start: 33.0, end: 35.6, speaker: "Noisette" },
];
const FOOD: { kind: "apple" | "strawberry" | "banana" | "cheese"; at: number }[] = [
  { kind: "apple", at: 7.4 }, { kind: "strawberry", at: 8.6 }, { kind: "banana", at: 9.8 }, { kind: "cheese", at: 11.0 },
];
const SPLIT = [21.0, 21.8, 22.6, 23.4];

export const ep06: Episode = {
  id: "ep06", season: 2, number: 6, title: "Le pique-nique", duration: 36, endAt: 29.4, lines,
  scenes: [{
    id: "all", start: 0, end: 36, place: "sunset", zoom: [[0, 1], [36, 1.03]],
    world: (t) => {
      const grab = arrive(prog(t, 12.4, 13.0)) * (1 - arrive(prog(t, 19.6, 20.2)));
      return (
        <g>
          <Blanket x={540} y={GROUND + 10} w={600} />
          <Basket x={540} y={GROUND - 20} s={1.1} open={arrive(prog(t, 6.8, 7.3))} />
          {FOOD.map((f, i) => {
            const k = pop(prog(t, f.at, f.at + 0.4));
            if (k <= 0) return null;
            const home = { x: 330 + i * 140, y: GROUND - 260 };
            const pile = { x: 760 + (i % 2) * 40, y: GROUND - 330 - Math.floor(i / 2) * 50 };
            const s1 = arrive(prog(t, SPLIT[i], SPLIT[i] + 0.5));
            const final = { x: i % 2 === 0 ? 300 + i * 20 : 780 + i * 10, y: GROUND - 10 };
            const x = home.x + (pile.x - home.x) * grab + (final.x - home.x) * s1 * (1 - grab);
            const y = home.y + (pile.y - home.y) * grab + (final.y - home.y) * s1 * (1 - grab);
            return <Fruit key={f.kind} kind={f.kind} x={x} y={y} s={1.2 * k} />;
          })}
          <PopWord t={t} at={12.5} x={800} y={GROUND - 640} text="MIAM !" size={96} color="#ff6b6b" />
          <Sparkles t={t} at={25.3} x={540} y={GROUND - 300} n={16} />
          <Actor id="pis" who={PISTA} t={t} lines={lines} x={[[0, 1200], [2.4, 1200], [4.2, 820]]} facing={[[0, -1]]}
            beats={[
              { at: 2.4, to: 4.2, act: "walk", speed: 3 }, { at: 4.2, to: 12.2, act: "joy" }, { at: 12.2, to: 15.8, act: "hug" },
              { at: 15.8, to: 20.0, act: "shy" }, { at: 20.0, to: 25.2, act: "open" }, { at: 25.2, to: 29.4, act: "joy" }, { at: 29.4, to: 36, act: "wave" },
            ]} />
          <Actor id="noi" who={NOI} t={t} lines={lines} x={[[0, 100], [2.6, 270]]} facing={[[0, 1]]}
            beats={[
              { at: 0, to: 2.6, act: "walk", speed: 1.6 }, { at: 3.4, to: 7.0, act: "joy" }, { at: 7.0, to: 12.2, act: "point" },
              { at: 12.2, to: 15.8, act: "surprise" }, { at: 15.8, to: 20.0, act: "open" }, { at: 20.0, to: 25.2, act: "clap" },
              { at: 25.2, to: 29.4, act: "hug" }, { at: 29.4, to: 36, act: "wave" },
            ]} />
        </g>
      );
    },
    overlay: (t) => <CountUp t={t} items={SPLIT.map((a, i) => ({ at: a, text: String(i + 1), color: "#ff9f43" }))} y={300} />,
  }],
};
