import "./fonts";
import React from "react";
import { Composition } from "remotion";
import { Film } from "./shots/Film";
import { CharacterSheet } from "./CharacterSheet";
import { DURATION_FRAMES, FPS } from "./lib/time";

export const Root: React.FC = () => (
  <>
    <Composition id="FilmLandscape" component={Film} durationInFrames={DURATION_FRAMES} fps={FPS} width={1920} height={1080} defaultProps={{ portrait: false }} />
    <Composition id="FilmPortrait" component={Film} durationInFrames={DURATION_FRAMES} fps={FPS} width={1080} height={1920} defaultProps={{ portrait: true }} />
    <Composition id="CharacterSheet" component={CharacterSheet} durationInFrames={60} fps={FPS} width={1920} height={1080} />
  </>
);
