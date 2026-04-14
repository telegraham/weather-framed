function TemperatureRange(temperatures) {
  this.low = Math.min.apply(null, temperatures);
  this.high = Math.max.apply(null, temperatures);
}

TemperatureRange.prototype.isLow = function(temperature) {
  return temperature === this.low;
};

TemperatureRange.prototype.isHigh = function(temperature) {
  return temperature === this.high;
};

TemperatureRange.prototype.isExtreme = function(temperature) {
  return this.isLow(temperature) || this.isHigh(temperature);
};

TemperatureRange.prototype.spread = function() {
  return this.high - this.low;
};

TemperatureRange.prototype.heightPercentFor = function(temperature) {
  var spread = this.spread();

  if (spread === 0) {
    return 100;
  }

  return ((temperature - this.low) / spread) * 100;
};
