import GameScene from './GameScene'
import loadAnimations from '../animations.js'

class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene'
    })

  }

  preload() {
    // main point of boot scene is to
    // preload these assets
    this.load.audio('jump', './src/assets/jump.wav')
    this.load.audio('laser', './src/assets/laser.wav')
    this.load.audio('pickup', './src/assets/pickup.wav')
    this.load.audio('fire', './src/assets/fire.mp3')
    this.load.audio('pwr', './src/assets/pwr.mp3')
    this.load.spritesheet('meter',
      './src/assets/meter.png',
      { frameWidth: 28, frameHeight: 7 }
    )

    this.load.spritesheet('player',
      './src/assets/player.png',
      { frameWidth: 16, frameHeight: 16 }
    )

    this.load.spritesheet('enemies',
      './src/assets/enemies.png',
      { frameWidth: 16, frameHeight: 16 }
    )

    this.load.spritesheet('items',
      './src/assets/items.png',
      { frameWidth: 16, frameHeight: 16 }
    )
    this.load.bitmapFont('font',
      './src/assets/font.png',
      './src/assets/font.fnt');


    this.load.on('complete', ()=> {
      loadAnimations(this)
      this.scene.start('GameScene')
    })
  }
}

export default BootScene
