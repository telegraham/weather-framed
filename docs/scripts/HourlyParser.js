function HourlyParser(data) {
  this.data = data;
}

HourlyParser.prototype.parse = function() {
  var hours = this.data.forecastHours.map(function(forecastHour) {
    return new Hour({
      hourId: forecastHour.interval.startTime,
      hourNumber: forecastHour.displayDateTime.hours,
      isDaytime: forecastHour.isDaytime,
      startTime: forecastHour.interval.startTime,
      // endTime: forecastHour.interval.endTime,
      temperature: forecastHour.temperature.degrees,
      precipitationLikelihood: forecastHour.precipitation.probability.percent
    });
  });

  return hours;
};
