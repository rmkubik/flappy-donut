import 'phaser';
import './src/test';
import donut from './assets/donut.svg';
import tree from './assets/tree1.png';
import donuts from './assets/donuts.png';

const globals = {
    tileSize: 32,
    scale: 2,
    tilesTall: 10,
    tilesWide: 6,
    pipeGapSize: 3,
    gravity: 300,
    deviceScale: 1
}

const deviceWidth = window.innerWidth;// * window.devicePixelRatio;
const deviceHeight = window.innerHeight;// * window.devicePixelRatio;
const width = globals.tileSize * globals.scale * globals.tilesWide;
const height = globals.tileSize * globals.scale * globals.tilesTall;
globals.deviceScale = Math.min(deviceWidth / width, deviceHeight / height);

const config = {
    type: Phaser.AUTO,
    width: width,// * globals.deviceScale,
    height: height,// * globals.deviceScale,
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

// game.resize(width, height);
// game.scene.scenes.forEach(function (scene) {
//     scene.cameras.main.setViewport(0, 0, width, height);
// });

let pipes;

function preload() {
    this.mobile = false;
    let orientation = (this.mobile) ? 'left' : 'center';
    document.querySelector(`#${config.parent}`)
        .setAttribute(
            'style',
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
    donut.setScale(globals.scale);
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

    this.input.on('pointerdown', event => {
        flap(donut);
    });

    this.input.keyboard.on('keydown_ENTER', event => {
        buildPipePair();
    });

    this.time.addEvent({
        delay: 1000,
        callback: buildPipePair,
        callbackScope: this,
        loop: true
    });
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
