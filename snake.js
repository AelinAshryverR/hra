const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = 500;  // Zmena veľkosti plátna
canvas.height = 500;

tileSize = 20;
let snake = [{ x: 240, y: 240 }];
let direction = "RIGHT";
let food = generateFood();
let score = 0;
let gameOver = false;
let startX = null;
let startY = null;

document.addEventListener("keydown", changeDirection);
canvas.addEventListener("touchstart", touchStart);
canvas.addEventListener("touchmove", touchMove);

function changeDirection(event) {
    if (gameOver) return; // Nezmení smer, ak je hra skončená
    const key = event.key;
    if (key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function touchStart(event) {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
}

function touchMove(event) {
    if (!startX || !startY) return;

    const endX = event.touches[0].clientX;
    const endY = event.touches[0].clientY;

    const diffX = endX - startX;
    const diffY = endY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && direction !== "LEFT") direction = "RIGHT";
        if (diffX < 0 && direction !== "RIGHT") direction = "LEFT";
    } else {
        if (diffY > 0 && direction !== "UP") direction = "DOWN";
        if (diffY < 0 && direction !== "DOWN") direction = "UP";
    }

    startX = endX;
    startY = endY;
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / tileSize)) * tileSize,
        y: Math.floor(Math.random() * (canvas.height / tileSize)) * tileSize,
        value: Math.random() > 0.5 ? "1" : "0"
    };
}

function update() {
    let head = { ...snake[0] };
    if (direction === "UP") head.y -= tileSize;
    if (direction === "DOWN") head.y += tileSize;
    if (direction === "LEFT") head.x -= tileSize;
    if (direction === "RIGHT") head.x += tileSize;

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = generateFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);

    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height || snakeCollision(head)) {
        gameOver = true;
        let grade;
        if (score < 1) grade = "FX-keď nestihneš jeden vlak príde druhý ale až budúci rok";
        else if (score <= 2) grade = "E-Opakovanie je matka štúdia";
        else if (score <= 4) grade = "D-učivo ovládaš";
        else if (score <= 6) grade = "C-vieš viac jak potrebuješ";
        else if (score <= 8) grade = "B-Dobre ale kde je niečo navyše";
        else grade = "A-Občas aj ten kto nič nevie tak to má dobré";

        showGameOver(grade);
    }
}

function snakeCollision(head) {
    return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
}

function showGameOver(grade) {
    const gameOverText = `Hra skončila! Score: ${score} - Tvoja známka: ${grade}`;
    const restartButton = document.createElement("button");
    restartButton.textContent = "Hrať znova";
    restartButton.onclick = restartGame;

    document.body.appendChild(document.createElement("br"));
    document.body.appendChild(document.createTextNode(gameOverText));
    document.body.appendChild(document.createElement("br"));
    document.body.appendChild(restartButton);
}

function restartGame() {
    gameOver = false;
    snake = [{ x: 240, y: 240 }];
    direction = "RIGHT";
    score = 0;
    food = generateFood();

    // Odstránime text a tlačidlo pre reštart
    document.body.innerHTML = "";
    document.body.appendChild(canvas);

    gameLoop();  // Spustíme hru znova
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "lime";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, tileSize, tileSize);
    });

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, tileSize, tileSize);
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(food.value, food.x + 5, food.y + 15);
}

function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        setTimeout(gameLoop, 100);
    }
}

gameLoop();
