import React from "react";
import { shade } from "../lib/color";

/** A rolling hill band with a lit top edge. Place several at different Layer depths for parallax. */
export const Hill: React.FC<{ id: string; width: number; height: number; base: number; amp: number; freq: number; seed: number; color: string; rim?: string }> = ({
  id, width, height, base, amp, freq, seed, color, rim,
}) => {
  const pts: string[] = [];
  for (let x = -width; x <= width * 2; x += 30) {
    const y = base - amp * (Math.sin(x * freq + seed) * 0.7 + Math.sin(x * freq * 2.3 + seed * 1.7) * 0.3);
    pts.push(`${x},${y.toFixed(1)}`);
  }
  const top = `M ${pts.join(" L ")}`;
  return (
    <>
      <defs>
        <linearGradient id={`${id}-hill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={shade(color, 0.12)} />
          <stop offset="1" stopColor={shade(color, -0.3)} />
        </linearGradient>
      </defs>
      <path d={`${top} L ${width * 2},${height * 2} L ${-width},${height * 2} Z`} fill={`url(#${id}-hill)`} />
      <path d={top} fill="none" stroke={rim ?? shade(color, 0.35)} strokeWidth={5} strokeLinecap="round" opacity={0.8} />
    </>
  );
};
