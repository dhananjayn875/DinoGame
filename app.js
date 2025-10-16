// === DOM ELEMENTS ===
const dino = document.getElementById("dino");
const obstacle = document.getElementById("obstacle");
const gameOverDisplay = document.getElementById("game-over");
const scoreDisplay = document.getElementById("score");
const finalScoreDisplay = document.getElementById("final-score"); // NEW!
const gameContainer = document.getElementById("game-container");

// === GAME STATE VARIABLES ===
let isJumping = false;
let isGameOver = true; 
let dinoPosition = 0;    
let dinoX = 20;          
let obstaclePosition = 960; 
let score = 0;
let speed = 4;           
let gameLoopInterval; 

// === PHYSICS CONSTANTS ===
const gravity = 0.9;
let jumpVelocity = 0;

// === 1. JUMP MECHANISM ===

function jump() {
    if (isJumping || isGameOver) return;
    
    isJumping = true;
    jumpVelocity = 25;
    
    const upInterval = setInterval(() => {
        dinoPosition += jumpVelocity;
        jumpVelocity -= gravity;
    
        if (dinoPosition <= 0) {
            clearInterval(upInterval);
            dinoPosition = 0;
            isJumping = false;
            jumpVelocity = 0;
        }
        
        dino.style.bottom = dinoPosition + 'px';
    }, 20);
}


// === 2. OBSTACLE MOVEMENT AND COLLISION ===

function startGame() {
    if (!isGameOver) return;
    
    // Reset state
    isGameOver = false;
    score = 0;
    speed = 4;
    dinoX = 380;
    dinoPosition = 0; // Ensure dino starts on ground
    obstaclePosition = 970; 
    
    // --- Reset visual styles ---
    gameOverDisplay.style.display = 'none';
    obstacle.style.display = 'block'; 
    scoreDisplay.textContent = 'Score: 0';
    dino.style.opacity = '1'; // Make dino fully visible again
    dino.style.backgroundImage = "url('trex.gif')"; // Ensure correct sprite sheet

    dino.style.left = dinoX + 'px'; 
    obstacle.style.left = obstaclePosition + 'px';

    gameLoopInterval = setInterval(() => {
        obstaclePosition -= speed;
        
        if (obstaclePosition < -25) { // Adjusted for obstacle width
            obstaclePosition = 960; 
            score++;
            scoreDisplay.textContent = 'Score: ' + score;
            if (score % 5 === 0) {
                speed += 0.5; 
            }
        }
        
        obstacle.style.left = obstaclePosition + 'px';
        
        if (isCollision()) {
            endGame();
        }
        
    }, 15); 
}

function isCollision() {
    const currentDinoLeft = dinoX; 
    const dinoWidth = 100; // NEW! Use actual image width
    const dinoHeight = 80; // NEW! Use actual image height
    
    const obstacleLeft = obstaclePosition;
    const obstacleWidth = 50; // NEW! Use actual image width
    const obstacleHeight = 105; // NEW! Use actual image height
    
    const isHorizontalOverlap = (currentDinoLeft + dinoWidth > obstacleLeft) && (currentDinoLeft < obstacleLeft + obstacleWidth);
    
    const isVerticalOverlap = dinoPosition < obstacleHeight;

    return isHorizontalOverlap && isVerticalOverlap;
}

// === 3. GAME OVER LOGIC ===
function endGame() {
    isGameOver = true;
    clearInterval(gameLoopInterval); 
    gameOverDisplay.style.display = 'flex';
    obstacle.style.display = 'none'; 
    
    // --- NEW! Display final score ---
    finalScoreDisplay.textContent = score;

    // --- Visual feedback for collision (Dino disappears or shows crash frame) ---
    // For a crash, you might replace the sprite with a 'hit' frame or make it disappear
    dino.style.opacity = '0'; // Example: make dino disappear
    // Or, if you have a crash sprite:
    // dino.style.backgroundPosition = '-132px 0px'; // Example: assuming crash frame is at -132px
}

// === 4. INPUT HANDLER AND INITIALIZATION ===
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        if (isGameOver) {
            startGame();
        } else {
            jump();
        }
    }
});

// Initial Setup
obstacle.style.left = obstaclePosition + 'px'; 
dino.style.left = dinoX + 'px';
gameOverDisplay.style.display = 'flex';