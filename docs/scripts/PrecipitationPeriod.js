function PrecipitationPeriod(hours) {
  this.hours = hours;
  this._peakHour = this.hours[0];

  for (var i = this.hours.length - 1; i >= 0; i--) {
    var hour = this.hours[i];

    if (hour.precipitationLikelihood > this._peakHour.precipitationLikelihood) {
      this._peakHour = hour;
    }
  }
}

PrecipitationPeriod.prototype.startHour = function() {
  return this.hours[0];
};

PrecipitationPeriod.prototype.endHour = function() {
  return this.hours[this.hours.length - 1];
};

PrecipitationPeriod.prototype.peakHour = function() {
  return this._peakHour;
};

// may not be unique!
PrecipitationPeriod.prototype.significantHours = function() {
  return [this.startHour(), this.peakHour(), this.endHour()];
};
