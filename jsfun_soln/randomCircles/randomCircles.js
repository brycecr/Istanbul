var app = new GraphicsApp();

var HEIGHT = 400;
var WIDTH = 400;

function run() {
    app.addButton("Make Circle!", randomCircle);
    app.addButton("Clear Canvas", clearCircles);
    app.addCanvas(WIDTH, HEIGHT);
}

function clearCircles() {
    clearCanvas();
}

function randomCircle() {
    var randx = Math.random()*WIDTH;
    var randy = Math.random()*HEIGHT;
    var randwidth = Math.random() * 100 + 50;
    var randheight = Math.random() * 100 + 50;
    var oval = new GOval(randx, randy, randwidth, randheight);
    oval.setColor(pickRandomProperty(Color));
    add(oval);
}