function Forecast(data, windowSize) {
  var hours = data.hours;
  var days = data.days;

  var windowSize = typeof windowSize === "number" ? windowSize : Forecast.DEFAULT_WINDOW_SIZE;

  this._visibleHours = hours.slice(0, windowSize);

  if (days) {
    this._visibleHours.forEach(function(hour){
      hour.decorateWithSunStatus(days);
    })
  };

  var temperatures = this._visibleHours.map(function(hour) {
    return hour.temperature;
  });
  this.temperatureRange = new TemperatureRange(temperatures);

  this.precipitationPeriods = this._findPrecipitationPeriods();
  this._labeledPrecipitationHoursById = this._findLabeledPrecipitationHoursById();
}

Forecast.prototype.hours = function() {
  return this._visibleHours;
}

Forecast.DEFAULT_WINDOW_SIZE = 16;

Forecast.prototype._findPrecipitationPeriods = function() {
  var precipitationPeriods = [];
  var currentPeriodHours = [];

  for (var i = 0; i < this._visibleHours.length; i++) {
    var hour = this._visibleHours[i];

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

Forecast.prototype.shouldLabelPrecipitationHour = function(hour) {
  return !!this._labeledPrecipitationHoursById[hour.hourId];
};

Forecast.prototype.shouldLabelPrecipitationBar = function(hour) {
  return this.shouldLabelPrecipitationHour(hour);
};

Forecast.prototype.shouldLabelHour = function(hour) {
  return this.temperatureRange.isExtreme(hour.temperature) || this.shouldLabelPrecipitationHour(hour);
};
