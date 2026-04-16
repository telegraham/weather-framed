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
    description: description.text || '',
    iconBaseUri: weatherCondition.iconBaseUri || '',
    temperature: temperature.degrees,
    feelsLikeTemperature: feelsLikeTemperature.degrees,
    currentTime: this.data.currentTime || null
  };
};
