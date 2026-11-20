import React from "react";
import { FONT } from "../fonts";
import { arrive, exit, prog } from "../lib/ease";
import type { Line } from "../lib/time";

/**
 * Storybook caption: a paper card low in the frame. Text in *stars* is the line's one accent word
 * (italic serif, accent colour). Enters by rising and un-blurring, leaves by sinking.
 */
export const Caption: React.FC<{ t: number; line: Line; width: number; height: number; accent?: string; portrait?: boolean }> = ({
  t, line, width, height, accent = "#e8743b", portrait = false,
}) => {
  if (t < line.start - 0.05 || t > line.end + 0.4) return null;
  const inK = arrive(prog(t, line.start, line.start + 0.45));
  const outK = exit(prog(t, line.end, line.end + 0.35));
  const parts = line.text.split(/(\*[^*]+\*)/g).filter(Boolean);
  const size = portrait ? 58 : 50;
  const cardW = portrait ? width - 140 : Math.min(1400, width - 260);
  const bottom = portrait ? 470 : 70;
  return (
    <div style={{ position: "absolute", left: (width - cardW) / 2, width: cardW, bottom,
      transform: `translateY(${(1 - inK) * 60 + outK * 80}px) scale(${0.96 + inK * 0.04})`,
      filter: `blur(${(1 - inK) * 6 + outK * 6}px)`, opacity: Math.min(inK * 1.4, 1 - outK) }}>
      <div style={{ background: "rgba(255,248,236,0.94)", borderRadius: 34, padding: "26px 44px",
        boxShadow: "0 14px 40px rgba(60,30,10,0.28), inset 0 -4px 0 rgba(120,70,30,0.12)",
        border: "3px solid rgba(120,70,30,0.18)", textAlign: "center",
        fontFamily: FONT.story, fontWeight: 800, fontSize: size, lineHeight: 1.18, color: "#3b2416", letterSpacing: "-0.01em" }}>
        {line.speaker ? (
          <div style={{ fontFamily: FONT.title, fontWeight: 900, fontSize: size * 0.62, color: accent, letterSpacing: "0.04em", marginBottom: 4 }}>
            {line.speaker.toUpperCase()}
          </div>
        ) : null}
        {parts.map((p, i) =>
          p.startsWith("*") ? (
            <span key={i} style={{ fontFamily: FONT.accent, fontStyle: "italic", fontWeight: 400, fontSize: size * 1.15, color: accent }}>
              {p.slice(1, -1)}
            </span>
          ) : (
            <span key={i}>{p}</span>
          ),
        )}
      </div>
    </div>
  );
};

/** Big title card text (the story's name), letters popping in one by one. */
export const Title: React.FC<{ t: number; text: string; start: number; end: number; x: number; y: number; size: number; color?: string; accent?: string }> = ({
  t, text, start, end, x, y, size, color = "#fff8ec", accent = "#e8743b",
}) => {
  const outK = exit(prog(t, end - 0.4, end));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: "100%", transform: "translateX(-50%)", textAlign: "center",
      fontFamily: FONT.title, fontWeight: 900, fontSize: size, color, letterSpacing: "-0.03em",
      textShadow: `0 6px 0 ${accent}, 0 14px 30px rgba(0,0,0,0.35)`, opacity: 1 - outK }}>
      {Array.from(text).map((ch, i) => {
        const k = prog(t, start + i * 0.05, start + i * 0.05 + 0.45);
        const s = k <= 0 ? 0 : 1 + Math.sin(k * Math.PI) * 0.25 * (1 - k);
        return (
          <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - arrive(k)) * 60}px) scale(${s})`, whiteSpace: "pre" }}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};
