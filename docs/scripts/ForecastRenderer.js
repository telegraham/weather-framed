function ForecastRenderer(config) {
  this.data = config.data;
  this.tempsElement = config.tempsElement;
  this.hoursElement = config.hoursElement;
  this.precipsElement = config.precipsElement;

  this.hoursToRender = 16; // constant
}
ForecastRenderer.prototype.render = function() {
    // cut the array down to the window we care about
    var hours = this.data.hours.slice(0, this.hoursToRender);

    // find the low and the high
    var temperatures = hours.map(function(hourData) {
      return hourData.temperature;
    });
    var lowTemperature = Math.min.apply(null, temperatures);
    var highTemperature = Math.max.apply(null, temperatures);

    // loop and render various bits
    for (var i = 0; i < hours.length; i++) {
      this._renderHour(hours[i]);
      this._renderTemp(hours[i], lowTemperature, highTemperature);
      this._renderPrecip(hours[i]);
    }

}
ForecastRenderer.prototype._renderHour =  function(hourData){

  // set up the element
  var hourLi = document.createElement('li');
  hourLi.className = "hour";
  this.hoursElement.appendChild(hourLi);


  hourLi.innerText = hourData.hourNumber;
}
ForecastRenderer.prototype._renderTemp = function(hourData, lowTemperature, highTemperature){
  var tempLi = document.createElement('li');
  tempLi.className = "hour";
  this.tempsElement.appendChild(tempLi);

  var tempDiv = document.createElement('div');
  var temperatureRange = highTemperature - lowTemperature;
  var heightPercent = 100;
  if (temperatureRange !== 0) {
    heightPercent = ((hourData.temperature - lowTemperature) / temperatureRange) * 100;
  }

  tempDiv.style.height = heightPercent + "%";
  tempLi.appendChild(tempDiv);
}
ForecastRenderer.prototype._renderPrecip = function(){

}
