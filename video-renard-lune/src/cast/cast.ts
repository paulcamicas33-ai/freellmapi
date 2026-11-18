import type { Look, Species } from "./Critter";

export const LOU: { species: Species; look: Look; scale: number } = {
  species: "fox",
  look: { fur: "#f08a4b", belly: "#fff3e2", accent: "#4f8ff0" },
  scale: 0.9,
};

export const NIGHT = {
  top: "#10183a", bottom: "#3a3f78", far: "#2b3466", mid: "#24485a", near: "#1d3b45",
  moon: "#fff6d8", atmo: "#cfd8ff", star: "#ffd166",
};
