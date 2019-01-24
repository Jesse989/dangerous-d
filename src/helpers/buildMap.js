function buildMap(scene) {

  const map = scene.make.tilemap({ key: 'map' })
  const tileset = map.addTilesetImage('dangerous', 'tiles')
  const aiCollidors = map.createStaticLayer("aiCollidors", tileset, 0, 0)
  const layer1 = map.createStaticLayer("map", tileset, 0, 0)
  const exit = map.createStaticLayer("exit", tileset, 0, 0)
  layer1.setCollisionByProperty({ collides: true })
  aiCollidors.setCollisionByProperty({ aiCollidor: true })

  scene.fireballs = scene.physics.add.group({
    max: 1
  })
  scene.physics.add.collider(scene.fireballs, layer1, (fireball, level) => {
    fireball.anims.play('fireball impact', true)
  })

  map.getObjectLayer("spawn")
    .objects.map((point) => {
      switch (point.name) {
        case "player":
          scene.player = scene.physics.add.sprite(point.x, point.y, 'player', '5')
          scene.physics.add.collider(scene.player, layer1);
          break;
        case "slime":
          let slimeIndex = scene.slimes.length
          scene.slimes[slimeIndex] =
            scene.physics.add.sprite(point.x, point.y, 'enemies', 0)
          scene.slimes[slimeIndex].setData('hp', 3)
          scene.slimes[slimeIndex].setData('canTakeDmg', true)
          scene.slimes[slimeIndex].anims.play('slime move', true)
          scene.slimes[slimeIndex].body.setImmovable(true)

          scene.physics.add.collider(scene.slimes[slimeIndex], layer1)
          scene.physics.add.collider(scene.slimes[slimeIndex], aiCollidors)
          scene.physics.add.collider(scene.slimes[slimeIndex], scene.player,
            (slime, player) => {
            if (scene.hp > 1 && scene.canTakeDmg) {
              scene.hp--
              let a = Math.sign(player.x - slime.x)
              player.setVelocityY(-120)
              scene.playerGSP = 120 * a
              scene.canTakeDmg = false
            } else if (scene.hp === 1) {
              scene.scene.stop()
            }
          })
          scene.physics.add.collider(scene.slimes[slimeIndex], scene.fireballs,
            (slime, fireball) => {
              fireball.anims.play('fireball impact', true)
              if (slime.data.values.canTakeDmg) scene.takeDmg(fireball, slime)
          })
          break;
        case "heart":
          let heartIndex = scene.hearts.length
          scene.hearts[heartIndex] =
            scene.physics.add.sprite(point.x, point.y, 'items', 13)
          scene.physics.add.collider(scene.hearts[heartIndex], scene.player,
            (heart, player) => {
            if (scene.hp < 6) {
              scene.hp++
            }
            heart.disableBody(true, true)
            scene.pwrSound.play({
              mute: false,
              volume: .6,
              rate: .8,
              detune: 0,
              loop: false,
            })
          })
          scene.physics.add.collider(scene.hearts[heartIndex], layer1)
          break;
        case "boots":
          scene.boots = scene.physics.add.sprite(point.x, point.y, 'items', 12)
          scene.physics.add.collider(scene.boots, scene.player, (boots, player) => {
            boots.disableBody(true, true)
            scene.playerHasBoots = true
            scene.pwrSound.play({
              mute: false,
              volume: .6,
              rate: .8,
              detune: 0,
              loop: false,
            })
          })
          scene.physics.add.collider(scene.boots, layer1)
          break;
        case "crystal":
          let crystalIndex = scene.crystals.length
          scene.crystals[crystalIndex] =
            scene.physics.add.sprite(point.x, point.y, 'items', 4)
            scene.crystals[crystalIndex].anims.play('crystal idle', true)
            scene.crystals[crystalIndex].body.setAllowGravity(false)
            scene.physics.add.collider(scene.crystals[crystalIndex], scene.player,
              (crystal, player) => {
                scene.pickupSound.play({
                  mute: false,
                  volume: .6,
                  rate: .8,
                  detune: 0,
                  loop: false,
                })
                scene.playerCrystalCount++
                scene.crystalText.setText(`${scene.playerCrystalCount}`)
            crystal.disableBody(true, true)
        })
          break;
        default:

      }
  })

}

export default buildMap
