import Phaser from "phaser";
import { globals, config } from "./config";
import donutImg from "../assets/donut.svg";
import treeImg from "../assets/tree1.png";
import donutsImg from "../assets/donuts.png";

class MainScene extends Phaser.Scene {
  preload() {
    // Applying scaling for fitting canvas to mobile
    this.mobile = false;
    const orientation = this.mobile ? "left" : "center";
    document.querySelector(`#${config.parent}`).setAttribute(
      "style",
      `-ms-transform-origin: ${orientation} top;
              -webkit-transform-origin: ${orientation} top;
              -moz-transform-origin: ${orientation} top;
              -o-transform-origin: ${orientation} top;
              transform-origin: ${orientation} top;
              -ms-transform: scale(${globals.deviceScale});
              -webkit-transform: scale3d(${globals.deviceScale}, 1);
              -moz-transform: scale(${globals.deviceScale});
              -o-transform: scale(${globals.deviceScale});
              transform: scale(${globals.deviceScale});
              display: block;
              margin: 0 auto;`
    );

    this.load.image("donut", donutImg);
    this.load.image("tree", treeImg);
    this.load.spritesheet("donuts", donutsImg, {
      frameWidth: globals.tileSize,
      frameHeight: globals.tileSize
    });
  }

  create() {
    const text = this.add.text(10, 10, "Flappy Donut");

    this.donut = this.physics.add.sprite(150, 100, "donuts", 0);
    this.donut.setScale(globals.scale);
    this.donut.setBounce(0.8);
    // donut.body.setCircle(globals.tileSize / 2);
    this.donut.setCollideWorldBounds(true);
    this.donut.body.setGravityY(globals.gravity);

    this.pipes = this.physics.add.group();
    this.buildPipe(5);

    this.physics.add.collider(this.donut, this.pipes, (donut, pipe) => {
      pipe.body.setGravityY(globals.gravity);
    });

    this.input.keyboard.on("keydown_SPACE", event => {
      this.flap();
    });

    this.input.on("pointerdown", event => {
      this.flap();
    });

    this.input.keyboard.on("keydown_ENTER", event => {
      this.buildPipePair();
    });

    this.time.addEvent({
      delay: 1000,
      callback: this.buildPipePair,
      callbackScope: this,
      loop: true
    });
  }

  update() {
    this.pipes.getChildren().forEach(pipe => {
      if (pipe.body.x < 0 || pipe.body.y > config.height) {
        if (pipe.active) {
          this.pipes.remove(pipe);
        }
      }
    });
  }

  buildPipe(height, ceiling) {
    for (let i = 1; i <= height; i += 1) {
      let y;
      let flipY;
      if (ceiling) {
        y = globals.tileSize * globals.scale * i - globals.tileSize;
        flipY = true;
      } else {
        y =
          config.height -
          globals.tileSize * globals.scale * i +
          globals.tileSize;
        flipY = false;
      }

      const pipe = this.pipes.create(
        config.width + (globals.tileSize / 2) * globals.scale,
        y,
        "donuts",
        i === height ? 1 : 2
      );
      pipe.setScale(globals.scale);
      pipe.body.velocity.x = -300;
      pipe.flipY = flipY;
    }
  }

  flap() {
    this.donut.body.velocity.y -= 400;
  }

  /**
   * Build a pipe on the screen that is either attached to the floor or the ceiling
   */
  buildPipePair() {
    const topHeight = Phaser.Math.RND.between(
      1,
      globals.tilesTall - globals.pipeGapSize - 1
    );
    const bottomHeight = globals.tilesTall - globals.pipeGapSize - topHeight;
    this.buildPipe(topHeight);
    this.buildPipe(bottomHeight, true);
  }
}

export default MainScene;
