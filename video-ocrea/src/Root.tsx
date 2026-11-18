import "./fonts";
import React from "react";
import { Composition } from "remotion";
import { Film } from "./shots/Film";
import { DURATION_FRAMES, FPS } from "./lib/time";

export const Root: React.FC = () => (
  <Composition id="OcreaLandscape" component={Film} durationInFrames={DURATION_FRAMES} fps={FPS} width={1920} height={1080} />
);
