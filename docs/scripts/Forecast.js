function Forecast(hours, windowSize) {
  this.hours = hours;
  this.windowSize = typeof windowSize === "number" ? windowSize : Forecast.DEFAULT_WINDOW_SIZE;
  this.visibleHours = this.hours.slice(0, this.windowSize);

  var temperatures = this.visibleHours.map(function(hourData) {
    return hourData.temperature;
  });
  this.temperatureRange = new TemperatureRange(temperatures);

  this.precipitationPeriods = this._findPrecipitationPeriods();
  this._labeledPrecipitationHoursById = this._findLabeledPrecipitationHoursById();
}

Forecast.DEFAULT_WINDOW_SIZE = 16;

Forecast.prototype._findPrecipitationPeriods = function() {
  var precipitationPeriods = [];
  var currentPeriodHours = [];

  for (var i = 0; i < this.visibleHours.length; i++) {
    var hour = this.visibleHours[i];

    if (hour.precipitationLikelihood === 0) {
      if (currentPeriodHours.length) {
        precipitationPeriods.push(new PrecipitationPeriod(currentPeriodHours));
        currentPeriodHours = [];
      }
      continue;
    }

    currentPeriodHours.push(hour);
  }

  if (currentPeriodHours.length) {
    precipitationPeriods.push(new PrecipitationPeriod(currentPeriodHours));
  }

  return precipitationPeriods;
};

Forecast.prototype._findLabeledPrecipitationHoursById = function() {
  return this.precipitationPeriods.reduce(function(labeledHoursById, precipitationPeriod) {
    precipitationPeriod.significantHours().forEach(function(significantHour) {
      labeledHoursById[significantHour.hourId] = true;
    });

    return labeledHoursById;

  }, {});
};

Forecast.prototype.hasPrecipitation = function() {
  return this.precipitationPeriods.length > 0;
};

Forecast.prototype.shouldLabelPrecipitationHour = function(hourData) {
  return !!this._labeledPrecipitationHoursById[hourData.hourId];
};

Forecast.prototype.shouldLabelPrecipitationBar = function(hourData) {
  return this.shouldLabelPrecipitationHour(hourData);
};

Forecast.prototype.shouldLabelHour = function(hourData) {
  return this.temperatureRange.isExtreme(hourData.temperature) || this.shouldLabelPrecipitationHour(hourData);
};
