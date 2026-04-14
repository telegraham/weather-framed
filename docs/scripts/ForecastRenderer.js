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
    var precipitationLikelihoods = hours.map(function(hourData) {
      return hourData.precipitationLikelihood;
    });
    var highestPrecipitationLikelihood = Math.max.apply(null, precipitationLikelihoods);
    var highlights = {
      temperatureRange: temperatureRange,
      highestPrecipitationLikelihood: highestPrecipitationLikelihood
    };

    // loop and render various bits
    for (var i = 0; i < hours.length; i++) {
      this._renderHour(hours[i], highlights);
      this._renderTemp(hours[i], temperatureRange);
    }

    if (highestPrecipitationLikelihood === 0) {
      this._renderNoRain();
      return;
    }

    for (var j = 0; j < hours.length; j++) {
      this._renderPrecip(hours[j], highestPrecipitationLikelihood);
    }

}
ForecastRenderer.prototype._renderHour = function(hourData, highlights){

  // set up the element
  var hourLi = document.createElement('li');
  hourLi.className = "hour";
  this.hoursElement.appendChild(hourLi);


  if (
    highlights.temperatureRange.isExtreme(hourData.temperature) ||
    (
      highlights.highestPrecipitationLikelihood > 0 &&
      hourData.precipitationLikelihood === highlights.highestPrecipitationLikelihood
    )
  ) {
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
ForecastRenderer.prototype._renderNoRain = function(){
  var noRainLi = document.createElement('li');
  noRainLi.className = "no-rain";
  noRainLi.innerText = "no rain";
  this.precipsElement.appendChild(noRainLi);
}
ForecastRenderer.prototype._renderPrecip = function(hourData, highestPrecipitationLikelihood){
  var precipLi = document.createElement('li');
  precipLi.className = "hour precip-hour";
  this.precipsElement.appendChild(precipLi);

  var precipBarDiv = document.createElement('div');
  precipBarDiv.className = "precip-bar";
  precipBarDiv.style.height = hourData.precipitationLikelihood + "%";
  precipLi.appendChild(precipBarDiv);

  if (hourData.precipitationLikelihood === highestPrecipitationLikelihood) {
    var precipLabelSpan = document.createElement('span');
    precipLabelSpan.className = "precip-label";
    precipLabelSpan.innerText = hourData.precipitationLikelihood + "%";
    precipBarDiv.appendChild(precipLabelSpan);
  }
}
