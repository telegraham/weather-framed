var apiKey = 'hhhhh';
var lat = 40;
var lon = -73;

var debug = true;

var conditionsApiUrl = "test/conditions.json"
var forecastApiUrl = "test/forecast.json"

// var conditionsApiUrl = 'https://weather.googleapis.com/v1/currentConditions:lookup + 
//           '?location.latitude=' + lat + 
//           '&location.longitude=' + lon + 
//           '&key=' + apiKey;
// var forecastApiUrl = 'https://weather.googleapis.com/v1/forecast/hours:lookup' + 
//           '?location.latitude=' + lat + 
//           '&location.longitude=' + lon + 
//           '&key=' + apiKey;


function fethc(url, callback) {
	// 1. Create a new XMLHttpRequest object
	var xhr = new XMLHttpRequest();

	// 2. Configure it: GET-request for the URL /data.json
	xhr.open('GET', url, true);

	// 3. Set the responseType to 'json' if supported, 
	// or handle it manually for maximum compatibility
	xhr.onreadystatechange = function () {
	    // readyState 4 means the request is done
	    if (xhr.readyState === 4) {
	        // Status 200 means "OK"
	        if (xhr.status === 200) {
	            try {
	                // Parse the JSON string into a Javascript Object
	                var data = JSON.parse(xhr.responseText);
	                callback(data)
	            } catch (e) {
	                console.error("Error parsing JSON:", e);
	            }
	        } else {
	            console.error("Error fetching data. Status:", xhr.status);
	        }
	    }
	};

	// 4. Send the request
	xhr.send();
}



document.addEventListener("DOMContentLoaded", function(event) { 
	
	fethc(conditionsApiUrl, function(conditionsData){
		if (debug) console.log(conditionsData);

		var conditionsParser = new ConditionsParser(conditionsData);
		var conditionsDataParsed = conditionsParser.parse();
		var conditionsRenderer = new ConditionsRenderer({
			data: conditionsDataParsed
		});
		conditionsRenderer.render();

		// var description = document.getElementById('description');
		// var icon = document.getElementById('icon');
		// var body = document.getElementById('body');

		// if (conditionsData.isDaytime) {
		//     body.className = "day"
		//     icon.src = conditionsData.weatherCondition.iconBaseUri + ".svg"
		// } else {
		//     body.className = "night"
		//     icon.src = conditionsData.weatherCondition.iconBaseUri + "_dark.svg"
		// }
		// description.innerText = conditionsData.weatherCondition.description.text;
	})

	fethc(forecastApiUrl, function(forecastData){
		if (debug) console.log(forecastData);

		var forecastParser = new ForecastParser(forecastData);
		var forecastDataParsed = forecastParser.parse();
		var forecastRenderer = new ForecastRenderer({
			data: forecastDataParsed,
			tempsElement: document.getElementById("temps"),
			hoursElement: document.getElementById("hours"),
			precipsElement: document.getElementById("precips"),
		});
		forecastRenderer.render();
	})

})