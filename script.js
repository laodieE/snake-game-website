// 游戏变量
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let scoreElement = document.getElementById('score');
let highScoreElement = document.getElementById('highScore');
let startButton = document.getElementById('start-btn');

// 游戏参数
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// 游戏状态
let snake = [];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gameSpeed = 120; // 毫秒

// 初始化游戏
function initGame() {
    snake = [
        {x: 10, y: 10}
    ];
    
    generateFood();
    
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    highScoreElement.textContent = highScore;
    
    gameRunning = true;
}

// 生成食物
function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    // 确保食物不会生成在蛇身上
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            return generateFood();
        }
    }
}

// 绘制游戏
function drawGame() {
    // 清空画布
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制蛇
    ctx.fillStyle = '#2ecc71';
    for (let segment of snake) {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }
    
    // 绘制食物
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// 更新游戏状态
function updateGame() {
    if (!gameRunning) return;
    
    // 计算新蛇头位置
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    
    // 检查游戏结束条件
    if (
        head.x < 0 || 
        head.y < 0 || 
        head.x >= tileCount || 
        head.y >= tileCount ||
        checkCollision(head)
    ) {
        gameOver();
        return;
    }
    
    // 添加新蛇头
    snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
        
        generateFood();
    } else {
        // 没吃到食物，移除蛇尾
        snake.pop();
    }
}

// 检查碰撞
function checkCollision(head) {
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            return true;
        }
    }
    return false;
}

// 游戏结束
function gameOver() {
    gameRunning = false;
    startButton.textContent = '重新开始';
    alert(`游戏结束！你的得分: ${score}`);
}

// 游戏循环
function gameLoop() {
    updateGame();
    drawGame();
}

// 控制蛇的移动
function changeDirection(event) {
    if (!gameRunning) return;
    
    const keyPressed = event.keyCode;
    
    // 左键或A键
    if ((keyPressed === 37 || keyPressed === 65) && dx !== 1) {
        dx = -1;
        dy = 0;
    }
    // 上键或W键
    else if ((keyPressed === 38 || keyPressed === 87) && dy !== 1) {
        dx = 0;
        dy = -1;
    }
    // 右键或D键
    else if ((keyPressed === 39 || keyPressed === 68) && dx !== -1) {
        dx = 1;
        dy = 0;
    }
    // 下键或S键
    else if ((keyPressed === 40 || keyPressed === 83) && dy !== -1) {
        dx = 0;
        dy = 1;
    }
}

// 开始游戏
function startGame() {
    if (gameRunning) return;
    
    initGame();
    startButton.textContent = '游戏中...';
    
    // 设置游戏循环
    if (window.gameInterval) {
        clearInterval(window.gameInterval);
    }
    window.gameInterval = setInterval(gameLoop, gameSpeed);
}

// 事件监听
startButton.addEventListener('click', startGame);
document.addEventListener('keydown', changeDirection);

// 初始化显示
drawGame();
highScoreElement.textContent = highScore;