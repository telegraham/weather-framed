function WeatherService(debug) {
  this.debug = debug;
}

WeatherService.prototype._urls = function(config, useTestData) {
  if (useTestData) return ({
    conditionsApiUrl : "test/conditions.json",
    forecastApiUrl : "test/forecast.json",
    dailyApiUrl : "test/daily.json",
  })

  var conditionsApiUrl = 'https://weather.googleapis.com/v1/currentConditions:lookup' +
              '?location.latitude=' + encodeURIComponent(config.lat) +
              '&location.longitude=' + encodeURIComponent(config.lon) +
              '&unitsSystem=IMPERIAL' +
              '&key=' + encodeURIComponent(config.apiKey);

  var forecastApiUrl =  'https://weather.googleapis.com/v1/forecast/hours:lookup' +
              '?location.latitude=' + encodeURIComponent(config.lat) +
              '&location.longitude=' + encodeURIComponent(config.lon) +
              '&unitsSystem=IMPERIAL' +
              '&key=' + encodeURIComponent(config.apiKey);
              
  var dailyApiUrl = 'https://weather.googleapis.com/v1/forecast/days:lookup' +
              '?location.latitude=' + encodeURIComponent(config.lat) +
              '&location.longitude=' + encodeURIComponent(config.lon) +
              '&days=2' +
              '&unitsSystem=IMPERIAL' +
              '&key=' + encodeURIComponent(config.apiKey);

  return ({
    conditionsApiUrl: conditionsApiUrl,
    forecastApiUrl: forecastApiUrl,
    dailyApiUrl: dailyApiUrl,
  });
};

WeatherService.prototype._fetchJson = function(url, callback) {
  var xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);

  xhr.onreadystatechange = function() {
    var data;

    if (xhr.readyState !== 4) {
      return;
    }

    if (xhr.status === 200) {
      try {
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
  };

  xhr.send();
};

WeatherService.prototype.load = function(callbacks, config, useTestData) {

  var urls = this._urls(config, useTestData);

  callbacks = callbacks || {};

  var debug = this.debug;

  this._fetchJson(urls.conditionsApiUrl, function(conditionsData) {
    var conditionsDataParsed;

    if (debug) console.log(conditionsData);

    conditionsDataParsed = (new ConditionsParser(conditionsData)).parse();

    if (callbacks.onConditionsLoaded) {
      callbacks.onConditionsLoaded(conditionsDataParsed);
    }
  });

  this._fetchJson(urls.forecastApiUrl, function(forecastData) {
    var hourlyDataParsed;

    if (debug) console.log(forecastData);

    hourlyDataParsed = (new HourlyParser(forecastData)).parse();

    if (callbacks.onHourlyLoaded) {
      callbacks.onHourlyLoaded(hourlyDataParsed);
    }
  });

  this._fetchJson(urls.dailyApiUrl, function(dailyData) {
    var dailyDataParsed;

    if (debug) console.log(dailyData);

    dailyDataParsed = (new DailyParser(dailyData)).parse();

    if (callbacks.onDailyLoaded) {
      callbacks.onDailyLoaded(dailyDataParsed);
    }
  });
};
