// Your main function for the weather app.
// Create your interactors and canvas here!
var app = new GraphicsApp();
var textField;



function run() {
    app.addTitle("WeatherBug");
    textField = app.addTextField();
    app.addCanvas(CANVAS_WIDTH,CANVAS_HEIGHT);
}




/******* GRAPHICS *******/



function displayStatusMessage(message) {
    var weatherStatus = new GLabel(message);
    weatherStatus.setPosition(STATUS_MESSAGE_X, STATUS_MESSAGE_Y);
    add(weatherStatus);
}



function success(data) {
    removeAll();
    displayStatusMessage("Weather loaded.");
    drawBackground(data.length);
    var width = CANVAS_WIDTH / data.length;
    for (var i=0; i<data.length; ++i) {
        var image = new GImage(getImageForCondition(data[i].weatherDescription));
        image.setPosition(width*i+width/2-IMAGE_WIDTH/2, IMAGE_Y);
        image.scale = new PIXI.Point(.5,.5);
        add(image);
    
        var temp = Math.round(data[i].tempHigh);
        var countingText = new GLabel(temp);
        countingText.setColor(getColor(temp));
        countingText.setFont('80px Verdana');
        countingText.setPosition(width*i+width/2-countingText.width/2, TEXT_Y);
        add(countingText);
    }    
}





/**** NO NEED TO READ BEYOND THIS LINE ********/


var IMAGE_Y = 10;
var IMAGE_WIDTH = 128;
var IMAGE_HEIGHT = 128;
var IMAGE_GAP = 20;

var TEXT_Y = IMAGE_Y + IMAGE_HEIGHT + IMAGE_GAP;

var CANVAS_WIDTH = 1100;
var CANVAS_HEIGHT = 400;

var STATUS_MESSAGE_X = 700;
var STATUS_MESSAGE_Y = 360;

function getColor(temp) {
    if (temp < 10) {
        return Color.blue;   
    } else if (temp < 27) {
        return Color.green;   
    } else {
        return Color.red;
    }
}


function getImageForCondition(cond) {
    if (cond === "Clear") {
        return "clear.png"    
    } else if (cond === "Snow") {
        return "snow.png";  
    } else if (cond === "Rain") {
        return "rain.png";
    } else if (cond === "Clouds") {
        return "clouds.png";   
    }
}


function drawBackground(len) {
    var width = CANVAS_WIDTH / len;
    for (var i=0; i < len; ++i) {
        var rect = new GRect(i*width, 0, width, CANVAS_HEIGHT);
        rect.setColor((i%2)?0xDDDDEE: 0xEEEEFF);
        add(rect);
    }
}
