var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var boardHeight = 640;
var boardWidth = 640;
var blockHeight = 40;
var blockWidth = 40;
var boardHeightBlocks = boardHeight/blockHeight;
var boardWidthBlocks = boardWidth/blockWidth;
var board = new Array(boardHeightBlocks);
var EMPTY = 0;
var STICK = 1;
var TRIANGLE = 2;
var BOX = 3;
var LSHAPE = 4;
var REVLSHAPE = 5;
var SSHAPE = 6;
var REVSSHAPE = 7;
var LOCKED = 8;
var RUNNING  = 100;
var PAUSED = 101;
var GAMEOVER = 102;
var gameState = RUNNING;
var initialYPosition = 0;
var initialXPosition = 3;
var currentBlockY = initialYPosition;
var currentBlockX = initialXPosition;
var currentBlock;
var dimension;
var stickShape = [0, 0, 0, 0,
                  1, 1, 1, 1,
                  0, 0, 0, 0,
                  0, 0, 0, 0];

var triangleShape = [0, 1, 0,
                     1, 1, 1,
                     0, 0, 0];

var boxShape = [1, 1,
                1, 1];

var lshapeShape = [1, 0, 0,
                   1, 1, 1];
var revlshapeShape = [0, 0, 1,
                      1, 1, 1];

var sshapeShape = [0, 1, 1,
                   1, 1, 0];

var revsshapeShape = [1, 1, 0,
                      0, 1, 1];

var shapes = [stickShape, triangleShape, boxShape, lshapeShape, revlshapeShape, sshapeShape, revsshapeShape];

function markBoard(){
    for (var i = 0; i < dimension; i++) {
        var currentY = i + currentBlockY;
        for (var j = 0; j < dimension; j++) {
            var currentX = j + currentBlockX;
            if (currentBlock[i][j] > 0) {
                board[currentY][currentX] = currentBlock[i][j];
            }
        }
    }
}

function newBlock(){
    var rand = Math.floor(Math.random() * 7);
    var currentShape = shapes[rand];
    if(rand == 2){
        dimension = 2;
    }else if(rand == 0){
        dimension = 4;
    }else{
        dimension = 3;
    }
    currentBlock = new Array(dimension);
    for(var i = 0; i < dimension; i++){
        currentBlock[i] = new Array(dimension);
        for(var j = 0; j < dimension; j++){
            var x = dimension * i  + j;
            if(typeof currentShape[x] != 'undefined' && currentShape[x]){
                currentBlock[i][j] = rand+1;
            }else{
                currentBlock[i][j] = 0;
            }
        }
    }
    currentBlockY = initialYPosition;
    if(dimension != 4)
        currentBlockX = initialXPosition;
    else
        currentBlockX = initialXPosition - 1;

    for (var i = 0; i < dimension; i++) {
        var currentY = i + currentBlockY;
        for (var j = 0; j < dimension; j++) {
            var currentX = j + currentBlockX;
            if (board[currentY][currentX] > 0 && currentBlock[i][j] > 0){
                gameState = GAMEOVER;
            }
        }
    }

    if(gameState == RUNNING){
        markBoard();
    }
}

function render(){
    /*var collides = false;

    for (var i = 0; i < dimension; i++) {
        var currentY = i + currentBlockY;
        for (var j = 0; j < dimension; j++) {           
            var currentX = j + currentBlockX;
            if(board[currentY][currentX] > 0 && currentBlock[i][j] > 0)
                return true;
        }
    }

    if(!collides){*/
        for (var i = 0; i < dimension; i++) {
            var currentY = i + currentBlockY;
            for (var j = 0; j < dimension; j++) {
                var currentX = j + currentBlockX;
                if (currentBlock[i][j] > 0)
                    ctx.fillRect(currentX * blockWidth, currentY * blockHeight, blockWidth, blockHeight);
            }
        }
    //}
}

function initialize(){
    for (var i = 0; i < board.length; i++) {
        board[i] = new Array(boardWidthBlocks);
    }
    for (var i = 0; i < boardHeightBlocks; i++) {
        for (var j = 0; j < boardWidthBlocks; j++) {
            board[i][j] = EMPTY;
        }
    }
}

function moveDown(){
    var reachedBottom = false;
    for(var i = 0; i < dimension; i++){
        var currentY = i + currentBlockY;
        for(var j = 0; j < dimension; j++){
            var currentX = j + currentBlockX;
            if(currentBlock[i][j] > 0){
                if(currentY == boardHeightBlocks-1){
                    reachedBottom = true;
                }else if(board[currentY+1][currentX] == LOCKED){
                    reachedBottom = true;
                }
            }
        }
    }
    if(!reachedBottom){
        for (var i = 0; i < dimension; i++) {
            var currentY = i + currentBlockY;
            for (var j = 0; j < dimension; j++) {
                var currentX = j + currentBlockX;
                if (currentBlock[i][j] > 0) {
                    board[currentY][currentX] = EMPTY;
                    ctx.clearRect(currentX * blockWidth, currentY * blockHeight, blockWidth, blockHeight);
                }
            }
        }
        currentBlockY += 1;        
        markBoard();
        render();
    }else{
        for (var i = 0; i < dimension; i++) {
            var currentY = i + currentBlockY;
            for (var j = 0; j < dimension; j++) {
                var currentX = j + currentBlockX;
                if (currentBlock[i][j] > 0) {
                    board[currentY][currentX] = LOCKED;
                }
            }
        }
        newBlock();
    }
}

function moveLeft(){
    var reachedLeftMost = false;
    for (var i = 0; i < dimension; i++) {
        var currentY = i + currentBlockY;
        for (var j = 0; j < dimension; j++) {
            var currentX = j + currentBlockX;
            if (currentBlock[i][j] > 0) {
                if (currentX == 0) {
                    reachedLeftMost = true;
                } else if (board[currentY][currentX - 1] == LOCKED) {
                    reachedLeftMost = true;
                }
            }
        }
    }
    if (!reachedLeftMost) {
        for (var i = 0; i < dimension; i++) {
            var currentY = i + currentBlockY;
            for (var j = 0; j < dimension; j++) {
                var currentX = j + currentBlockX;
                if (currentBlock[i][j] > 0) {
                    board[currentY][currentX] = EMPTY;
                    ctx.clearRect(currentX * blockWidth, currentY * blockHeight, blockWidth, blockHeight);
                }
            }
        }
        currentBlockX -= 1;
        markBoard();
        render();
    } else {
        
    }
}

function moveRight(){
    var reachedRightMost = false;
    for (var i = 0; i < dimension; i++) {
        var currentY = i + currentBlockY;
        for (var j = 0; j < dimension; j++) {
            var currentX = j + currentBlockX;
            if (currentBlock[i][j] > 0) {
                if (currentX == boardWidthBlocks-1) {
                    reachedRightMost = true;
                } else if (board[currentY][currentX + 1] == LOCKED) {
                    reachedRightMost = true;
                }
            }
        }
    }
    if (!reachedRightMost) {
        for (var i = 0; i < dimension; i++) {
            var currentY = i + currentBlockY;
            for (var j = 0; j < dimension; j++) {
                var currentX = j + currentBlockX;
                if (currentBlock[i][j] > 0) {
                    board[currentY][currentX] = EMPTY;
                    ctx.clearRect(currentX * blockWidth, currentY * blockHeight, blockWidth, blockHeight);
                }
            }
        }
        currentBlockX += 1;
        markBoard();
        render();
    } else {

    }
}

function rotate(){
    var collided = false;
    var newCurrentBlock = [];

    if(dimension == 2)
        return;
    else{
        level = dimension - 2;
        last = dimension - 1;
        newCurrentBlock = new Array(dimension);
        for(var i = 0; i < dimension; i++){
            newCurrentBlock[i] = new Array(dimension);
        }
        for(var i = 0; i < dimension; i++){
            for(var j = 0; j < dimension; j++){
                newCurrentBlock[i][j] = currentBlock[i][j];
            }
        }

        for(var i = 0; i < level; i++){
            for (var j = i; j < last; j++) {
                var temp;
                temp = newCurrentBlock[i][j];
                newCurrentBlock[i][j] = newCurrentBlock[j][last];
                newCurrentBlock[j][last] = temp;

                temp = newCurrentBlock[i][j];
                newCurrentBlock[i][j] = newCurrentBlock[last][last - j + i];
                newCurrentBlock[last][last - j + i] = temp;

                temp = newCurrentBlock[i][j];
                newCurrentBlock[i][j] = newCurrentBlock[last - j + i][i];
                newCurrentBlock[last - j + i][i] = temp;
            }
            --last;
        }

        for (var i = 0; i < dimension; i++) {
            var currentY = i + currentBlockY;
            for (var j = 0; j < dimension; j++) {
                var currentX = j + currentBlockX;
                if (board[currentY][currentX] == LOCKED && newCurrentBlock[i][j] > 0) {
                    collided = true;
                }
            }
        }

        if(!collided){
            for (var i = 0; i < dimension; i++) {
                var currentY = i + currentBlockY;
                for (var j = 0; j < dimension; j++) {
                    var currentX = j + currentBlockX;
                    if (currentBlock[i][j] > 0) {
                        board[currentY][currentX] = EMPTY;
                        ctx.clearRect(currentX * blockWidth, currentY * blockHeight, blockWidth, blockHeight);
                    }
                }
            }
            currentBlock = [];
            currentBlock = newCurrentBlock;
            markBoard();
            render();
        }else{

        }
    }
}

$("#body").keyup(function (e) {
    if (e.which !== 0) {
        if (e.key == "D" || e.key == "d") {
           moveRight();
        } else if (e.key == "A" || e.key == "a") {
            moveLeft();
        } else if (e.key == "S" || e.key == "s"){
            moveDown();
        } else if(e.key == "W" || e.key == "w"){
            rotate();
        }
    }
}
);

function tick(){
    if(gameState == RUNNING){
        moveDown();
        popLine();
    }
}

function popLine(){
    var limits = [];
    var pop = true;
    for(var i = 0; i < boardHeightBlocks; i++){
        pop = true;
        for(var j = 0; j< boardWidthBlocks; j++){
            if(board[i][j] != LOCKED){
                pop = false;
                break;
            }
        }
        if(pop){
            limits.push(i);
            for(var j = 0; j < boardWidthBlocks; j++){
                ctx.clearRect(j * blockWidth, i * blockHeight, blockWidth, blockHeight);
                board[i][j] = EMPTY;
            }
        }
    }

    while(limits.length != 0){        
        var limit = limits[limits.length - 1]; 
        for(var i = limit; i > 0; i--){
            for(var j = 0; j < boardWidthBlocks; j++){
                if(board[i-1][j] > 0){
                    ctx.fillRect(j * blockWidth, i * blockHeight, blockWidth, blockHeight);
                }else{
                    ctx.clearRect(j * blockWidth, i * blockHeight, blockWidth, blockHeight);
                }
                board[i][j] = board[i-1][j];
                console.log(board[i][j]);
            }
        }
        limits.pop();
    }

}

//---------------------Code Here------------------------
initialize();
newBlock();
render();
gameLoop = setInterval(tick, 500);

