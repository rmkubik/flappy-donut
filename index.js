import 'phaser';
import './src/test';
import tree1 from './assets/donut.svg';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 200
            }
        }
    },
    scene: {
        preload,
        create
    }
}

const gameEl = document.querySelector(`#${config.parent}`);
const game = new Phaser.Game(config);

function preload() {
    console.log('preload');
    this.load.image('test', tree1);
}

function create() {
    const text = this.add.text(100, 100, 'Phaser + Parcel');

    this.add.image(400, 100, 'test');
}

if (module.hot) {
  module.hot.accept(() => {
    while (gameEl.firstChild) {
      gameEl.removeChild(gameEl.firstChild);
    }
    game.boot();
  });
}
