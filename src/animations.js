const animationConfig = {
  player: {
    run: {
      textureKey: 'player',
      frames: { start: 0, end: 2},
      frameRate: 10,
      yoyo: false,
      repeat: 0
    },
    attack: {
      textureKey: 'player',
      frames: { frames: [5, 3]},
      frameRate: 10,
      yoyo: true,
      repeat: 0
    },
    jump: {
      textureKey: 'player',
      frames: { frames: [4]},
      frameRate: 6,
      yoyo: false,
      repeat: 0
    },
    die: {
      textureKey: 'player',
      frames: { frames: [5, 7]},
      frameRate: 3
    },
    damage: {
      textureKey: 'player',
      frames: { frames: [5, 6]},
      frameRate: 3,
      yoyo: true
    },
    idle: {
      textureKey: 'player',
      frames: { frames: [5]}
    }
  },
  slime: {
    move: {
      textureKey: 'enemies',
      frames: { start: 0, end: 2 },
      frameRate: 5,
      yoyo: true
    }
  },
  dino: {
    move: {
      textureKey: 'enemies',
      frames: { start: 4, end: 6 },
      frameRate: 3,
      yoyo: true
    },
    attack: {
      textureKey: 'enemies',
      frames: { start: 6, end: 7 },
      frameRate: 3,
      yoyo: true
    }
  },
  eyebat: {
    move: {
      textureKey: 'enemies',
      frames: { start: 8, end: 9 },
      frameRate: 3,
      yoyo: true
    },
    attack: {
      textureKey: 'enemies',
      frames: { start: 9, end: 10 },
      frameRate: 3,
      yoyo: true
    }
  },
  teleport: {
    in: {
      textureKey: 'items',
      frames: { start: 0, end: 2 },
      frameRate: 3,
      yoyo: false,
      repeat: -1
    },
    out: {
      textureKey: 'items',
      frames: { frames: [ 2, 1, 0] },
      frameRate: 3,
      yoyo: false,
      repeat: -1
    }
  },
  coin: {
    idle: {
      textureKey: 'items',
      frames: { start: 4, end: 7 },
      frameRate: 10,
      yoyo: false,
      repeat: -1
    }
  },
  fireball: {
    start: {
      textureKey: 'items',
      frames: { frames: [8, 9, 10]},
      frameRate: 3,
      yoyo: false,
      repeat: -1
    },
    move: {
      textureKey: 'items',
      frames: { frames: [ 10, 9 ] },
      frameRate: 10,
      yoyo: true,
      repeat: -1
    },
    impact: {
      textureKey: 'items',
      frames: { frames: [ 8, 9, 10, 11 ]},
      frameRate: 3,
      yoyo: false,
      repeat: -1
    }
  }

}

const loadAnimations = (scene) => {
  Object.keys(animationConfig).forEach((entity) => {
    Object.keys(animationConfig[entity]).forEach((action) => {
      const currentAnim = animationConfig[entity][action];
      scene.anims.create({
        key: `${entity} ${action}`,
        frames: scene.anims.generateFrameNumbers(currentAnim.textureKey, currentAnim.frames),
        frameRate: currentAnim.frameRate,
        yoyo: currentAnim.yoyo,
        repeat: currentAnim.repeat
      })
    })
  })
}

export default loadAnimations
