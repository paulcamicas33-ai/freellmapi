import type { Look, Species } from "./Critter";

/**
 * NOISETTE — the recurring mascot of every cartoon-story film (see references/mascot.md).
 * Keep these values identical in every project so she always looks the same.
 */
export const NOISETTE: { name: string; species: Species; look: Look; scale: number } = {
  name: "Noisette",
  species: "hedgehog",
  look: { fur: "#c98a5a", belly: "#fbe8cf", accent: "#4fb36c", eye: "#3b2416", blush: "#f39a9e" },
  scale: 1,
};

/** Her catchphrase, said once per story at the turning point (captions only, or the user's own recording). */
export const NOISETTE_CATCHPHRASE = "On essaie *ensemble* ?";

/** PISTACHE — Noisette's best friend from season 2 on: a shy, greedy little mouse who says « Moi aussi ! ». */
export const PISTACHE: { name: string; species: Species; look: Look; scale: number } = {
  name: "Pistache",
  species: "mouse",
  look: { fur: "#b8aec8", belly: "#fbf3e6", accent: "#ff9f43", eye: "#2b1b14", blush: "#f5a3b5" },
  scale: 1,
};
export const PISTACHE_CATCHPHRASE = "Moi *aussi* !";
