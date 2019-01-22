const acc = 4.6875
const dec = 5.0
const frc = 4.6875
const top = 100
const meterOffsetX = -125
const meterOffsetY = -75
const dmgCooldown = 500
const slimeDmgCooldown = 3000
const fireballCooldown = 3000

class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene'
    })

    this.cursors
    this.player
    this.playerCrystalCount = 0
    this.crystalText
    this.hudCrystal
    this.playerCanDoubleJump = false
    this.playerHasBoots = false
    this.canShootFireball = false
    this.canTakeDmg = true
    this.playerGSP = 0
    this.playerASP = 0
    this.boots
    this.slimes = []
    this.hearts = []
    this.crystals = []
    this.fireballs
    this.meter
    this.hp = 6

    // this.dinos = []
    // this.eyebats = []
    // this.teleportIn
    // this.teleportOut

  }

  moveSlime(slime) {
    if (slime.body.velocity.x === 0) {
      slime.setVelocityX(24)
      slime.flipX = false
    }
    if (slime.body.blocked.right) {
      slime.setVelocityX(-24)
      slime.flipX = true
    }
    if (slime.body.blocked.left) {
      slime.setVelocityX(24)
      slime.flipX = false
    }
  }

  takeDmg(weapon, victim) {
    victim.data.set('canTakeDmg', false)
    let direction = Math.sign(weapon.x - victim.x)
    victim.setVelocityX(direction * 75)
    if (victim.body.velocity.x < 0) {
      victim.flipX = true
    } else {
      victim.flipX = false
    }
    if (victim.data.values.hp > 1) {
      victim.data.values.hp--
    } else if (victim.data.values.hp === 1) {
      victim.disableBody(true, true)
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
    const aiCollidors = map.createStaticLayer("aiCollidors", tileset, 0, 0)
    const layer1 = map.createStaticLayer("map", tileset, 0, 0)
    const exit = map.createStaticLayer("exit", tileset, 0, 0)
    layer1.setCollisionByProperty({ collides: true })
    aiCollidors.setCollisionByProperty({ aiCollidor: true })

    this.fireballs = this.physics.add.group()
    this.physics.add.collider(this.fireballs, layer1, (fireball, level) => {
      fireball.anims.play('fireball impact', true)
    })

    map.getObjectLayer("spawn")
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
            this.slimes[slimeIndex].setData('hp', 3)
            this.slimes[slimeIndex].setData('canTakeDmg', true)
            this.slimes[slimeIndex].anims.play('slime move', true)
            this.slimes[slimeIndex].body.setImmovable(true)

            this.physics.add.collider(this.slimes[slimeIndex], layer1)
            this.physics.add.collider(this.slimes[slimeIndex], aiCollidors)
            this.physics.add.collider(this.slimes[slimeIndex], this.player,
              (slime, player) => {
              if (this.hp > 1 && this.canTakeDmg) {
                this.hp--
                let a = Math.sign(player.x - slime.x)
                player.setVelocityY(-120)
                this.playerGSP = 120 * a
                this.canTakeDmg = false
              } else if (this.hp === 1) {
                this.scene.stop()
              }
            })
            this.physics.add.collider(this.slimes[slimeIndex], this.fireballs,
              (slime, fireball) => {
                fireball.anims.play('fireball impact', true)
                if (slime.data.values.canTakeDmg) this.takeDmg(fireball, slime)
            })
            break;
          case "heart":
            let heartIndex = this.hearts.length
            this.hearts[heartIndex] =
              this.physics.add.sprite(point.x, point.y, 'items', 13)
            this.physics.add.collider(this.hearts[heartIndex], this.player,
              (heart, player) => {
              if (this.hp < 6) {
                this.hp++
              }
              heart.disableBody(true, true)
            })
            this.physics.add.collider(this.hearts[heartIndex], layer1)
            break;
          case "boots":
            this.boots = this.physics.add.sprite(point.x, point.y, 'items', 12)
            this.physics.add.collider(this.boots, this.player, (boots, player) => {
              boots.disableBody(true, true)
              this.playerHasBoots = true
            })
            this.physics.add.collider(this.boots, layer1)
            break;
          case "crystal":
            let crystalIndex = this.crystals.length
            this.crystals[crystalIndex] =
              this.physics.add.sprite(point.x, point.y, 'items', 4)
              this.crystals[crystalIndex].anims.play('crystal idle', true)
              this.crystals[crystalIndex].body.setAllowGravity(false)
              this.physics.add.collider(this.crystals[crystalIndex], this.player,
                (crystal, player) => {
                  this.playerCrystalCount++
                  this.crystalText.setText(`${this.playerCrystalCount}`)
              crystal.disableBody(true, true)
          })
            break;
          default:

        }
    })

    this.cameras.main.startFollow(this.player)
    this.cameras.main.setZoom(4)

    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    //  aiCollidors.renderDebug(debugGraphics, {
    //    tileColor: null, // Color of non-colliding tiles
    //    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //    faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    //  });

    this.input.keyboard.on('keydown_UP', (e) => {
      if (this.player.body.blocked.down) {
        this.player.setVelocityY(-200)
        this.playerCanDoubleJump = true
      } else if (this.playerCanDoubleJump && this.playerHasBoots) {
        this.player.setVelocityY(-200)
        this.playerCanDoubleJump = false
      }
    })

    this.input.keyboard.on('keydown_SPACE', (e) => {
      if (!this.player.body.blocked.down) return
      if (!this.canShootFireball) return
      let direction = this.player.flipX ? -1 : 1
      let fireball = this.fireballs.create(this.player.x, this.player.y, 'items', '8')
      if (direction === -1) fireball.flipX = true
      fireball.anims.play('fireball move', true)
      fireball.setVelocityX(direction * 100)
      fireball.setCircle(5, 4, 3)
      fireball.body.setAllowGravity(false)
      this.canShootFireball = false
      fireball.on('animationcomplete', (anim, frame) => {
        if (anim.key === 'fireball impact') {
          fireball.destroy()
        }
      })
    })

    this.meter = this.add.image(0, 0, 'meter', '0')
    this.hudCrystal = this.add.sprite(0, 0, 'items', '4')
    this.hudCrystal.anims.play('crystal idle', true)

    this.crystalText = this.add.bitmapText(0, 0, 'font', `${this.playerCrystalCount}`, 8)


  }

  update(time, delta) {
    // prevent player from taking more than one dmg at a time
    if (time % dmgCooldown < delta) this.canTakeDmg = true
    if (time % fireballCooldown < delta) this.canShootFireball = true
    // sync the health meter with the hp var
    if (this.hp) this.meter.setFrame(this.hp - 1)
    this.meter.setPosition(this.player.x + meterOffsetX,
      this.player.y + meterOffsetY)
    this.hudCrystal.setPosition(this.meter.x + 24,
      this.meter.y - 1)
    this.crystalText.setPosition(this.hudCrystal.x + 10,
      this.hudCrystal.y - 3)

    this.slimes.forEach((slime) => {
      if (time % slimeDmgCooldown < delta) slime.data.values.canTakeDmg = true
      this.moveSlime(slime)
    })

    if (this.cursors.left.isDown) {
      this.player.flipX = true
      if (this.playerGSP > 0) {
        this.playerGSP -= dec;
      } else if (this.playerGSP > -top) {
        this.playerGSP -= acc;
      }
    } else if (this.cursors.right.isDown) {
      this.player.flipX = false
      if (this.playerGSP < 0) {
        this.playerGSP += dec;
      } else if (this.playerGSP < top) {
        this.playerGSP += acc;
      }
    } else if (this.canTakeDmg){
      this.playerGSP -= Math.min(Math.abs(this.playerGSP), frc)
        * Math.sign(this.playerGSP);
    } else if (!this.canTakeDmg ) {
      this.player.setFrame(4)
    }
    this.player.setVelocityX(this.playerGSP)
    if (this.player.body.velocity.x) {
      this.player.anims.play('player run', true)
    } else if (this.canTakeDmg){
      this.player.setFrame(5)
    }
  }
}

export default GameScene
