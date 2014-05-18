/********* FUNCTIONS YOU NEED TO IMPLEMENT *************/


// Global variable: your WeatherApp object
var app = new WeatherApp();
// Your main function for the weather app.  You should create a new WeeatherApp object
// add all buttons and controls to the screen in this function.
function run() {
	app.addButton("Show Weather");
    app.addButton("Local Weather");
    app.addTextField();
    app.addCanvas();
}

function getImageForCondition(condition) {
    if (condition === "Clear") {
        return "sunny.png";
    } else if (condition === "Rain") { 
        return "rain.png"
    } else if (condition === "Clouds") {
        return "partly_cloudy.png";   
    } else if (condition === "Snow") {
        return "snow.png";   
    }
}


var IMAGE_Y = 10;
var IMAGE_WIDTH = 48;
var IMAGE_HEIGHT = 48;
var IMAGE_GAP = 10;

var TEXT_Y = IMAGE_Y + IMAGE_HEIGHT + IMAGE_GAP;

function getColor(temp) {
    if (temp < 7) {
        return '#0000FF';   
    } else if (temp < 25) {
        return '#00FF00';   
    } else {
        return '#FF0000';
    }
}

function success(data) {
    clearCanvas();
    console.log(data);
    for (var i=0; i<data.length; ++i) {
    var sprite = new GImage(getImageForCondition(data[i].weatherDescription));
    sprite.position.y = IMAGE_Y;
    sprite.position.x = IMAGE_GAP + (IMAGE_GAP+IMAGE_WIDTH)*i;
    add(sprite);
    
    var temp = Math.round(data[i].tempHigh);
    
    var countingText = new GLabel(temp);
    countingText.position.x = IMAGE_GAP + (IMAGE_GAP+IMAGE_WIDTH)*i;
    countingText.position.y = TEXT_Y;
    countingText.setColor(getColor(temp));
    add(countingText);
}
}

function error() {
    app.displayErrorMessage("Errored out");
}

// Should process the user's query and make a request to the appropriate weather API to fetch
// the weather for the given location.
function showWeather(query) {
    app.fetchWeatherForQuery(query, 7, success, error);
}



// Should process the user's current location and make a call to the appropriate weather API
// to fetch the weather for the user's current location.
function showLocalWeather(latitude, longitude) {
    var weather = app.fetchWeatherForCoordinates(latitude, longitude, 7, success, error);
}

/********************************************************/