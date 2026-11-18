import { Config } from "@remotion/cli/config";
Config.setChromiumOpenGlRenderer("swangle"); // no GPU in this container: software WebGL
Config.setConcurrency(1); // rule 2
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(94);
Config.setDelayRenderTimeoutInMilliseconds(120000);
Config.setBrowserExecutable(".browser/chrome-headless-shell-linux64/chrome-headless-shell");
