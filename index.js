import Phaser from "phaser";
import config from "./src/config";
import globals from "./src/globals";

const gameEl = document.querySelector(`#${config.parent}`);
const game = new Phaser.Game(config);

/**
 * Apply styles to fit to the screen in mobile
 */
gameEl.setAttribute(
  "style",
  `-ms-transform-origin: center top;
          -webkit-transform-origin: center top;
          -moz-transform-origin: center top;
          -o-transform-origin: center top;
          transform-origin: center top;
          -ms-transform: scale(${globals.deviceScale});
          -webkit-transform: scale3d(${globals.deviceScale}, 1);
          -moz-transform: scale(${globals.deviceScale});
          -o-transform: scale(${globals.deviceScale});
          transform: scale(${globals.deviceScale});
          display: block;
          margin: 0 auto;`
);

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
