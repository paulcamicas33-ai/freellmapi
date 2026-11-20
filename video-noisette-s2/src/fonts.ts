import "remotion/no-react"; // first import, before any delayRender
import { cancelRender } from "remotion";
import { loadFont } from "@remotion/fonts";
import titleBlack from "@fontsource/inter-tight/files/inter-tight-latin-900-normal.woff2";
import storyBold from "@fontsource/inter-tight/files/inter-tight-latin-800-normal.woff2";
import storyItalic from "@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2";

export const FONT = { title: "Inter Tight", story: "Inter Tight", accent: "Instrument Serif" } as const;

const faces = [
  { family: FONT.title, url: titleBlack, weight: "900", style: "normal" },
  { family: FONT.story, url: storyBold, weight: "800", style: "normal" },
  { family: FONT.accent, url: storyItalic, weight: "400", style: "italic" },
];
for (const face of faces) {
  loadFont(face).catch((err) => cancelRender(err)); // a font that fails cancels the render
}
