/********* PRIVATE WEATHERAPP METHODS ************/

/* Function: loadWeather(fieldId)
 * ------------------------------
 * Gets the user's entered text from the text field with the given id,
 * and passes the text to showWeather();
 *
 * Parameters:
 * -----------
 * 	fieldId: the ID of the text field from which to get text.
 */
WeatherApp.prototype.loadWeather = function(fieldId) {
	this.displayErrorMessage("");
	var query = document.getElementById(fieldId).value;
	showWeather(query);
}



/* Function: loadGeoWeather(doneFn)
 * -------------------------
 * Gets the user's location (latitude/longitude) and passes it to showLocalWeather().
 * If the user's browser doesn't support geolocation, an error message is displayed.
 *
 * Parameters: none
 */
WeatherApp.prototype.loadGeoWeather = function() {

	this.displayErrorMessage("");

	// Check if the browser supports geolocation
	if (navigator.geolocation) {

		// Query the user's location
		navigator.geolocation.getCurrentPosition(function(position) {
			showLocalWeather(position.coords.latitude, position.coords.longitude);
		});

	} else {
		this.displayErrorMessage("Error: your browser does not support geolocation.");
	}
}


/* Function: sendWeatherRequestWithURL(url, successFn, errorFn)
 * ---------------------------------------------------------
 * Makes an AJAX (Asynchronous Javascript and XML) GET request to the given URL.
 * If the request is unsuccessful, the errorFn callback is called.  If successful,
 * the weather server will return an array of objects, each representing the weather for
 * a day.  This function then adds the name of each day to each day object (eg. "Monday") and
 * passes the array to the successFn callback.
 *
 * Parameters:
 * -----------
 * 	url: the URL to send the request to.
 * 
 * 	successFn: the function to execute if a response is successfully returned.
 * 
 * 	errorFn: the function to execute if the request fails.
 */
WeatherApp.prototype.sendWeatherRequestWithURL = function(url, successFn, errorFn) {
	
	// The handler for the AJAX requests that call the student's callbacks
	var obj = this;

	function xhrHandler() {
		if (this.readyState != 4) return;
		else if (this.status != 200 && errorFn) errorFn();
		else {
			var data = JSON.parse(this.responseText);

			var daysArray = data["list"];

			// If there is no data, call the error handler
			if (daysArray == null) {
				if (errorFn) errorFn();
				return;
			} else if (!successFn) return;

			var cleanedDaysArray = [];

			// Get the array of day names this weather data corresponds to
			var dayNames = obj.dayNamesStartingToday(daysArray.length);

			// Pull out only the relevant weather data and store an object for each
			// day inside of cleanedDaysArray
			for (var i = 0; i < daysArray.length; i++) {

				// Create a new day object with the relevant data inside
				var day = {};
				day["dayName"] = dayNames[i];
				day["tempHigh"] = daysArray[i]["temp"]["max"];
				day["tempLow"] = daysArray[i]["temp"]["min"];
				day["weatherDescription"] = daysArray[i]["weather"][0]["main"]; // Rain Clouds Clear Snow
				day["humidity"] = daysArray[i]["humidity"];
				day["windSpeed"] = daysArray[i]["speed"];

				// Add it to our days array
				cleanedDaysArray.push(day);
			}			

			successFn(cleanedDaysArray);
		}
	}

	// Create and send the request
	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = xhrHandler;
	xhr.open("GET", url);
	xhr.send();	
}



/* Function: dayNamesStartingToday(numDays)
 * -------------------------------------
 * Returns an array of length "numDays" containing consecutive
 * weekday names starting with today.  For example, if today is
 * Tuesday, and numDays = 4, then dayNamesStartingToday would return
 * ["Tuesday", "Wednesday", "Thursday", "Friday"].
 *
 * Parameters:
 * -----------
 * 	numDays: the number day names to include in the array
 */
WeatherApp.prototype.dayNamesStartingToday = function(numDays) {

	// Get the index of today
	var currDate = new Date();
	var todayIndex = currDate.getDay();

	var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	
	// Loop around the day names array starting today and add each day name
	var daysArray = [];
	for (var i = 0; i < numDays; i++) {

		// Loop around the day names array (if we get over 6, loop back around)
		var index = (todayIndex + i) % 7;
		daysArray.push(dayNames[index]);
	}

	return daysArray;
}

/****************************************/