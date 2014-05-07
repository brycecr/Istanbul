var stage = new PIXI.Stage(0xFFFFFF); // make a white stage

var renderer = PIXI.autoDetectRenderer(400, 300);

document.body.appendChild(renderer.view);

requestAnimFrame(animate);

var thing = new GRect(50,50,50,50);
stage.add(thing);

function animate() {
    requestAnimFrame(animate);
    
    thing.position.x += 1;
    thing.position.y += 1;

    renderer.render(stage);
}
