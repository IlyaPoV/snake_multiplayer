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

    this.update = this.update.bind(this);
}
GameManager.prototype = {
    update: function() {
        requestAnimationFrame(this.update);
    
        if (++count < 4) {
            return;
        }
    
        count = 0;
        context.clearRect(0,0, canvas.width, canvas.height);
    
        this.snake.moving();
        this.snake1.moving();
        this.apple.render();
    },
    restart:function() {
        this.apple.createNew();
        this.snake.init(["ArrowLeft", "ArrowRight"], ["ArrowUp", "ArrowDown"],);
        this.snake1.init(['a', 'd'], ['w', 's'], 'blue');
    }
}

function Cell(x,y) {
    this.x = x;
    this.y = y;
}
Cell.prototype = {
    render: function(color) {
        context.fillStyle = color;
        context.fillRect(this.x, this.y, GRID - 1, GRID - 1);
    },
    collideApple: function() {
        if(this.x == gameManager.apple.x && this.y == gameManager.apple.y) {
            return true;
        }
        return false;
    }
}
    
function Cells () {
    this.maxCells = 4;
};
Cells.prototype = Object.create(Array.prototype);
Cells.prototype._checkSelfByte = function() {
    return this.filter(el=>el.x==this[0].x && el.y==this[0].y).length > 1;
}
Cells.prototype.update = function(x, y) {
    this.unshift(new Cell(x, y));

    if(this.length > this.maxCells) {
        this.pop(this.length);
    }
};
Cells.prototype.render = function(color) {
    this.forEach(function (cell) {
        cell.render(color);
    });
}
Cells.prototype.collideApple = function() {
    return this.filter(cell=> cell.collideApple()).length > 0;
}

function Snake() {
    this.x;
    this.y;
    this.dy;
    this.dx;
    this.color;
    this.cells = new Cells(this);
    
    this.createNew = this.createNew.bind(this);
};
Snake.prototype = {
    _wallWalking: function() {
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
    },
    createNew: function() {
        this.x = 160;
        this.y = 160;
        this.dy = GRID;
        this.dx = 0;
        this.cells = new Cells(this);
        this.cells.color = this.color
        this.cells.maxCells = 4;
    },
    init: function(xMoveKeys, yMoveKeys, color="green") {
        this.color = color;
        this.controll(xMoveKeys, yMoveKeys);
        this.createNew();
    },
    controll: function (xMoveKeys, yMoveKeys) {
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
    },
    moving: function() {
        this.x += this.dx;
        this.y += this.dy;
        this._wallWalking();

        this.cells.update(this.x, this.y);
        this.cells.render(this.color);
        if(this.cells.collideApple()) {
            this.cells.maxCells++;
            gameManager.apple.createNew();
        }

        if(this.cells._checkSelfByte()) {
            this.createNew();
        }
    }
};

function Apple() {
    this.x;
    this.y;
};

Apple.prototype = {
    render: function() {
        context.fillStyle = "red";
        context.fillRect(this.x, this.y, GRID-1, GRID-1);
    },

    createNew: function() {
        this.x = getRandomInt(0, 25) * GRID;;
        this.y = getRandomInt(0, 25) * GRID;
    }
}

const gameManager = new GameManager();

gameManager.restart();
gameManager.update();
// requestAnimationFrame(Update);