import React from "react";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { L } from "../lib/time";
import { PhoneUI } from "../ui/PhoneUI";
import { TypeLine } from "../type/TypeLine";

/** Act 3. Motion blur only inside the whip window (storyboard), around the phone UI only. */
export const Act3Prompt: React.FC<{ t: number }> = ({ t }) => {
  const line = L("prompt");
  const inWhip = t > line.accent - 0.5 && t < line.accent + 0.75;
  return (
    <>
      {inWhip ? (
        <CameraMotionBlur shutterAngle={180} samples={6}>
          <PhoneUI />
        </CameraMotionBlur>
      ) : (
        <PhoneUI />
      )}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(7,5,4,0.92) 0%, rgba(7,5,4,0.75) 34%, rgba(7,5,4,0) 58%)" }} />
      <TypeLine t={t} start={line.start} end={line.end} accentT={line.accent} size={112} x={110} y={130} maxWidth={720}
        words={[
          { text: "Une", at: 8.5 }, { text: "image.", at: 8.56 },
          { text: "Une", at: 9.1 }, { text: "phrase.", at: 9.16 },
          { text: "Envoyer.", accent: true },
        ]} />
    </>
  );
};
