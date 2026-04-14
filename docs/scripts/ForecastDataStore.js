function ForecastDataStore() {
  this.hours = null;
  this.days = null;
  this._listeners = [];
}

ForecastDataStore.prototype.onUpdate = function(listener) {
  this._listeners.push(listener);
};

ForecastDataStore.prototype.addHourlyData = function(hours) {
  this.hours = hours;
  this._notify();
};

ForecastDataStore.prototype.addDailyData = function(days) {
  this.days = days;
  this._notify();
};

ForecastDataStore.prototype._notify = function() {
  if (!this.hours) {
    return;
  }

  var data = {
    hours: this.hours,
    days: this.days
  };

  this._listeners.forEach(function(listener) {
    listener(data);
  });
};
