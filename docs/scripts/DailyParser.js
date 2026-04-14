function DailyParser(data) {
  this.data = data;
}

DailyParser.prototype.parse = function() {
  var empty = {
    sunsets: {},
    sunrises: {}
  };

  if (!this.data || !this.data.forecastDays) {
    return empty;
  }

  return this.data.forecastDays.reduce(function(accumulator, forecastDay) {
    var sunEvents = forecastDay.sunEvents || {};
    var sunriseTime = sunEvents.sunriseTime;
    var sunsetTime = sunEvents.sunsetTime;

    if (sunriseTime) {
      accumulator.sunrises[Hour.startOfHour(sunriseTime)] = sunriseTime;
    }

    if (sunsetTime) {
      accumulator.sunsets[Hour.startOfHour(sunsetTime)] = sunsetTime;
    }

    return accumulator;
  }, empty);
};

