var app = new GraphicsApp();

var HEIGHT = 500;
var WIDTH = 1200;
var MAX_RADIUS = 75;

function run() {
	app.addButton("Make Circle!", makeCircle);
	app.addButton("Clear Canvas", clearCanvas);
	app.addCanvas(WIDTH, HEIGHT);
}


function makeCircle() {
	var size = Math.random() * 2 * MAX_RADIUS + 50;
	var x = Math.random() * (WIDTH - size);
	var y = Math.random() * (HEIGHT - size);
	var oval = new GOval(x, y, size, size);
	oval.setColor(Color.red);
	add(oval);
}


function clearCanvas() {
	removeAll();
}