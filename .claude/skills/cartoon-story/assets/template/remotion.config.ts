import { Config } from "@remotion/cli/config";
// Cartoon films are SVG/DOM only (no WebGL), so more than one tab is allowed after a memory check.
Config.setConcurrency(2);
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(94);
Config.setDelayRenderTimeoutInMilliseconds(120000);
// The checked browser from the cinematic-motion kit section (Linux x64 row shown; use this computer's row).
Config.setBrowserExecutable(".browser/chrome-headless-shell-linux64/chrome-headless-shell");
