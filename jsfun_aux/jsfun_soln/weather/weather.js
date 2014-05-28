// Your main function for the weather app.
// Create your interactors and canvas here!
var app = new GraphicsApp();
var textField;

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
    } else if (temp < 20) {
        return Color.green;   
    } else {
        return Color.red;
    }
}

function run() {
    app.addTitle("WeatherBug");
    textField = app.addTextField();
    app.addButton("Show Weather", showWeather);
    app.addButton("Show Local Weather", showLocalWeather);

    app.addCanvas(CANVAS_WIDTH,CANVAS_HEIGHT);
}

function showWeather() {
    clearCanvas();
    var query = textField.value;
    displayStatusMessage("Loading weather...");
    app.fetchWeatherForQuery(query, 7, success, error);
}

function showLocalWeather() {
    clearCanvas();
    displayStatusMessage("Loading local weather...");
    app.getCurrentLocation(recieveCoords);
}

function recieveCoords(lat, long) {
    app.fetchWeatherForCoordinates(lat,long,7,success,error);   
}

function error() {
    displayStatusMessage("Something bad happened");   
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

function displayStatusMessage(message) {
    var status = new GLabel(message);
    status.position.x = STATUS_MESSAGE_X;
    status.position.y = STATUS_MESSAGE_Y;
    add(status);
}

function success(data) {
    clearCanvas();
    displayStatusMessage("Weather loaded.");
    for (var i=0; i<data.length; ++i) {
        var image = new GImage(getImageForCondition(data[i].weatherDescription));
        image.position.x = IMAGE_GAP+(IMAGE_GAP+IMAGE_WIDTH)*i;
        image.position.y = IMAGE_Y;
        image.scale = new PIXI.Point(.5,.5);
        add(image);
    
        var temp = Math.round(data[i].tempHigh);
        var countingText = new GLabel(temp);
        countingText.position.x = IMAGE_GAP + (IMAGE_GAP+IMAGE_WIDTH)*i + .5*IMAGE_WIDTH - countingText._width;
        countingText.position.y = TEXT_Y;
        countingText.setColor(getColor(temp));
        countingText.setFont('80px Verdana');
        add(countingText);
    }    
}