import React from "react";
import { AbsoluteFill } from "remotion";
import { Critter, Pose, handPosition } from "./cast/Critter";
import { NOISETTE } from "./cast/mascot";
import { Lantern } from "./world/Props";
import { blink, breathe } from "./lib/motion";
import { useTime } from "./lib/time";
import { FONT } from "./fonts";

const EXPR: { label: string; pose: Pose; facing?: 1 | -1 }[] = [
  { label: "joie", pose: { smile: 1, brow: 0.3, armL: 150, armR: -150, reachL: 0.5, reachR: 0.5 } },
  { label: "surprise", pose: { brow: 1, mouth: 0.6, lookY: -0.3, armL: 120, armR: -120, reachL: 0.2, reachR: 0.2 } },
  { label: "tristesse", pose: { brow: -0.8, smile: 0, headTilt: 10, lookY: 0.6, armL: 4, armR: -4 } },
  { label: "curiosité", pose: { headTilt: -12, lookX: 0.8, brow: 0.5 }, facing: -1 },
  { label: "fou rire", pose: { blink: 1, mouth: 0.7, headTilt: 6, sy: 0.96, armL: 40, armR: -40 } },
  { label: "fierté", pose: { blink: 1, smile: 1, headTilt: -6, armL: -30, armR: 30 } },
];

/** Noisette's model sheet: render one still and show it whenever the mascot is introduced or changed. */
export const MascotSheet: React.FC = () => {
  const { t } = useTime();
  const hero = { x: 380, y: 900, scale: 1.55, facing: 1 as const, pose: { armR: -38, sy: breathe(t), blink: blink(t, 1), smile: 0.9, lookX: 0.3 } };
  const hand = handPosition(hero, "R");
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 30% 40%, #fff3df 0%, #f6d7ae 60%, #e9bf8c 100%)" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <ellipse cx={380} cy={905} rx={300} ry={40} fill="#d9a46b" opacity={0.6} />
        <Critter id="ms-hero" species={NOISETTE.species} look={NOISETTE.look} {...hero} />
        <Lantern id="ms-lantern" t={t} x={hand.x} y={hand.y - 6} scale={1.2} />
        {EXPR.map((e, i) => {
          const cx = 900 + (i % 3) * 360, cy = 560 + Math.floor(i / 3) * 420;
          return (
            <g key={e.label}>
              <ellipse cx={cx} cy={cy + 4} rx={120} ry={18} fill="#d9a46b" opacity={0.5} />
              <Critter id={`ms-${i}`} species={NOISETTE.species} look={NOISETTE.look} x={cx} y={cy} scale={0.78} facing={e.facing ?? 1} pose={e.pose} />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 90, top: 60, fontFamily: FONT.title, fontWeight: 900, fontSize: 120, color: "#5a3420", letterSpacing: "-0.03em",
        textShadow: "0 5px 0 #4fb36c" }}>Noisette</div>
      <div style={{ position: "absolute", left: 96, top: 200, fontFamily: FONT.accent, fontStyle: "italic", fontSize: 50, color: "#8a5a3c" }}>
        petite hérissonne curieuse — « On essaie ensemble ? »
      </div>
      {EXPR.map((e, i) => (
        <div key={e.label} style={{ position: "absolute", left: 900 + (i % 3) * 360 - 150, width: 300, top: 560 + Math.floor(i / 3) * 420 + 22,
          textAlign: "center", fontFamily: FONT.story, fontWeight: 800, fontSize: 32, color: "#5a3420" }}>{e.label}</div>
      ))}
    </AbsoluteFill>
  );
};
