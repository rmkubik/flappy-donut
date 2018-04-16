import 'phaser';
import './src/test';
import donut from './assets/donut.svg';
import tree from './assets/tree1.png';
import donuts from './assets/donuts.png';

const globals = {
    tileSize: 32,
    scale: 2
}

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: globals.tileSize * globals.scale * 10,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    },
    pixelArt: true
}

const gameEl = document.querySelector(`#${config.parent}`);
const game = new Phaser.Game(config);

let pipes;

function preload() {
    this.load.image('donut', donut);
    this.load.image('tree', tree);
    this.load.spritesheet('donuts', donuts, {
        frameWidth: globals.tileSize,
        frameHeight: globals.tileSize
    });
}

function create() {
    const text = this.add.text(10, 10, 'Flappy Donut');

    const donut = this.physics.add.sprite(150, 100, 'donuts', 0);
    donut.setScale(2);
    donut.setBounce(0.8);
    donut.setCollideWorldBounds(true);
    donut.body.setGravityY(300);

    pipes = this.physics.add.group();
    buildPipe(pipes, 5);

    this.physics.add.collider(donut, pipes);

    this.input.keyboard.on('keydown_SPACE', event => {
        donut.body.velocity.y -= 400;
    });

    this.input.keyboard.on('keydown_ENTER', event => {
        buildPipe(pipes, 5);
        buildPipe(pipes, 2, true);
    });
}

function update() {
    pipes.getChildren().forEach(pipe => {
        if (pipe.body.x < 0) {
            if (pipe.active) {
                pipes.remove(pipe);
            }
        }
    });
}

function buildPipe(pipes, height, ceiling) {
    for (let i = 1; i <= height; i++) {
        let y;
        let flipY;
        if (ceiling) {
            y = (globals.tileSize * globals.scale * i) - globals.tileSize;
            flipY = true;
        } else {
            y = config.height - (globals.tileSize * globals.scale * i) + globals.tileSize;
            flipY = false;
        }

        const pipe = pipes.create(
            config.width + globals.tileSize / 2 * globals.scale,
            y,
            'donuts',
            i === height ? 1 : 2
        );
        pipe.setScale(globals.scale);
        pipe.body.velocity.x = -300;
        pipe.flipY = flipY;
    }
}

if (module.hot) {
  module.hot.accept(() => {
    while (gameEl.firstChild) {
      gameEl.removeChild(gameEl.firstChild);
    }
    game.boot();
  });
}
