import Phaser from "phaser";
import MainScene from "./MainScene";

export const globals = {
  tileSize: 32,
  scale: 2,
  tilesTall: 10,
  tilesWide: 6,
  pipeGapSize: 3,
  gravity: 300,
  deviceScale: 1
};

/**
 * Calculating size of screen to fit on mobile
 */
const deviceWidth = window.innerWidth; // * window.devicePixelRatio;
const deviceHeight = window.innerHeight; // * window.devicePixelRatio;
const width = globals.tileSize * globals.scale * globals.tilesWide;
const height = globals.tileSize * globals.scale * globals.tilesTall;
globals.deviceScale = Math.min(deviceWidth / width, deviceHeight / height);

export const config = {
  type: Phaser.AUTO,
  width,
  height,
  parent: "game",
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  scene: [MainScene],
  pixelArt: true
};
