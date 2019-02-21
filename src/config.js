import Phaser from "phaser";
import globals from "./globals";
import MainScene from "./scenes/MainScene";

const { width, height } = globals;

const config = {
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

export default config;
