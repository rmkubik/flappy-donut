import Phaser from "phaser";
import { config, globals } from "./src/config";

const gameEl = document.querySelector(`#${config.parent}`);
const game = new Phaser.Game(config);

/**
 * Enable Parcel hot loading
 */
if (module.hot) {
  module.hot.accept(() => {
    while (gameEl.firstChild) {
      gameEl.removeChild(gameEl.firstChild);
    }
    game.boot();
  });
}
