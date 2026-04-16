function WeatherDataStore() {
  this.current = null;
  this.hours = null;
  this.days = null;
  this._listeners = [];
}

WeatherDataStore.prototype.onUpdate = function(listener) {
  this._listeners.push(listener);
};

WeatherDataStore.prototype.addCurrentData = function(current) {
  this.current = current;
  this._notify();
};

WeatherDataStore.prototype.addHourlyData = function(hours) {
  this.hours = hours;
  this._notify();
};

WeatherDataStore.prototype.addDailyData = function(days) {
  this.days = days;
  this._notify();
};

WeatherDataStore.prototype._notify = function() {
  var data = {
    current: this.current,
    hours: this.hours,
    days: this.days
  };

  this._listeners.forEach(function(listener) {
    listener(data);
  });
};
