import Phaser from "phaser";
import globals from "../globals";
import donutSpriteSheet from "../../assets/donuts.png";
import Donut from "../gameObjects/Donut";
import Pipes from "../gameObjects/Pipes";

class MainScene extends Phaser.Scene {
  preload() {
    this.load.spritesheet("donuts", donutSpriteSheet, {
      frameWidth: globals.tileSize,
      frameHeight: globals.tileSize
    });
  }

  create() {
    this.add.text(10, 10, "Flappy Donut");

    this.donut = new Donut({ scene: this, position: { x: 150, y: 100 } });

    this.pipes = new Pipes({ scene: this });
    this.pipes.buildPipePair(5);
    this.time.addEvent({
      delay: 1000,
      callback: this.pipes.buildPipePair,
      callbackScope: this.pipes,
      loop: true
    });

    this.physics.add.collider(this.donut, this.pipes, (donut, pipe) => {
      pipe.body.setGravityY(globals.gravity);
    });

    this.createPlayerInputs();
  }

  createPlayerInputs() {
    this.input.keyboard.on("keydown_SPACE", () => {
      this.donut.flap();
    });

    this.input.on("pointerdown", () => {
      this.donut.flap();
    });

    this.input.keyboard.on("keydown_ENTER", () => {
      this.buildPipePair();
    });
  }

  update() {
    this.pipes.update();
  }
}

export default MainScene;
