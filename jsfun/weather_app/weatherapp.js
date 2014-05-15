/***** AVAILABLE JAVASCRIPT FUNCTIONS ******/


/* Function: WeatherApp()
 * --------------------------------
 * Creates a new WeatherApp object and returns it.
 *
 * Parameters: none
 */
function WeatherApp() {}




/* Function: addButton(buttonName)
 * -----------------------------------------------
 * Creates and adds a new button to the top area of the webpage.  The button
 * will display the text buttonName.
 *
 * Parameters:
 * -----------
 *	buttonName: the text that is displayed on the button.
 */
WeatherApp.prototype.addButton = function(buttonName) {
	var inputDiv = document.getElementById("inputDiv");
	var button = document.createElement("BUTTON");
	button.textContent = buttonName;

	var obj = this;

	// If the button is the query button, wire it to trigger loadWeather()
	if (buttonName.toUpperCase().indexOf("LOCAL") == -1) {
		button.onclick = function() {
			obj.loadWeather('inputField');
		};
	} else {
		button.onclick = function() {
			obj.loadGeoWeather();
		};
	}

	inputDiv.appendChild(button);
}



/* Function: addTextField()
 * -----------------------------
 * Creates and adds a new text field to the top area of the webpage.
 *
 * Parameters: none
 */
WeatherApp.prototype.addTextField = function() {

	// Make a new text field
	var textField = document.createElement("INPUT");
	textField.type = "text";
	textField.id = "inputField";

	// Append it inside our input div
	var inputDiv = document.getElementById("inputDiv");
	inputDiv.appendChild(textField);
}



/* Function: addCanvas()
 * --------------------------
 * Creates and adds a new canvas to the center area of the webpage.
 *
 * Parameters: none
 */
/*
WeatherApp.prototype.addCanvas = function() {

	// Make a new canvas
	var canvas = document.createElement("CANVAS");
	canvas.id = "weatherCanvas";
	canvas.width = "1000";
	canvas.height = "500";

	// Append it inside our canvas div
	var canvasDiv = document.getElementById("canvasDiv");
	canvasDiv.appendChild(canvas);
}
*/
WeatherApp.prototype.addCanvas = function() {
    return setBackground(1000,500,0xFFFFFF);
}





/* Function: addTitle(title)
 * --------------------------------
 * Adds a title with the given text at the top of the page.
 *
 * Parameters:
 * -----------
 *	title: the text of the title to add.
 */
WeatherApp.prototype.addTitle = function(title) {
	
	// Set the page title to be equal to the passed in text
 	var titleElem = document.createElement("TITLE");
 	titleElem.textContent = title;

 	var head = document.getElementsByTagName("HEAD")[0];
 	head.appendChild(titleElem);

 	// Also create and add an H1 element at the top displaying the passed in text
 	var h1 = document.createElement("H1");
 	h1.textContent = title;

 	var inputDiv = document.getElementById("inputDiv");
 	var body = document.getElementsByTagName("BODY")[0];
 	body.insertBefore(h1, inputDiv);
}





/* Function: displayErrorMessage(error)
 * --------------------------------
 * Displays an error message to the user in red below the text box.
 *
 * Parameters:
 * -----------
 *	error: the error message to display.
 */
WeatherApp.prototype.displayErrorMessage = function(error) {
	var errorField = document.getElementById("errorField");
	errorField.innerHTML = error;
}




/* Function: fetchWeatherForQuery(query, numDays, successFn, errorFn)
 * -------------------------------------------------------------
 * Sends a request to the weather API, passing in the given query.
 *
 * Parameters:
 * -----------
 *	query: a string query of the place the weather should be fetched for.
 *
 *	numDays: the number of days for which you want to get the weather.
 *
 *	successFn: a function that takes a single parameter, the data returned from the API call.
 *	This function will be called upon success of the API call.
 *
 *	errorFn: a function that takes no parameters.  This function will be called upon failure of the API call.
 */
WeatherApp.prototype.fetchWeatherForQuery = function(query, numDays, successFn, errorFn) {
	var url = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + encodeURIComponent(query) + 
		"&mode=json&cnt=" + encodeURIComponent(numDays) + "&units=metric";
	this.sendWeatherRequestWithURL(url, successFn, errorFn);
}




/* Function: fetchWeatherForCoordinates(latitude, longitude, numDays, successFn, errorFn)
 * ----------------------------------------------------------------------------------
 * Sends a request to the weather API, passing in the given coordinates.
 *
 * Parameters:
 * -----------
 *	latitude: the latitude to fetch the weather for.
 *
 *	longitude: the longitude to fetch the weather for.
 *
 *	numDays: the number of days for which you want to get the weather.
 *
 *	successFn: a function that takes a single parameter, the data returned from the API call.
 *	This function will be called upon success of the API call.
 *
 *	errorFn: a function that takes no parameters.  This function will be called upon failure of the API call.
 */
WeatherApp.prototype.fetchWeatherForCoordinates = function(latitude, longitude, numDays, successFn, errorFn) {
	var url = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + 
		encodeURIComponent(latitude) + "&lon=" + encodeURIComponent(longitude) + "&mode=json&cnt=" + encodeURIComponent(numDays) + "&units=metric";
	this.sendWeatherRequestWithURL(url, successFn, errorFn);
}

/*******************************************************/