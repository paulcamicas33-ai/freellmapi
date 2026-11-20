import "./fonts";
import React from "react";
import { Composition } from "remotion";
import { EpisodeFilm } from "./engine/EpisodeFilm";
import { MascotSheet } from "./MascotSheet";
import { FriendSheet } from "./FriendSheet";
import { EPISODES } from "./episodes";

const FPS = 30;

export const Root: React.FC = () => (
  <>
    {Object.values(EPISODES).map((ep) => (
      <Composition key={ep.id} id={`Ep${String(ep.number).padStart(2, "0")}`} component={EpisodeFilm}
        durationInFrames={Math.round(ep.duration * FPS)} fps={FPS} width={1080} height={1920} defaultProps={{ episode: ep.id }} />
    ))}
    <Composition id="FriendSheet" component={FriendSheet} durationInFrames={60} fps={FPS} width={1920} height={1080} />
    <Composition id="MascotSheet" component={MascotSheet} durationInFrames={60} fps={FPS} width={1920} height={1080} />
  </>
);
