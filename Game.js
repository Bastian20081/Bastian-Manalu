(() => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    const finalScoreEl = document.getElementById('finalScore');
    const restartBtn = document.getElementById('restartBtn');
    const homePage = document.getElementById('homePage');
    const aboutPage = document.getElementById('aboutPage');
    const gamePage = document.getElementById('gamePage');
    
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
  
    let snake = [
        {x: 8, y: 8},
        {x: 7, y: 8},
        {x: 6, y: 8}
    ];
    let direction = {x: 1, y: 0};
    let nextDirection = direction;
    let food = randomFoodPosition();
    let score = 0;
    let gameOver = false;
  
    function randomFoodPosition() {
        let position;
        do {
            position = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
        } while (snake.some(seg => seg.x === position.x && seg.y === position.y));
        return position;
    }
  
    function drawGrid() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  
    function drawSnake() {
        ctx.fillStyle = '#0ff';
        for (let segment of snake) {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        }
    }
  
    function drawFood() {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }
  
    function update() {
        if (gameOver) return;
        direction = nextDirection;
  
        const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
  
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || snake.some(seg => seg.x === head.x && seg.y === head.y)) {
            gameOver = true;
            finalScoreEl.textContent = score;
            gameOverOverlay.style.display = 'block';
            return;
        }
  
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            food = randomFoodPosition();
        } else {
            snake.pop();
        }
  
        drawGrid();
        drawSnake();
        drawFood();
        scoreEl.textContent = score;
    }
  
    function changeDirection(event) {
        if (gameOver) return;
        const key = event.key.toLowerCase();
        if ((key === 'arrowup' || key === 'w') && direction.y === 0) {
            nextDirection = {x: 0, y: -1};
        } else if ((key === 'arrowdown' || key === 's') && direction.y === 0) {
            nextDirection = {x: 0, y: 1};
        } else if ((key === 'arrowleft' || key === 'a') && direction.x === 0) {
            nextDirection = {x: -1, y: 0};
        } else if ((key === 'arrowright' || key === 'd') && direction.x === 0) {
            nextDirection = {x: 1, y: 0};
        }
    }
  
    function startGameLoop() {
        gameOver = false;
        snake = [
            {x: 8, y: 8},
            {x: 7, y: 8},
            {x: 6, y: 8}
        ];
        direction = {x: 1, y: 0};
        nextDirection = direction;
        score = 0;
        food = randomFoodPosition();
        gameOverOverlay.style.display = 'none';
  
        drawGrid();
        drawSnake();
        drawFood();
  
        const gameLoop = setInterval(() => {
            update();
            if (gameOver) clearInterval(gameLoop);
        }, 100);
    }
  
    restartBtn.addEventListener('click', () => {
        gamePage.style.display = 'block';
        homePage.style.display = 'none';
        aboutPage.style.display = 'none';
        startGameLoop();
    });
  
    document.addEventListener('keydown', changeDirection);
  
    // Expose to global
    window.showHome = function () {
        gamePage.style.display = 'none';
        aboutPage.style.display = 'none';
        homePage.style.display = 'block';
    };
  
    window.showAbout = function () {
        gamePage.style.display = 'none';
        homePage.style.display = 'none';
        aboutPage.style.display = 'block';
    };
  
    window.startGame = function () {
        gamePage.style.display = 'block';
        homePage.style.display = 'none';
        aboutPage.style.display = 'none';
        startGameLoop();
    };
  })();