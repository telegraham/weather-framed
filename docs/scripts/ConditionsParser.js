function ConditionsParser(data) {
  this.data = data || {};
}

ConditionsParser.prototype.parse = function() {
  var weatherCondition = this.data.weatherCondition || {};
  var description = weatherCondition.description || {};
  var temperature = this.data.temperature || {};
  var feelsLikeTemperature = this.data.feelsLikeTemperature || {};

  return {
    dark: !this.data.isDaytime,
    isDaytime: !!this.data.isDaytime,
    description: description.text || '',
    conditionType: weatherCondition.type || '',
    temperature: temperature.degrees,
    feelsLikeTemperature: feelsLikeTemperature.degrees,
    windSpeed: ConditionsParser._windSpeedValue(this.data.wind),
    relativeHumidity: this.data.relativeHumidity,
    uvIndex: this.data.uvIndex,
    visibilityMiles: ConditionsParser._visibilityValue(this.data.visibility),
    cloudCover: this.data.cloudCover,
    currentTime: this.data.currentTime || null
  };
};

ConditionsParser._windSpeedValue = function(wind) {
  var speed = (wind || {}).speed || {};

  return speed.value;
};

ConditionsParser._visibilityValue = function(visibility) {
  var distance = (visibility || {}).distance;

  if (typeof distance !== 'number') {
    return null;
  }

  return distance;
};
