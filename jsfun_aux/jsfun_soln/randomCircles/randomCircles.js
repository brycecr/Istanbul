var app = new GraphicsApp();

var HEIGHT = 500;
var WIDTH = 1200;

function run() {
    app.addButton("Make Circle!", randomCircle);
    app.addButton("Clear Canvas", clearCircles);
    app.addCanvas(WIDTH, HEIGHT);
}

function clearCircles() {
    removeAll();
}

function randomCircle() {
    var randwidth = Math.random() * 100 + 50;
    var randheight = Math.random() * 100 + 50;
    var randx = Math.random()*Math.abs(WIDTH-randwidth)+randwidth/2;
    var randy = Math.random()*Math.abs(HEIGHT-randheight)+randheight/2;
    var oval = new GOval(randx, randy, randwidth, randheight);
    oval.setColor(Color.red);
    add(oval);
}