var stage = new PIXI.Stage(0xFFFFFF); // make a white stage

var renderer = PIXI.autoDetectRenderer(400, 300);

document.body.appendChild(renderer.view);

//requestAnimFrame(animate);

var graphics = new PIXI.Graphics();
 
// begin a green fill..
graphics.beginFill(0x00FF00);
 
graphics.drawRect(10,10,100,50);

// end the fill
graphics.endFill();

var thing = new PIXI.Graphics();
//thing.beginFill(0xFF0000);
thing.lineStyle(1, 0x000000, 1.0)
thing.drawCircle(100,100,20);

//thing.endFill();
 
// add it the stage so we see it on our screens..
stage.addChild(graphics);
stage.addChild(thing);

/*
var count = 0;
function animate() {
    requestAnimFrame(animate);
     
   // thing.clear();
//    count +=1;
    //thing.beginFill(0xFF0000);
//    thing.drawCircle(100,100,20+count);
    //thing.endFill();
    
    renderer.render(stage);
}
*/