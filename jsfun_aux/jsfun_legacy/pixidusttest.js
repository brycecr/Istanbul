
var stage = setBackground(400,400,0x000000);

var thing = new GRect(50,50,50,50);
stage.add(thing);

function drawFrame() {
    
    thing.position.x += 1;
    thing.position.y += 1;

}
