import Phaser from "phaser";
import { globals } from "../config";

class Donut extends Phaser.GameObjects.Sprite {
  constructor({ scene, position }) {
    super(scene, position.x, position.y, "donuts", 0);
    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.setScale(globals.scale);
    this.body.setBounce(0.8);
    this.body.setCollideWorldBounds(true);
    this.body.setGravityY(globals.gravity);
  }

  flap() {
    this.body.velocity.y -= 400;
  }
}

export default Donut;
