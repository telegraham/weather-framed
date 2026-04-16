function Forecast(data, windowSize) {
  var rawHours = data.hours;
  var days = data.days;

  var windowSize = typeof windowSize === "number" ? windowSize : Forecast.DEFAULT_WINDOW_SIZE;

  this._hours = rawHours.slice(0, windowSize).map(function(rawHour, index) {
    var startOfHour = Hour.startOfHour(rawHour.startTime);

    return new Hour({
      hourId: rawHour.hourId,
      hourNumber: rawHour.hourNumber,
      isDaytime: rawHour.isDaytime,
      temperature: rawHour.temperature,
      precipitationLikelihood: rawHour.precipitationLikelihood,
      sunStatuses: Hour.sunStatuses({
        isDaytime: rawHour.isDaytime,
        startOfHour: startOfHour
      }, days),
      isFirst: index === 0
    });
  });

  var temperatures = this._hours.map(function(hour) {
    return hour.temperature;
  });
  this.temperatureRange = new TemperatureRange(temperatures);

  this.precipitationPeriods = this._findPrecipitationPeriods();
  this._labeledPrecipitationHoursById = this._findLabeledPrecipitationHoursById();
}

Forecast.prototype.hours = function() {
  return this._hours;
}

Forecast.DEFAULT_WINDOW_SIZE = 16;

Forecast.prototype._findPrecipitationPeriods = function() {
  var precipitationPeriods = [];
  var currentPeriodHours = [];

  for (var i = 0; i < this._hours.length; i++) {
    var hour = this._hours[i];

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
  return hour.isFirst || this.temperatureRange.isExtreme(hour.temperature) || this.shouldLabelPrecipitationHour(hour);
};
