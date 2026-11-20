import React from "react";
import { AbsoluteFill } from "remotion";
import { Critter, handPosition } from "./cast/Critter";
import { NOISETTE, PISTACHE } from "./cast/mascot";
import { Lantern } from "./world/Props";
import { blink, breathe } from "./lib/motion";
import { useTime } from "./lib/time";
import { FONT } from "./fonts";

/** Season 2 cast sheet: Noisette and her new best friend Pistache. */
export const FriendSheet: React.FC = () => {
  const { t } = useTime();
  const noi = { x: 620, y: 900, scale: 1.45, facing: 1 as const, pose: { armR: -38, blink: blink(t, 1), smile: 0.9, lookX: 0.6, sy: breathe(t) } };
  const hand = handPosition(noi, "R");
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 40%, #fff3df 0%, #f6d7ae 60%, #e9bf8c 100%)" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <ellipse cx={960} cy={905} rx={620} ry={46} fill="#d9a46b" opacity={0.6} />
        <Critter id="fs-noi" species={NOISETTE.species} look={NOISETTE.look} {...noi} />
        <Lantern id="fs-l" t={t} x={hand.x} y={hand.y - 6} scale={1.2} />
        <Critter id="fs-pis" species={PISTACHE.species} look={PISTACHE.look} x={1300} y={900} scale={1.3} facing={-1}
          pose={{ armL: 136, reachL: 0.55, smile: 1, brow: 0.3, lookX: 0.6, blink: blink(t, 4), sy: breathe(t, 2) }} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: FONT.title, fontWeight: 900, fontSize: 100,
        color: "#5a3420", textShadow: "0 5px 0 #ff9f43" }}>Noisette & Pistache</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 175, textAlign: "center", fontFamily: FONT.accent, fontStyle: "italic", fontSize: 48, color: "#8a5a3c" }}>
        « On essaie ensemble ? » — « Moi aussi ! »
      </div>
    </AbsoluteFill>
  );
};
