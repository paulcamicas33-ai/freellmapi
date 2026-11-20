import React, { createContext, useContext } from "react";
import { AbsoluteFill } from "remotion";

export type Cam = { x: number; y: number; zoom: number };
const CamCtx = createContext<Cam>({ x: 0, y: 0, zoom: 1 });

/** Provides the scene camera. x/y in px of the character plane (depth 1); zoom 1 = no zoom. */
export const Camera: React.FC<{ cam: Cam; children: React.ReactNode }> = ({ cam, children }) => (
  <CamCtx.Provider value={cam}>
    <AbsoluteFill style={{ overflow: "hidden" }}>{children}</AbsoluteFill>
  </CamCtx.Provider>
);

/**
 * One parallax layer. depth 0 = sky (never moves), 1 = the characters' plane, >1 = foreground.
 * Children are SVG elements in a W x H viewBox; overflow is visible so layers can be wider than the frame.
 */
export const Layer: React.FC<{ depth: number; width: number; height: number; blur?: number; children: React.ReactNode }> = ({
  depth, width, height, blur = 0, children,
}) => {
  const cam = useContext(CamCtx);
  const z = 1 + (cam.zoom - 1) * depth;
  return (
    <AbsoluteFill style={{ transformOrigin: "50% 60%", transform: `scale(${z}) translate(${-cam.x * depth}px, ${-cam.y * depth}px)`,
      filter: blur > 0.05 ? `blur(${blur}px)` : undefined }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible", position: "absolute", inset: 0 }}>
        {children}
      </svg>
    </AbsoluteFill>
  );
};
