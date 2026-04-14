function ForecastParser(data) {
  this.data = data;
}

// 3. Method on the Prototype (shared across all instances)
ForecastParser.prototype.parse = function() {
  var hours = this.data.forecastHours.map(function(forecastHour) {
    return {
      hourId: forecastHour.interval.startTime,
      hourNumber: forecastHour.displayDateTime.hours,
      temperature: forecastHour.temperature.degrees,
      precipitationLikelihood: forecastHour.precipitation.probability.percent
    };
  });

  return new Forecast(hours);
};
