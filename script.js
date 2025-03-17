const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// IMAGES
const carImg = new Image();
carImg.src = "./images/car1.avif";

const obstacleImg = new Image();
obstacleImg.src = "./images/barr.webp";

const fuelImg = new Image();
fuelImg.src = "./images/tank.webp";

// sounds
const moveSound = new Audio("./audio/move.mp3");
const crashSound = new Audio("./audio/crash.mp3");
const fuelSound = new Audio("./audio/fueling.mp3");

// playlist
const musicTracks = ["./music/track1.mp3", "./music/track2.mp3", "./music/track3.mp3"];
let currentTrackIndex = 0;
let musicPlayer = new Audio(musicTracks[currentTrackIndex]);
musicPlayer.loop = false;

musicPlayer.addEventListener("ended", () => {
    currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length;
    playMusic();
});

function playMusic() {
    musicPlayer.src = musicTracks[currentTrackIndex];
    musicPlayer.play();
    document.getElementById("musicToggle").innerHTML = "pause music";
}

function toggleMusic() {
    if (musicPlayer.paused) {
        playMusic();
    } else {
        musicPlayer.pause();
        document.getElementById("musicToggle").innerHTML = "play music";
    }
}

// car properties
const car = { x: 150, y: 500, width: 50, height: 100, speed: 5, dx: 0, dy: 0 };

// game variables
const lanes = [50, 150, 250, 350];
let obstacles = [];
let fuelPacks = [];
let fuel = 100;
let score = 0;
let gameOver = false;

// game elements
document.getElementById("gameCanvas").style.display = "none";
document.getElementById("gameOverScreen").style.display = "none";

// start game
function startGame() {
    document.getElementById("welcomeScreen").style.display = "none";
    document.getElementById("gameCanvas").style.display = "block";
    playMusic();
    updateGame();
}

// Handle key events
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && car.x > 0) {
        car.x -= car.speed * 2;
        moveSound.play();
    }
    if (event.key === "ArrowRight" && car.x < canvas.width - car.width) {
        car.x += car.speed * 2;
        moveSound.play();
    }
    if (event.key === "ArrowUp") {
        car.speed = 8;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowUp") {
        car.speed = 5;
    }
});

// create obstacle
function createObstacle() {
    let laneIndex = Math.floor(Math.random() * lanes.length);
    let x = lanes[laneIndex];
    obstacles.push({ x: x, y: 0, width: 50, height: 80 });
}

// create fuel pack
function createFuelPack() {
    let laneIndex = Math.floor(Math.random() * lanes.length);
    let x = lanes[laneIndex];
    fuelPacks.push({ x: x, y: 0, width: 40, height: 40 });
}

// update fuel
function updateFuel() {
    fuel -= 0.1;
    if (fuel <= 0) {
        gameOver = true;
    }
}

function updateGame() {
    if (gameOver) {
        endGame();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(carImg, car.x, car.y, car.width, car.height);

    // Handle obstacles
    obstacles.forEach((obs, i) => {
        obs.y += 3 + score / 100;
        ctx.drawImage(obstacleImg, obs.x, obs.y, obs.width, obs.height);

        // Collision detection with obstacles
        if (car.x < obs.x + obs.width &&
            car.x + car.width > obs.x &&
            car.y < obs.y + obs.height && car.y + car.height > obs.y) {
            crashSound.play();
            gameOver = true;
        }

        if (obs.y > canvas.height) {
            obstacles.splice(i, 1); // Remove obstacle if it goes off-screen
        }
    });

    // Handle fuel packs
    fuelPacks.forEach((fuelPack, i) => {
        fuelPack.y += 3 + score / 100;
        ctx.drawImage(fuelImg, fuelPack.x, fuelPack.y, fuelPack.width, fuelPack.height);

        // Collision detection with fuel packs
        if (car.x < fuelPack.x + fuelPack.width &&
            car.x + car.width > fuelPack.x &&
            car.y < fuelPack.y + fuelPack.height && car.y + car.height > fuelPack.y) {
            fuel = Math.min(100, fuel + 20);
            fuelPacks.splice(i, 1); // Remove fuel pack after collection
            fuelSound.play();
        }

        if (fuelPack.y > canvas.height) {
            fuelPacks.splice(i, 1); // Remove fuel pack if it goes off-screen
        }
    });

    updateFuel();

    // Display score
    score++;
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);

    requestAnimationFrame(updateGame);
}

function endGame() {
    document.getElementById("gameOverScreen").style.display = "block";
    document.getElementById("finalScore").innerText = "Final Score: " + score;
}

function restartGame() {
location.reload();

}

setInterval(createObstacle, 2000);
setInterval(createFuelPack, 5000);


