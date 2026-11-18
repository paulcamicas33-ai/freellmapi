import React from "react";
import { FONT } from "../fonts";
import { arrive, exit, prog } from "../lib/ease";
import { C } from "../world/common";
import { F } from "../lib/time";

export type Word = { text: string; accent?: boolean; at?: number };

/**
 * Kinetic line: each word rises out of a mask (E3), stagger 4 frames; the accent word is
 * Instrument Serif Italic amber and lands on `accentT`. Exits by rising out of the mask.
 */
export const TypeLine: React.FC<{
  t: number;
  words: Word[];
  start: number;
  end: number;
  accentT: number;
  size: number;
  x: number;
  y: number;
  maxWidth: number;
  align?: "left" | "center";
  sheen?: boolean;
}> = ({ t, words, start, end, accentT, size, x, y, maxWidth, align = "left", sheen = false }) => {
  const outK = exit(prog(t, end - F(18), end));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: maxWidth, textAlign: align,
      lineHeight: 1.02, fontFamily: FONT.hero, fontWeight: 900, fontSize: size, letterSpacing: "-0.04em",
      color: C.cream, textShadow: "0 6px 40px rgba(0,0,0,0.55)" }}>
      {words.map((w, i) => {
        const ws = w.at ?? (w.accent ? accentT - F(16) : start + F(4 * i));
        const k = arrive(prog(t, ws, ws + F(28)));
        const ty = (1 - k) * 105 - outK * 105;
        const blur = (1 - k) * 8;
        const sheenX = sheen && w.accent ? -60 + prog(t, accentT, accentT + F(40)) * 220 : -100;
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom",
            paddingBottom: "0.12em", marginBottom: "-0.12em", paddingRight: "0.06em" }}>
            <span style={{ display: "inline-block", transform: `translateY(${ty}%)`, filter: `blur(${blur}px)`,
              ...(w.accent
                ? { fontFamily: FONT.accent, fontStyle: "italic", fontWeight: 400, fontSize: "1.1em", letterSpacing: "-0.01em",
                    color: C.amber,
                    ...(sheen ? {
                      backgroundImage: `linear-gradient(100deg, ${C.amber} 0%, ${C.amber} ${sheenX - 12}%, #fff6e6 ${sheenX}%, ${C.amber} ${sheenX + 12}%, ${C.amber} 100%)`,
                      WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
                    } : {}),
                  }
                : {}) }}>
              {w.text}
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </div>
  );
};
