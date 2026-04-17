function DailyParser(data) {
  this.data = data;
}

DailyParser.prototype.parse = function() {
  var empty = {
    sunsets: {},
    sunrises: {},
    today: null
  };

  if (!this.data || !this.data.forecastDays) {
    return empty;
  }

  return this.data.forecastDays.reduce(function(accumulator, forecastDay, index) {
    var sunEvents = forecastDay.sunEvents || {};
    var sunriseTime = sunEvents.sunriseTime;
    var sunsetTime = sunEvents.sunsetTime;

    if (sunriseTime) {
      accumulator.sunrises[Hour.startOfHour(sunriseTime)] = sunriseTime;
    }

    if (sunsetTime) {
      accumulator.sunsets[Hour.startOfHour(sunsetTime)] = sunsetTime;
    }

    if (index === 0) {
      accumulator.today = DailyParser._todaySummary(forecastDay);
    }

    return accumulator;
  }, empty);
};

DailyParser._todaySummary = function(forecastDay) {
  var daytimeForecast = forecastDay.daytimeForecast || {};
  var nighttimeForecast = forecastDay.nighttimeForecast || {};
  var weatherCondition = daytimeForecast.weatherCondition || {};
  var description = weatherCondition.description || {};

  return {
    dateLabel: DailyParser._dateLabel(forecastDay.displayDate),
    description: description.text || '',
    conditionType: weatherCondition.type || '',
    dayWindSpeed: DailyParser._windSpeedValue(daytimeForecast),
    nightWindSpeed: DailyParser._windSpeedValue(nighttimeForecast),
    moonPhase: forecastDay.moonEvents && forecastDay.moonEvents.moonPhase,
    sunriseTime: forecastDay.sunEvents && forecastDay.sunEvents.sunriseTime,
    sunsetTime: forecastDay.sunEvents && forecastDay.sunEvents.sunsetTime
  };
};

DailyParser._dateLabel = function(displayDate) {
  if (!displayDate) {
    return '';
  }

  return displayDate.month + '/' + displayDate.day;
};

DailyParser._windSpeedValue = function(forecastPeriod) {
  var wind = (forecastPeriod && forecastPeriod.wind) || {};
  var speed = wind.speed || {};

  return speed.value || 0;
};
