function HourlyParser(data) {
  this.data = data;
}

HourlyParser.prototype.parse = function() {
  var hours = this.data.forecastHours.map(function(forecastHour) {
    return {
      hourId: forecastHour.interval.startTime,
      hourNumber: forecastHour.displayDateTime.hours,
      isDaytime: forecastHour.isDaytime,
      startTime: forecastHour.interval.startTime,
      utcOffsetSeconds: HourlyParser._utcOffsetSeconds(forecastHour.displayDateTime.utcOffset),
      // endTime: forecastHour.interval.endTime,
      temperature: forecastHour.temperature.degrees,
      precipitationLikelihood: forecastHour.precipitation.probability.percent
    };
  });

  return hours;
};

HourlyParser._utcOffsetSeconds = function(utcOffset) {
  var match;

  if (!utcOffset) {
    return null;
  }

  match = String(utcOffset).match(/^(-?\d+)s$/);

  if (!match) {
    return null;
  }

  return parseInt(match[1], 10);
};
