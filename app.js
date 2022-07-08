const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.7;

const xMoveSpeed = 5;
const jumpHeight = -20;

c.fillRect(0, 0, canvas.width, canvas.height);


const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './images/background.png'
})


const shop = new Sprite({
  position: {
    x: 600,
    y: 128
  },
  imageSrc: './images/shop.png',
  scale: 2.75,
  framesMax: 6
})

const player = new Fighter({
  position: {
    x: 100,
    y: 0
  }, 
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './images/Samurai/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: "./images/Samurai/Idle.png",
      framesMax: 8
    },
    run: {
      imageSrc: "./images/Samurai/Run.png",
      framesMax: 8
    },
    jump: {
      imageSrc: "./images/Samurai/Jump.png",
      framesMax: 2
    },
    fall: {
      imageSrc: "./images/Samurai/Fall.png",
      framesMax: 2
    },
    attack1: {
      imageSrc: "./images/Samurai/Attack1.png",
      framesMax: 6
    },
    takeHit: {
      imageSrc: "./images/Samurai/Take Hit - white silhouette.png",
      framesMax: 4
    },
    death: {
      imageSrc: "./images/Samurai/Death.png",
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 160,
    height: 50
  }
})



player.draw()

const enemy = new Fighter({
  position: {
    x: 840,
    y: 100
  }, 
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: './images/Kenji/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167
  },
  sprites: {
    idle: {
      imageSrc: "./images/Kenji/Idle.png",
      framesMax: 4
    },
    run: {
      imageSrc: "./images/Kenji/Run.png",
      framesMax: 8
    },
    jump: {
      imageSrc: "./images/Kenji/Jump.png",
      framesMax: 2
    },
    fall: {
      imageSrc: "./images/Kenji/Fall.png",
      framesMax: 2
    },
    attack1: {
      imageSrc: "./images/Kenji/Attack1.png",
      framesMax: 4
    },
    takeHit: {
      imageSrc: "./images/Kenji/Take hit.png",
      framesMax: 3
    },
    death: {
      imageSrc: "./images/Kenji/Death.png",
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50
    },
    width: 170,
    height: 50
  }
})

enemy.draw()

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()


  // player movement
  player.velocity.x = 0
  if (keys.a.pressed && player.lastKey == 'a') {
    player.velocity.x = -xMoveSpeed
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey == 'd') {
    player.velocity.x = xMoveSpeed
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }
  if (player.velocity.y<0) {
    player.switchSprite('jump')
  } else if (player.velocity.y>0) {
    player.switchSprite('fall')
  }

// enemy movement
  enemy.velocity.x = 0
  if (keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight') {
    enemy.velocity.x = xMoveSpeed
    enemy.switchSprite('run')
  } else if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft') {
    enemy.velocity.x = -xMoveSpeed
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }
  if (enemy.velocity.y<0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y>0) {
    enemy.switchSprite('fall')
  }

  // detect for colision & enemy gets hit
  if (
    rectangularCollision({
      recantle1: player, 
      recantle2: enemy
    }) && 
    player.isAttacking && player.frameCurrent == 4
  ) {
    enemy.takeHit(20)
    player.isAttacking = false
    gsap.to('.enemyHealthDown', {
      width: enemy.health + '%'
    })
  }


  // if player misses
  if (player.isAttacking && player.frameCurrent == 4) {
    player.isAttacking = false
  }


  // player gets hit
  if (
    rectangularCollision({
      recantle1: enemy, 
      recantle2: player
    }) && 
    enemy.isAttacking && enemy.frameCurrent == 2
  ) {
    player.takeHit(10)
    enemy.isAttacking = false
    gsap.to('.playerHealthDown', {
      width: player.health + '%'
    })
  }

  // if enemy misses
  if (enemy.isAttacking && enemy.frameCurrent == 2) {
    enemy.isAttacking = false
  }

  // end game on health:
  if (enemy.health == 0 || player.health == 0) {
    document.querySelector('.winner').style.display = 'flex'
    determineWinner({player, enemy, timerId})
  }
}

animate()


// player movement
window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        player.lastKey = 'd'
        keys.d.pressed = true
        break
        
      case 'a':
        player.lastKey = 'a'
        keys.a.pressed = true
        break
  
      case 'w':
        if (player.position.y >= 328) {
          player.velocity.y = jumpHeight
        }
        break
      case " ":
        player.attack()
        break
    }
  }
})
window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
      
    case 'a':
      keys.a.pressed = false
      break
  }
})


// enemy movement

window.addEventListener('keydown', (event) => {
  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        enemy.lastKey = 'ArrowRight'
        keys.ArrowRight.pressed = true
        break
        
      case 'ArrowLeft':
        enemy.lastKey = 'ArrowLeft'
        keys.ArrowLeft.pressed = true
        break
  
      case 'ArrowUp':
        if (enemy.position.y >= 328) {
          enemy.velocity.y = jumpHeight
        }
        break
  
      case 'ArrowDown':
        enemy.attack()
        break
    }
  }
})
window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
      
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})