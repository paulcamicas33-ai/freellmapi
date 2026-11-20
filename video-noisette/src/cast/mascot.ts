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
