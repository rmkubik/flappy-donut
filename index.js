import 'phaser';
import './src/test';
import donut from './assets/donut.svg';
import tree from './assets/tree1.png';
import donuts from './assets/donuts.png';

const globals = {
    tileSize: 32,
    scale: 2,
    tilesTall: 10,
    pipeGapSize: 3,
    gravity: 300
}

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: globals.tileSize * globals.scale * globals.tilesTall,
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
    // donut.body.setCircle(globals.tileSize / 2);
    donut.setCollideWorldBounds(true);
    donut.body.setGravityY(globals.gravity);

    pipes = this.physics.add.group();
    buildPipe(pipes, 5);

    this.physics.add.collider(donut, pipes, (donut, pipe) => {
        pipe.body.setGravityY(globals.gravity);
    });

    this.input.keyboard.on('keydown_SPACE', event => {
        flap(donut);
    });

    this.input.keyboard.on('touchstart', event => {
        flap(donut);
    });

    this.input.keyboard.on('keydown_ENTER', event => {
        buildPipePair();
    });

    setInterval(() => {
        buildPipePair();
    }, 1000);
}

function flap(donut) {
    donut.body.velocity.y -= 400;
}

function update() {
    pipes.getChildren().forEach(pipe => {
        if (pipe.body.x < 0 || pipe.body.y > config.height) {
            if (pipe.active) {
                pipes.remove(pipe);
            }
        }
    });
}

function buildPipePair() {
    const topHeight = Phaser.Math.RND.between (
        1,
        globals.tilesTall - globals.pipeGapSize - 1
    );
    const bottomHeight = globals.tilesTall - globals.pipeGapSize - topHeight;
    buildPipe(pipes, topHeight);
    buildPipe(pipes, bottomHeight, true);
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
