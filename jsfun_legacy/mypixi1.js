//create a new instance of a pixi stage
var stage = new PIXI.Stage(0xFFFFFF);

// create a renderer instance
var renderer = PIXI.autoDetectRenderer(400, 300);

document.body.appendChild(renderer.view);
var vx = 0;
var vy = 0;
document.addEventListener('keydown', function(event) {
    if (event.keyCode == 37) {
       vx = 5;
    }
    else if (event.keyCode == 38) {
        vy = -5;
    }
    else if (event.keyCode == 39) {
        vx = -5;
    }
    else if (event.keyCode == 40) {
        vy = 5;
    }
});

document.addEventListener('keyup', function(event) {
    vx = 0;
    vy = 0;
});

requestAnimFrame(animate);

var texture = PIXI.Texture.fromImage('data/bunny.png');
var bunny = new PIXI.Sprite(texture);

bunny.anchor.x = 0.5;
bunny.anchor.y = 0.5;

bunny.position.x = 200;
bunny.position.y = 150;


stage.addChild(bunny);

function animate() {
    requestAnimFrame(animate);
    
    bunny.position.x += vx;
    bunny.position.y += vy;
    renderer.render(stage);
}