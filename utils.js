function rectangularCollision({
  recantle1,
  recantle2

}) {
  return (
    recantle1.attackBox.position.x + recantle1.attackBox.width >= recantle2.position.x && 
    recantle1.attackBox.position.x <= recantle2.position.x + recantle2.width &&
    recantle1.attackBox.position.y + recantle1.attackBox.height >= recantle2.position.y &&
    recantle1.attackBox.position.y <= recantle2.position.y + recantle2.height
  )
}

function determineWinner({player, enemy, timerId}) {
  clearTimeout(timerId)
  if (player.health == enemy.health) {
    document.querySelector('.winner').innerHTML = "Tie"
  } else if(player.health > enemy.health) {
    document.querySelector('.winner').innerHTML = "Player1 wins"
      enemy.switchSprite('death')
  } else {
    document.querySelector('.winner').innerHTML = "Player2 wins"
    player.switchSprite('death')
  }
}

let timer = 60;
let timerId

function decreaseTimer() {
  if(timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000)
    timer --
    document.querySelector('.timer').innerHTML = timer
  }
  if (timer == 0) {
    document.querySelector('.winner').style.display = "flex"
    determineWinner({player, enemy, timerId})
  }
}