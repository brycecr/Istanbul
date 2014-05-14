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
    var rect = new GCircle(50,50,50);
    add(rect);
}



// Should process the user's query and make a request to the appropriate weather API to fetch
// the weather for the given location.
function showWeather(query) {
    var weather = app.fetchWeatherForQuery(query, 7, success, error);
    console.log(weather);
}



// Should process the user's current location and make a call to the appropriate weather API
// to fetch the weather for the user's current location.
function showLocalWeather(latitude, longitude) {
    var weather = app.fetchWeatherForCoordinates(latitude, longitude, 7, success, error);
    console.log(weather);
}

/********************************************************/