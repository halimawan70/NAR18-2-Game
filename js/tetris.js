var fps = 750;
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var layout = document.getElementsByClassName("wrap-side");
var sisi = Math.ceil($("#midside").width()/11);

var boardHeight = sisi*15;
var boardWidth = sisi*11;



c.width = boardWidth;
c.height = boardHeight;

var blockHeight = sisi;
var blockWidth = sisi;
var blockBorderWidth = 2;
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
var NOT_STARTED = 103;
var ON_PROCESS = 104;
var gameState = NOT_STARTED;
var initialYPosition = 0;
var initialXPosition = 4;
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

function render() {
    
    for (var i = 0; i < dimension; i++) {
        var currentY = i + currentBlockY;
        for (var j = 0; j < dimension; j++) {
            var currentX = j + currentBlockX;
            if (currentBlock[i][j] > 0){
                //fillBorder(currentX * blockWidth, currentY * blockHeight, blockWidth, blockHeight, blockBorderWidth);
                ctx.fillStyle = "#105C8D";
                ctx.fillRect(currentX * blockWidth, currentY * blockHeight, blockWidth, blockHeight);                
            }
        }
    }
    
}

function fillBorder(xPos, yPos, width, height, thickness){
    ctx.fillStyle = "#001A2A";
    ctx.fillRect(xPos - (thickness), yPos - (thickness), width + (thickness * 2), height + (thickness * 2));
}

function reBoard(){
    ctx.beginPath();
    ctx.clearRect(0,0,c.width,c.height);
    ctx.closePath();
}

function initialize(){
    reBoard();
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
    return reachedBottom;
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
                if ((newCurrentBlock[i][j] > 0 ) && (board[currentY][currentX] == LOCKED ||
                currentY > boardHeightBlocks-1 || currentX > boardWidthBlocks-1 || currentX < 0)) {
                    collided = true;
                    break;
                }
            }
            if(collided)
                break;
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
var turun = 0;
$(document).keyup(function (e) {
    if (e.which !== 0) {
         if (e.which == 38) {            
            rotate();
        }
    }
});

function mostBottom(){        
    if(!moveDown())
        setTimeout(mostBottom,5);
}

$(document).keydown(function(e){
    if(e.which !== 0 && gameState == RUNNING)
        if (e.which == 40) 
            moveDown();
        else if (e.which == 39)
            moveRight();
        else if (e.which == 37)
            moveLeft();
        else if(e.which == 32)
            mostBottom();
        
});

function popLine(){
    var limits = [];
    var tempIndx = -1;
    var pop = true;
    for (var i = 0; i < 3; i++){
        if(tempIndx != -1) break;
        for(var j = 0; j< boardWidthBlocks; j++){
            if(board[i][j] == LOCKED){
                tempIndx = i;
                break;
            }
        }
    }
    for (var i = boardHeightBlocks-1; i >= 0; i--){
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
    tempIndx = tempIndx < 0 ? 2 : tempIndx;
    var done = true;
    while(limits.length != 0){        
        var limit = limits[limits.length - 1]; 
        for(var i = limit; i > tempIndx; i--){
            done = true;
            for(var j = 0; j < boardWidthBlocks; j++){
                if(board[i-1][j] == LOCKED){
                    ctx.fillRect(j * blockWidth, i * blockHeight, blockWidth, blockHeight);
                    done = false;
                }else{
                    ctx.clearRect(j * blockWidth, i * blockHeight, blockWidth, blockHeight);
                }
                board[i][j] = board[i-1][j];
                console.log(board[i][j]);
            }
            if(done)
            break;
        }
        limits.pop();

    }
}