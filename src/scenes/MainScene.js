import Phaser from "phaser";
import globals from "../globals";
import donutImg from "../../assets/donut.svg";
import treeImg from "../../assets/tree1.png";
import donutsImg from "../../assets/donuts.png";
import Donut from "../gameObjects/Donut";

class MainScene extends Phaser.Scene {
  preload() {
    this.load.image("donut", donutImg);
    this.load.image("tree", treeImg);
    this.load.spritesheet("donuts", donutsImg, {
      frameWidth: globals.tileSize,
      frameHeight: globals.tileSize
    });
  }

  create() {
    const text = this.add.text(10, 10, "Flappy Donut");

    this.donut = new Donut({ scene: this, position: { x: 150, y: 100 } });

    this.pipes = this.physics.add.group();
    this.buildPipe(5);

    this.physics.add.collider(this.donut, this.pipes, (donut, pipe) => {
      pipe.body.setGravityY(globals.gravity);
    });

    this.input.keyboard.on("keydown_SPACE", event => {
      this.donut.flap();
    });

    this.input.on("pointerdown", event => {
      this.donut.flap();
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
      if (pipe.body.x < 0 || pipe.body.y > globals.height) {
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
          globals.height -
          globals.tileSize * globals.scale * i +
          globals.tileSize;
        flipY = false;
      }

      const pipe = this.pipes.create(
        globals.width + (globals.tileSize / 2) * globals.scale,
        y,
        "donuts",
        i === height ? 1 : 2
      );
      pipe.setScale(globals.scale);
      pipe.body.velocity.x = -300;
      pipe.flipY = flipY;
    }
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
