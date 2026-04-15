var apiKey = 'hhhhh';
var lat = 40;
var lon = -73;

var debug = true;

var conditionsApiUrl = "test/conditions.json"
var forecastApiUrl = "test/forecast.json"
var dailyApiUrl = "test/daily.json"

// var conditionsApiUrl = 'https://weather.googleapis.com/v1/currentConditions:lookup +
//           '?location.latitude=' + lat +
//           '&location.longitude=' + lon +
//           '&unitsSystem=IMPERIAL' +
//           '&key=' + apiKey;
// var forecastApiUrl = 'https://weather.googleapis.com/v1/forecast/hours:lookup' +
//           '?location.latitude=' + lat +
//           '&location.longitude=' + lon +
//           '&unitsSystem=IMPERIAL' +
//           '&key=' + apiKey;
// var dailyApiUrl = 'https://weather.googleapis.com/v1/forecast/days:lookup' +
//           '?location.latitude=' + lat +
//           '&location.longitude=' + lon +
//           '&days=2' +
//           '&unitsSystem=IMPERIAL' +
//           '&key=' + apiKey;

var storageKeys = {
	apiKey: 'weatherFramedApiKey',
	lat: 'weatherFramedLat',
	lon: 'weatherFramedLon',
	savedAt: 'weatherFramedSavedAt'
};

var hasLoadedWeather = false;

function trimString(value) {
	return String(value || '').replace(/^\s+|\s+$/g, '');
}

function decodeQueryValue(value) {
	return decodeURIComponent(String(value || '').replace(/\+/g, ' '));
}

function getStoredValue(key) {
	try {
		return localStorage.getItem(key);
	} catch (error) {
		return null;
	}
}

function setStoredValue(key, value) {
	try {
		localStorage.setItem(key, value);
	} catch (error) {
	}
}

function clearStoredValues() {
	try {
		localStorage.clear();
	} catch (error) {
	}
}

function getQueryValue(name) {
	var query = window.location.search;
	var pairs;
	var i;
	var parts;

	if (!query || query.length < 2) {
		return null;
	}

	pairs = query.substring(1).split('&');

	for (i = 0; i < pairs.length; i++) {
		parts = pairs[i].split('=');

		if (decodeQueryValue(parts[0]) === name) {
			return decodeQueryValue(parts.slice(1).join('='));
		}
	}

	return null;
}

function hasStoredConfig() {
	return !!(getStoredValue(storageKeys.apiKey) &&
		getStoredValue(storageKeys.lat) &&
		getStoredValue(storageKeys.lon));
}

function getStoredConfig() {
	if (!hasStoredConfig()) {
		return null;
	}

	return {
		apiKey: getStoredValue(storageKeys.apiKey),
		lat: getStoredValue(storageKeys.lat),
		lon: getStoredValue(storageKeys.lon)
	};
}

function saveStoredConfig(config) {
	setStoredValue(storageKeys.apiKey, config.apiKey);
	setStoredValue(storageKeys.lat, config.lat);
	setStoredValue(storageKeys.lon, config.lon);
	setStoredValue(storageKeys.savedAt, String((new Date()).getTime()));
}

function getStoredConfigAgeText() {
	var savedAt = parseInt(getStoredValue(storageKeys.savedAt), 10);
	var elapsedMs;
	var minuteMs = 60 * 1000;
	var hourMs = 60 * minuteMs;
	var dayMs = 24 * hourMs;

	if (!hasStoredConfig()) {
		return 'No saved local storage config found.';
	}

	if (!savedAt) {
		return 'Saved config found, but no timestamp is available.';
	}

	elapsedMs = (new Date()).getTime() - savedAt;

	if (elapsedMs < minuteMs) {
		return 'Saved less than a minute ago.';
	}

	if (elapsedMs < hourMs) {
		return 'Saved ' + Math.floor(elapsedMs / minuteMs) + ' minute(s) ago.';
	}

	if (elapsedMs < dayMs) {
		return 'Saved ' + Math.floor(elapsedMs / hourMs) + ' hour(s) ago.';
	}

	return 'Saved ' + Math.floor(elapsedMs / dayMs) + ' day(s) ago.';
}

function getQueryConfig() {
	var longValue = getQueryValue('long');
	var lonValue = getQueryValue('lon');

	return {
		apiKey: getQueryValue('apiKey') || getQueryValue('key') || '',
		lat: getQueryValue('lat') || '',
		lon: lonValue || longValue || ''
	};
}

function normalizeConfig(rawConfig) {
	return {
		apiKey: trimString(rawConfig.apiKey),
		lat: trimString(rawConfig.lat),
		lon: trimString(rawConfig.lon)
	};
}

function isValidCoordinate(value) {
	return value !== '' && !isNaN(parseFloat(value));
}

function configureApiUrls(config) {
	apiKey = config.apiKey;
	lat = config.lat;
	lon = config.lon;

	conditionsApiUrl = 'https://weather.googleapis.com/v1/currentConditions:lookup' +
	          '?location.latitude=' + encodeURIComponent(lat) +
	          '&location.longitude=' + encodeURIComponent(lon) +
	          '&unitsSystem=IMPERIAL' +
	          '&key=' + encodeURIComponent(apiKey);
	forecastApiUrl = 'https://weather.googleapis.com/v1/forecast/hours:lookup' +
	          '?location.latitude=' + encodeURIComponent(lat) +
	          '&location.longitude=' + encodeURIComponent(lon) +
	          '&unitsSystem=IMPERIAL' +
	          '&key=' + encodeURIComponent(apiKey);
	dailyApiUrl = 'https://weather.googleapis.com/v1/forecast/days:lookup' +
	          '?location.latitude=' + encodeURIComponent(lat) +
	          '&location.longitude=' + encodeURIComponent(lon) +
	          '&days=2' +
	          '&unitsSystem=IMPERIAL' +
	          '&key=' + encodeURIComponent(apiKey);
}

function getBootMode() {
	if (window.location.hash === '#reset') {
		return 'reset-visible';
	}

	if (hasStoredConfig()) {
		return 'config-ready';
	}

	return 'config-pending';
}

function setPageMode(mode) {
	document.documentElement.className = mode;
}

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
	            var data;

	            try {
	                // Parse the JSON string into a Javascript Object
	                data = JSON.parse(xhr.responseText);
	            } catch (error) {
	                console.error("Error parsing JSON:", error);
	                xhr.onreadystatechange = null;
	                return;
	            }

	            callback(data);
	        } else {
	            console.error("Error fetching data. Status:", xhr.status);
	        }

	        xhr.onreadystatechange = null;
	    }
	};

	// 4. Send the request
	xhr.send();
}

function loadWeather(forecastDataStore, conditionsRenderer) {
	fethc(conditionsApiUrl, function(conditionsData) {
		if (debug) console.log(conditionsData);

		var conditionsParser = new ConditionsParser(conditionsData);
		var conditionsDataParsed = conditionsParser.parse();
		conditionsRenderer.render(conditionsDataParsed);

		// var description = document.getElementById('description');
		// var icon = document.getElementById('icon');
		// var body = document.getElementById('body');

		// if (conditionsData.isDaytime) {
		//     body.className = "day"
		//     icon.src = conditionsData.weatherCondition.iconBaseUri + ".svg"
		// } else {
		//     body.className = "dark"
		//     icon.src = conditionsData.weatherCondition.iconBaseUri + "_dark.svg"
		// }
		// description.innerText = conditionsData.weatherCondition.description.text;
	});

	fethc(forecastApiUrl, function(forecastData) {
		if (debug) console.log(forecastData);

		var hourlyParser = new HourlyParser(forecastData);
		var hourlyDataParsed = hourlyParser.parse();

		forecastDataStore.addHourlyData(hourlyDataParsed);
	});

	fethc(dailyApiUrl, function(dailyData) {
		if (debug) console.log(dailyData);

		var dailyParser = new DailyParser(dailyData);
		var dailyDataParsed = dailyParser.parse();

		forecastDataStore.addDailyData(dailyDataParsed);
	});

	hasLoadedWeather = true;
}

setPageMode(getBootMode());

document.addEventListener("DOMContentLoaded", function(event) {
	var storedConfig = getStoredConfig();
	var forecastRenderer = new ForecastRenderer({
		tempsElement: document.getElementById("temps"),
		hoursElement: document.getElementById("hours"),
		precipsElement: document.getElementById("precips")
	});
	var forecastDataStore = new ForecastDataStore();
	var conditionsRenderer = new ConditionsRenderer({
		description: document.getElementById('description'),
		icon: document.getElementById('icon'),
		bodyElement: document.getElementById('body')
	});
	var configOverlay = new ConfigOverlay({
		formElement: document.getElementById('config-form'),
		apiKeyElement: document.getElementById('api-key'),
		latElement: document.getElementById('latitude'),
		lonElement: document.getElementById('longitude'),
		errorElement: document.getElementById('config-error')
	});
	var resetOverlay = new ResetOverlay({
		ageElement: document.getElementById('reset-age'),
		buttonElement: document.getElementById('reset-button'),
		statusElement: document.getElementById('reset-status')
	});

	forecastDataStore.onUpdate(function(data) {
		var forecast = new Forecast(data);
		forecastRenderer.render(forecast);
	});

	configOverlay.prefill(getQueryConfig());
	configOverlay.clearError();

	configOverlay.onSave(function(values) {
		var config = normalizeConfig(values);

		configOverlay.clearError();

		if (!config.apiKey || !isValidCoordinate(config.lat) || !isValidCoordinate(config.lon)) {
			configOverlay.showError('Enter an API key plus numeric latitude and longitude values.');
			return;
		}

		saveStoredConfig(config);
		configureApiUrls(config);
		setPageMode('config-ready');
		loadWeather(forecastDataStore, conditionsRenderer);
	});

	resetOverlay.onClear(function() {
		clearStoredValues();
		resetOverlay.setAge('Local storage cleared.');
		resetOverlay.setStatus('Return to the <a href="#">setup overlay</a>.');
		hasLoadedWeather = false;
	});

	resetOverlay.setAge(getStoredConfigAgeText());
	resetOverlay.setStatus('');

	if (window.location.hash !== '#reset' && storedConfig) {
		configureApiUrls(storedConfig);
		loadWeather(forecastDataStore, conditionsRenderer);
	}

	window.onhashchange = function() {
		var nextMode = getBootMode();

		setPageMode(nextMode);

		if (nextMode === 'reset-visible') {
			resetOverlay.setAge(getStoredConfigAgeText());
			resetOverlay.setStatus('');
			return;
		}

		if (hasStoredConfig()) {
			if (!hasLoadedWeather) {
				configureApiUrls(getStoredConfig());
				loadWeather(forecastDataStore, conditionsRenderer);
			}
			return;
		}

		configOverlay.prefill(getQueryConfig());
		configOverlay.clearError();
	};
});
