'use strict'
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const GRID = 16;
let count = 0;

function getRandomInt(min, max) {
    return min + Math.floor(Math.random()*(max-min));
}

function GameManager() {
    this.apple = new Apple();
    this.snake = new Snake();
    this.snake1 = new Snake();

    this.restart = function() {
        this.apple.createNew();
        this.snake.init(["ArrowLeft", "ArrowRight"], ["ArrowUp", "ArrowDown"],);
        this.snake1.init(['a', 'd'], ['w', 's'], 'blue');
    }

    this.restart();
}

function Cell(x,y,parentCells) {
    this.parentCells = parentCells;
    this.x = x;
    this.y = y;

    this.render = function(color="green") {
        context.fillStyle = color;
        context.fillRect(this.x, this.y, GRID - 1, GRID - 1);
    };

    this.collideApple = function() {
        if(this.x == gameManager.apple.x && this.y == gameManager.apple.y) {
            parentCells.maxCells++;
            gameManager.apple.createNew();
        };
    };
}

function Cells (parentSnake) {
    this.maxCells = 4;

    this.update = function(x, y) {
        this.unshift(new Cell(x, y, this));
    
        if(this.length > this.maxCells) {
            this.pop(this.length);
        }

        this.forEach(function (cell) {
            cell.render(parentSnake.color);
            cell.collideApple(this);
        });

        if(this.checkSelfByte()) {
            parentSnake.createNew();
        }
    }

    this.checkSelfByte = function() {
        return this.filter(el=>el.x==this[0].x && el.y==this[0].y).length > 1;
    }
};

Cells.prototype = Array.prototype;

function Snake() {
    this.x;
    this.y;
    this.dy;
    this.dx;
    this.color;
    this.cells = new Cells(this);

    this.moving = function() {
        this.x += this.dx;
        this.y += this.dy;
        this.wallWalking();

        this.cells.update(this.x, this.y);
    }

    this.wallWalking = function() {
        if(this.x >= canvas.width) {
            this.x = 0;
        }
    
        if(this.x < 0) {
            this.x = canvas.width - GRID;
        }
    
        if(this.y >= canvas.height) {
            this.y = 0;
        }
    
        if(this.y < 0) {
            this.y = canvas.height - GRID;
        }
    };

    this.createNew = function() {
        this.x = 160;
        this.y = 160;
        this.dy = GRID;
        this.dx = 0;
        this.cells = new Cells(this);
        this.cells.maxCells = 4;
    }

    this.controll = function (xMoveKeys = ["ArrowLeft", "ArrowRight"], yMoveKeys = ["ArrowUp", "ArrowDown"]) {
        document.addEventListener('keydown', function({key}){
            if(this.dy === 0 && yMoveKeys.includes(key)) {
                const proxyGrid = key == yMoveKeys[0] ? -GRID : GRID;
                this.dy = proxyGrid;
                this.dx = 0;
            }
            
            if(this.dx === 0 && xMoveKeys.includes(key)) {
                const proxyGrid = key == xMoveKeys[0] ? -GRID : GRID;
                this.dx = proxyGrid;
                this.dy = 0;
            }
        
        }.bind(this));
    }

    this.init = function(xMoveKeys, yMoveKeys, color="green") {
        this.color = color;
        this.controll(xMoveKeys, yMoveKeys);
        this.createNew();
    }
};

function Apple() {
    this.x;
    this.y;

    this.render = function() {
        context.fillStyle = "red";
        context.fillRect(this.x, this.y, GRID-1, GRID-1);
    }

    this.createNew = function() {
        this.x = getRandomInt(0, 25) * GRID;;
        this.y = getRandomInt(0, 25) * GRID;
    }

    this.createNew();
};

const gameManager = new GameManager();

// игровой цикл


function Update() {
    requestAnimationFrame(Update);

    if (++count < 4) {
        return;
    }

    count = 0;
    context.clearRect(0,0, canvas.width, canvas.height);

    gameManager.snake.moving();
    gameManager.snake1.moving();

    gameManager.apple.render();

    };



requestAnimationFrame(Update);
