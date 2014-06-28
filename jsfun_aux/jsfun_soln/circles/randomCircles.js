var app = new GraphicsApp();

var HEIGHT = 500;
var WIDTH = 1200;
var MAX_RADIUS = 100;

function run() {
    app.addButton("Make Circle!", randomCircle);
    app.addButton("Clear Canvas", clearCircles);
    app.addCanvas(WIDTH, HEIGHT);
}

function clearCircles() {
    removeAll();
}

function randomCircle() {
    var randSize = Math.random() * 2 * MAX_RADIUS;
    var randx = Math.random()*Math.abs(WIDTH-randSize)+randSize/2;
    var randy = Math.random()*Math.abs(HEIGHT-randSize)+randSize/2;
    var oval = new GOval(randx, randy, randSize, randSize);
    oval.setColor(Color.red);
    add(oval);
}