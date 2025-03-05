const player = document.getElementById('player');
const zombiesContainer = document.getElementById('zombies');
const bulletsContainer = document.getElementById('bullets');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
let score = 0;
let lives = 2;
let gameInterval;
let zombieInterval;

// Player position (centered)
const playerX = 400; // Half of game container width
const playerY = 300; // Half of game container height
player.style.left = `${playerX}px`;
player.style.top = `${playerY}px`;

// Create zombies from random edges
function createZombie() {
  const zombie = document.createElement('div');
  zombie.classList.add('zombie');
  const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
  if (edge === 0) {
    zombie.style.left = `${Math.random() * 800}px`;
    zombie.style.top = `-40px`;
  } else if (edge === 1) {
    zombie.style.left = `840px`;
    zombie.style.top = `${Math.random() * 600}px`;
  } else if (edge === 2) {
    zombie.style.left = `${Math.random() * 800}px`;
    zombie.style.top = `640px`;
  } else if (edge === 3) {
    zombie.style.left = `-40px`;
    zombie.style.top = `${Math.random() * 600}px`;
  }
  zombiesContainer.appendChild(zombie);

  const zombieX = parseFloat(zombie.style.left);
  const zombieY = parseFloat(zombie.style.top);
  const angle = Math.atan2(playerY - zombieY, playerX - zombieX);
  const speed = 1;

  const moveZombie = setInterval(() => {
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed;
    zombie.style.left = `${parseFloat(zombie.style.left) + dx}px`;
    zombie.style.top = `${parseFloat(zombie.style.top) + dy}px`;

    // Check for collision with player
    const zombieRect = zombie.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    if (
      zombieRect.left < playerRect.right &&
      zombieRect.right > playerRect.left &&
      zombieRect.top < playerRect.bottom &&
      zombieRect.bottom > playerRect.top
    ) {
      clearInterval(moveZombie);
      zombie.remove();
      loseLife();
    }

    // Remove zombie if it goes off screen
    if (
      zombieRect.left < -100 ||
      zombieRect.right > 900 ||
      zombieRect.top < -100 ||
      zombieRect.bottom > 700
    ) {
      clearInterval(moveZombie);
      zombie.remove();
    }
  }, 20);
}

// Shoot bullets
document.addEventListener('click', (e) => {
  const bullet = document.createElement('div');
  bullet.classList.add('bullet');
  bullet.style.left = `${playerX}px`;
  bullet.style.top = `${playerY}px`;
  bulletsContainer.appendChild(bullet);

  const angle = Math.atan2(
    e.clientY - playerY,
    e.clientX - playerX
  );
  const speed = 5;

  const moveBullet = setInterval(() => {
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed;
    bullet.style.left = `${parseFloat(bullet.style.left) + dx}px`;
    bullet.style.top = `${parseFloat(bullet.style.top) + dy}px`;

    // Check for collision with zombies
    const bulletRect = bullet.getBoundingClientRect();
    zombiesContainer.childNodes.forEach((zombie) => {
      const zombieRect = zombie.getBoundingClientRect();
      if (
        bulletRect.left < zombieRect.right &&
        bulletRect.right > zombieRect.left &&
        bulletRect.top < zombieRect.bottom &&
        bulletRect.bottom > zombieRect.top
      ) {
        clearInterval(moveBullet);
        bullet.remove();
        zombie.remove();
        score += 10;
        scoreElement.textContent = `Time Survived: ${score}s`;
      }
    });

    // Remove bullet if it goes off screen
    if (
      bulletRect.left < -10 ||
      bulletRect.right > 810 ||
      bulletRect.top < -10 ||
      bulletRect.bottom > 610
    ) {
      clearInterval(moveBullet);
      bullet.remove();
    }
  }, 20);
});

// Update score every second
function updateScore() {
  score++;
  scoreElement.textContent = `Time Survived: ${score}s`;
}

// Lose a life
function loseLife() {
  lives--;
  livesElement.textContent = `Lives: ${lives}`;
  if (lives === 0) {
    endGame();
  }
}

// End game
function endGame() {
  clearInterval(gameInterval);
  clearInterval(zombieInterval);
  alert(`Game Over! You survived for ${score} seconds.`);
  resetGame();
}

// Reset game
function resetGame() {
  zombiesContainer.innerHTML = '';
  bulletsContainer.innerHTML = '';
  score = 0;
  lives = 2;
  scoreElement.textContent = `Time Survived: ${score}s`;
  livesElement.textContent = `Lives: ${lives}`;
  startGame();
}

// Start game
function startGame() {
  gameInterval = setInterval(updateScore, 1000);
  zombieInterval = setInterval(createZombie, 1000); // Zombies spawn every second
}

startGame();