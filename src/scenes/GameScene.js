class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene'
    })

    this.cursors
    this.player
    this.boots
    this.slimes = []
    this.hearts = []
    // this.dinos = []
    // this.eyebats = []
    // this.teleportIn
    // this.teleportOut
    // this.coins = []
    this.moveSlime = (slime) => {
      if (slime.body.velocity.x === 0) {
        slime.setVelocityX(16)
        slime.flipX = false
      }
      if (slime.body.blocked.right) {
        slime.setVelocityX(-16)
        slime.flipX = true
      }
      if (slime.body.blocked.left) {
        slime.setVelocityX(16)
        slime.flipX = false
      }
    }
  }

  preload() {
    this.load.image('tiles', './src/assets/tiles.png')
    this.load.tilemapTiledJSON('map', './src/assets/dangerous_demo.json')
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    const map = this.make.tilemap({ key: 'map' })
    const tileset = map.addTilesetImage('dangerous', 'tiles')
    const layer1 = map.createStaticLayer("map", tileset, 0, 0)
    layer1.setCollisionByProperty({ collides: true })

    let enemiesSpawnPoints = map.getObjectLayer("spawn")
      .objects.map((point) => {
        switch (point.name) {
          case "player":
            this.player = this.physics.add.sprite(point.x, point.y, 'player', '5')
            this.physics.add.collider(this.player, layer1);
            break;
          case "slime":
            let slimeIndex = this.slimes.length
            this.slimes[slimeIndex] =
              this.physics.add.sprite(point.x, point.y, 'enemies', 0)
            this.slimes[slimeIndex].anims.play('slime move', true)
            this.physics.add.collider(this.slimes[slimeIndex], layer1)
            this.physics.add.collider(this.slimes[slimeIndex], this.player)
            break;
          case "heart":
            let heartIndex = this.hearts.length
            this.hearts[heartIndex] =
              this.physics.add.sprite(point.x, point.y, 'items', 13)
            this.physics.add.collider(this.hearts[heartIndex], this.player)
            this.physics.add.collider(this.hearts[heartIndex], layer1)
            break;
          case "boots":
            this.boots = this.physics.add.sprite(point.x, point.y, 'items', 12)
            this.physics.add.collider(this.boots, this.player, (boots, player) => {
              boots.disableBody(true, true)
            })
            this.physics.add.collider(this.boots, layer1)
            break;
          default:

        }
    })

    this.cameras.main.startFollow(this.player)
    this.cameras.main.setZoom(4)

    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // layer1.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // });
  }

  update(time, delta) {
    console.log(`seconds: ${(time / 1000).toFixed(2)}, delta: ${delta}` );
    this.slimes.forEach((slime) => {
      this.moveSlime(slime)
    })

    if (!this.player.body.blocked.down) {
      this.player.anims.play('player jump', true)
    }

    this.input.keyboard.once('keydown_UP', () => {
      if (!this.player.body.blocked.down) return
      this.player.setVelocityY(-200);
    }, this)

    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-120)
        this.player.flipX = true
        if (this.player.anims.currentAnim.key === 'player idle') {
          this.player.anims.play('player run', true)
        }
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(120)
      this.player.flipX = false
      if (this.player.anims.currentAnim.key === 'player idle') {
        this.player.anims.play('player run', true)
      }
    } else if (this.cursors.space.isDown) {
      this.player.anims.play('player attack', false)
    } else if (!this.player.anims.isPlaying) {
      this.player.anims.play('player idle', true);
    } else {
      this.player.setVelocityX(0);
    }
  }
}

export default GameScene
