const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");

let score = 0;
let isJumping = false;
let jumpHeld = false;

// Handle jump on spacebar press
function startJump() {
  if (isJumping) return;

  isJumping = true;
  jumpHeld = true;

  const jumpHeight = jumpHeld ? 180 : 130; // Higher jump if spacebar is held
  player.style.bottom = `${jumpHeight}px`;
  player.style.transition = "bottom 0.4s";

  setTimeout(() => {
    player.style.bottom = "10px";
    player.style.transition = "bottom 0.4s";

    setTimeout(() => {
      isJumping = false;
    }, 400);
  }, 400);
}

function endJump() {
  jumpHeld = false;
}

// Create a new obstacle (ground or flying)
function createObstacle(isFlying) {
  const obstacle = document.createElement("div");
  obstacle.className = "obstacle";

  if (isFlying) {
    obstacle.style.bottom = `${50 + Math.random() * 100}px`; // Random height above ground
    obstacle.style.width = "20px";  // Smaller flying obstacle
    obstacle.style.height = "20px";
  } else {
    obstacle.style.bottom = "10px"; // Ground-level obstacle
    obstacle.style.width = "30px";  // Slightly larger ground obstacle
    obstacle.style.height = "30px";
  }

  obstacle.style.left = "100vw";
  obstacle.style.transition = "left 2s linear";
  document.body.appendChild(obstacle);

  // Move obstacle left off-screen
  setTimeout(() => {
    obstacle.style.left = "-30px";
  }, 10);

  // Remove obstacle after it moves off-screen
  obstacle.addEventListener("transitionend", () => obstacle.remove());
}

// Spawn obstacles with some randomness
function spawnObstacles() {
  const spawnBoth = Math.random() < 0.5; // 50% chance to spawn both

  createObstacle(Math.random() < 0.5); // Always spawn at least one obstacle

  if (spawnBoth) {
    createObstacle(true); // Spawn an additional flying obstacle
  }
}

// Update the score every second
function updateScore() {
  score++;
  scoreDisplay.textContent = `Score: ${score}`;
}

// More forgiving collision detection
function checkCollision() {
  const playerRect = player.getBoundingClientRect();
  const obstacles = document.querySelectorAll(".obstacle");

  obstacles.forEach(obstacle => {
    const obstacleRect = obstacle.getBoundingClientRect();

    const buffer = 5; // Add a buffer for more forgiving collisions
    if (
      playerRect.right - buffer > obstacleRect.left &&
      playerRect.left + buffer < obstacleRect.right &&
      playerRect.bottom - buffer > obstacleRect.top &&
      playerRect.top + buffer < obstacleRect.bottom
    ) {
      alert(`Game Over! Final Score: ${score}`);
      window.location.reload();
    }
  });
}

// Game loop: Check for collisions
setInterval(checkCollision, 50);

// Increment score every second
setInterval(updateScore, 1000);

// Spawn obstacles every 1.5 seconds
setInterval(spawnObstacles, 1500);

// Listen for spacebar events
window.addEventListener("keydown", (event) => {
  if (event.code === "Space") startJump();
});

window.addEventListener("keyup", (event) => {
  if (event.code === "Space") endJump();
});
