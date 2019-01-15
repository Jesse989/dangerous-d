import 'phaser'

import BootScene from './scenes/BootScene'
import GameScene from './scenes/GameScene'

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'dangerous',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 550 }
    }
  },
  scene: [ BootScene, GameScene ]
}

let Game = new Phaser.Game(config)
