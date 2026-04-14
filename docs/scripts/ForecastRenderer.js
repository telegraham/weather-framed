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
      this._renderHour(hours[i], lowTemperature, highTemperature);
      this._renderTemp(hours[i], lowTemperature, highTemperature);
      this._renderPrecip(hours[i]);
    }

}
ForecastRenderer.prototype._renderHour =  function(hourData, lowTemperature, highTemperature){

  // set up the element
  var hourLi = document.createElement('li');
  hourLi.className = "hour";
  this.hoursElement.appendChild(hourLi);


  if (hourData.temperature === lowTemperature || hourData.temperature === highTemperature) {
    hourLi.innerText = hourData.hourNumber;
  }
}
ForecastRenderer.prototype._renderTemp = function(hourData, lowTemperature, highTemperature){
  var tempLi = document.createElement('li');
  tempLi.className = "hour";
  this.tempsElement.appendChild(tempLi);

  if (hourData.temperature === highTemperature) {
    var tempHighDiv = document.createElement('div');
    tempHighDiv.className = "temp-high";
    var tempHighSpan = document.createElement('span');
    tempHighSpan.innerText = Math.round(hourData.temperature);
    tempHighDiv.appendChild(tempHighSpan);
    tempLi.appendChild(tempHighDiv);
  }

  var barContainerDiv = document.createElement('div');
  barContainerDiv.className = "bar-container";
  tempLi.appendChild(barContainerDiv);

  var barDiv = document.createElement('div');
  barDiv.className = "bar";
  var temperatureRange = highTemperature - lowTemperature;
  var heightPercent = 100;
  if (temperatureRange !== 0) {
    heightPercent = ((hourData.temperature - lowTemperature) / temperatureRange) * 100;
  }

  barDiv.style.height = heightPercent + "%";
  barContainerDiv.appendChild(barDiv);

  var tempLowDiv = document.createElement('div');
  tempLowDiv.className = "temp-low";
  if (hourData.temperature === lowTemperature) {
    var tempLowSpan = document.createElement('span');
    tempLowSpan.innerText = Math.round(hourData.temperature);
    tempLowDiv.appendChild(tempLowSpan);
  }
  tempLi.appendChild(tempLowDiv);
}
ForecastRenderer.prototype._renderPrecip = function(){

}
