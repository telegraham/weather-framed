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
    var temperatureRange = new TemperatureRange(temperatures);

    // loop and render various bits
    for (var i = 0; i < hours.length; i++) {
      this._renderHour(hours[i], temperatureRange);
      this._renderTemp(hours[i], temperatureRange);
      this._renderPrecip(hours[i]);
    }

}
ForecastRenderer.prototype._renderHour =  function(hourData, temperatureRange){

  // set up the element
  var hourLi = document.createElement('li');
  hourLi.className = "hour";
  this.hoursElement.appendChild(hourLi);


  if (temperatureRange.isExtreme(hourData.temperature)) {
    hourLi.innerText = hourData.hourNumber;
  }
}
ForecastRenderer.prototype._renderTemp = function(hourData, temperatureRange){
  var tempLi = document.createElement('li');
  tempLi.className = "hour";
  this.tempsElement.appendChild(tempLi);

  if (temperatureRange.isHigh(hourData.temperature)) {
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
  var heightPercent = temperatureRange.heightPercentFor(hourData.temperature);

  barDiv.style.height = heightPercent + "%";
  barContainerDiv.appendChild(barDiv);

  var tempLowDiv = document.createElement('div');
  tempLowDiv.className = "temp-low";
  if (temperatureRange.isLow(hourData.temperature)) {
    var tempLowSpan = document.createElement('span');
    tempLowSpan.innerText = Math.round(hourData.temperature);
    tempLowDiv.appendChild(tempLowSpan);
  }
  tempLi.appendChild(tempLowDiv);
}
ForecastRenderer.prototype._renderPrecip = function(){

}
