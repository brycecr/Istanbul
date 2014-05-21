var STAGE_WIDTH = 400;
var STAGE_HEIGHT = 600;

var stage = setBackground(STAGE_WIDTH, STAGE_HEIGHT, 0xFFFFFF);

/* local game state */
var TOP_GAP = 20;
var BRICK_GAP = 5;
var BRICKS_ROW = 10;
var NUM_ROWS = 10;

var BRICK_WIDTH = Math.floor((STAGE_WIDTH - BRICK_GAP*(BRICKS_ROW+2))/BRICKS_ROW);
var BRICK_HEIGHT = 10;

var BALL_RADIUS = 10;

var PADDLE_WIDTH = 80;
var PADDLE_HEIGHT = 20;

var numlives = 3;
var bricksLeft = 100;

var colors = [0xFF0000, 0xFFFF00, 0xFF00FF, 0x00FFFF, 0x00FF00];

for (var i=0; i < NUM_ROWS; ++i) {
    for (var j=0; j < BRICKS_ROW; ++j) {
        var rect = new GRect(BRICK_GAP + (i*(BRICK_WIDTH+BRICK_GAP)), 
                             TOP_GAP + BRICK_GAP + (j*(BRICK_HEIGHT+BRICK_GAP)), 
                             BRICK_WIDTH, BRICK_HEIGHT);
        rect.setColor(colors[Math.floor(j/2)]);
        stage.add(rect);
    }
}

var ball = new GCircle(200,400,BALL_RADIUS);
ball.vx = Math.random()*20-10;
ball.vy = 6;
stage.add(ball);

var paddle = new GRect(180,550,PADDLE_WIDTH,PADDLE_HEIGHT);
stage.add(paddle);

function detectWalls() {
    if (ball.position.y > STAGE_HEIGHT) {
        var text = new PIXI.Text("YOU LOSE", {font:"50px Arial", fill:"red"});
        text.position.x = STAGE_WIDTH/2 - text._width/2;
        text.position.y = STAGE_HEIGHT/2;
        stage.addChild(text);
        ball.vx = 0;
        ball.vy = 0;
        return;
    } else if (ball.position.x < 0 || ball.position.x > STAGE_WIDTH) {
        ball.vx = -ball.vx;
    } else if (ball.position.y <= 0) {
        ball.vy = -ball.vy;   
    }
}

function detectCollision() {
    
    detectWalls();
    for (var i=0; i<=BALL_RADIUS; i+=BALL_RADIUS) {
        for (var j=0; j<BALL_RADIUS; j+=BALL_RADIUS) {
            var collider = stage.getElementAt(ball.position.x+i, ball.position.y+j);
            if (collider !== null) {
                console.log(collider);
                ball.vy = -ball.vy;
                if (collider !== paddle) {
                    stage.remove(collider);
                    bricksLeft -= 1;
                }
                return;
            }
        }
    }
}


function drawFrame() {
    ball.position.x += ball.vx;
    ball.position.y += ball.vy;
    
    detectCollision();
    
    var mousex = stage.getMousePosition().x;
    if (mousex > 0 && mousex < STAGE_WIDTH-PADDLE_WIDTH) {
        paddle.position.x = mousex;
    }
    if (bricksLeft === 0) {
        var text = new PIXI.Text("YOU WIN", {font:"50px Arial", fill:"red"});
        text.position.x = STAGE_WIDTH/2 - text._width/2;
        text.position.y = STAGE_HEIGHT/2;
        stage.addChild(text);
        ball.vx = 0;
        ball.vy = 0;
    }
}