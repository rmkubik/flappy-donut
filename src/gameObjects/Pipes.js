import Phaser from "phaser";
import globals from "../globals";

class Pipes extends Phaser.GameObjects.Group {
  constructor({ scene }) {
    super(scene);
    scene.add.existing(this);
    this.scene = scene;
  }

  create({ x, y, sprite, ceiling }) {
    const pipe = super.create(x, y, "donuts", sprite);
    this.scene.physics.world.enable(pipe);
    pipe.setScale(globals.scale);
    pipe.body.velocity.x = -300;
    pipe.flipY = ceiling;

    return pipe;
  }

  static isPipeOffScreen(pipe) {
    return pipe.body.x < 0 || pipe.body.y > globals.height;
  }

  update() {
    this.getChildren().forEach(pipe => {
      if (Pipes.isPipeOffScreen(pipe)) {
        if (pipe.active) {
          this.remove(pipe);
        }
      }
    });
  }

  buildPipe(height, ceiling) {
    for (let i = 1; i <= height; i += 1) {
      const pipeLength = globals.tileSize * globals.scale * i;

      let y;
      if (ceiling) {
        y = pipeLength - globals.tileSize;
      } else {
        y = globals.height - pipeLength + globals.tileSize;
      }

      this.create({
        x: globals.width + (globals.tileSize / 2) * globals.scale,
        y,
        sprite: i === height ? 1 : 2,
        ceiling
      });
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

    this.buildPipe(topHeight, false);
    this.buildPipe(bottomHeight, true);
  }
}

export default Pipes;
