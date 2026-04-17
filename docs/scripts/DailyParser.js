function DailyParser(data) {
  this.data = data;
}

DailyParser.prototype.parse = function() {
  var empty = {
    sunsets: {},
    sunrises: {},
    today: null,
    nextMoon: {
      fullMoonDateLabel: null,
      newMoonDateLabel: null
    }
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

    if (index > 0) {
      DailyParser._recordNextMoon(accumulator.nextMoon, forecastDay);
    }

    return accumulator;
  }, empty);
};

DailyParser._todaySummary = function(forecastDay) {
  var daytimeForecast = forecastDay.daytimeForecast || {};
  var nighttimeForecast = forecastDay.nighttimeForecast || {};
  var dayWeatherCondition = daytimeForecast.weatherCondition || {};
  var nightWeatherCondition = nighttimeForecast.weatherCondition || {};
  var dayDescription = dayWeatherCondition.description || {};
  var nightDescription = nightWeatherCondition.description || {};
  var moonEvents = forecastDay.moonEvents || {};
  var moonriseTimes = moonEvents.moonriseTimes || [];
  var moonsetTimes = moonEvents.moonsetTimes || [];

  return {
    dateLabel: DailyParser._dateLabel(forecastDay.displayDate),
    description: dayDescription.text || '',
    conditionType: dayWeatherCondition.type || '',
    dayWindSpeed: DailyParser._windSpeedValue(daytimeForecast),
    dayHumidity: DailyParser._numberValue(daytimeForecast.relativeHumidity),
    dayUvIndex: DailyParser._numberValue(daytimeForecast.uvIndex),
    nightDescription: nightDescription.text || '',
    nightConditionType: nightWeatherCondition.type || '',
    nightWindSpeed: DailyParser._windSpeedValue(nighttimeForecast),
    nightHumidity: DailyParser._numberValue(nighttimeForecast.relativeHumidity),
    moonPhase: moonEvents.moonPhase,
    sunriseTime: forecastDay.sunEvents && forecastDay.sunEvents.sunriseTime,
    sunsetTime: forecastDay.sunEvents && forecastDay.sunEvents.sunsetTime,
    moonriseTime: moonriseTimes[0] || null,
    moonsetTime: moonsetTimes[0] || null
  };
};

DailyParser._dateLabel = function(displayDate) {
  var monthName;

  if (!displayDate) {
    return '';
  }

  monthName = DailyParser.MONTH_NAMES[displayDate.month - 1];

  if (!monthName) {
    return displayDate.month + '-' + displayDate.day;
  }

  return monthName + ' ' + displayDate.day;
};

DailyParser._windSpeedValue = function(forecastPeriod) {
  var wind = (forecastPeriod && forecastPeriod.wind) || {};
  var speed = wind.speed || {};

  return speed.value || 0;
};

DailyParser._numberValue = function(value) {
  if (typeof value !== 'number') {
    return null;
  }

  return value;
};

DailyParser._recordNextMoon = function(nextMoon, forecastDay) {
  var moonPhase = forecastDay.moonEvents && forecastDay.moonEvents.moonPhase;
  var dateLabel;

  if (!nextMoon || (moonPhase !== 'FULL_MOON' && moonPhase !== 'NEW_MOON')) {
    return;
  }

  dateLabel = DailyParser._dashDisplayLabel(forecastDay.displayDate);

  if (moonPhase === 'FULL_MOON' && !nextMoon.fullMoonDateLabel) {
    nextMoon.fullMoonDateLabel = dateLabel;
  }

  if (moonPhase === 'NEW_MOON' && !nextMoon.newMoonDateLabel) {
    nextMoon.newMoonDateLabel = dateLabel;
  }
};

DailyParser._dashDisplayLabel = function(displayDate) {
  if (!displayDate) {
    return '';
  }

  return displayDate.month + '-' + displayDate.day;
};

DailyParser.MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
