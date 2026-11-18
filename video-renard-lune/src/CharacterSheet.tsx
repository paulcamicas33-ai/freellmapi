import React from "react";
import { AbsoluteFill } from "remotion";
import { Critter } from "./cast/Critter";
import { Star } from "./world/Props";
import { LOU, NIGHT } from "./cast/cast";
import { blink, breathe } from "./lib/motion";
import { useTime } from "./lib/time";

/** The story's cast: Lou (happy, curious, sad) and the star (sad, happy). */
export const CharacterSheet: React.FC = () => {
  const { t } = useTime();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${NIGHT.top}, ${NIGHT.bottom})` }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <rect x={0} y={840} width={1920} height={240} fill={NIGHT.near} />
        <Critter id="cs-a" species={LOU.species} look={LOU.look} x={280} y={860} scale={1.2} pose={{ smile: 1, brow: 0.3, armL: -150, armR: 150, blink: blink(t, 1), sy: breathe(t) }} />
        <Critter id="cs-b" species={LOU.species} look={LOU.look} x={700} y={860} scale={1.2} pose={{ headTilt: -12, lookX: 0.8, brow: 0.5, blink: blink(t, 2) }} />
        <Critter id="cs-c" species={LOU.species} look={LOU.look} x={1120} y={860} scale={1.2} facing={-1} pose={{ brow: -0.8, smile: 0, headTilt: 10, lookY: 0.6 }} />
        <Star x={1480} y={700} r={90} color={NIGHT.star} glow={0.5} face={{ sad: 1 }} />
        <Star x={1740} y={700} r={90} color={NIGHT.star} glow={1} face={{ mouth: 0.5 }} />
      </svg>
    </AbsoluteFill>
  );
};
