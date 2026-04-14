function ForecastRenderer(config) {
  this.data = config.data;
  this.tempsElement = config.tempsElement;
  this.hoursElement = config.hoursElement;
  this.precipsElement = config.precipsElement;
}
ForecastRenderer.prototype.render = function() {
    var hours = this.data.visibleHours;

    // loop and render various bits
    hours.forEach(function(hourData) {
      this._renderHour(hourData);
      this._renderTemp(hourData);
    }, this);

    if (!this.data.hasPrecipitation()) {
      this._renderNoPrecipitation();
      return;
    }

    hours.forEach(function(hourData) {
      this._renderPrecip(hourData);
    }, this);

}
ForecastRenderer.prototype._renderHour = function(hourData){

  // set up the element
  var hourLi = document.createElement('li');
  hourLi.className = "hour";
  this.hoursElement.appendChild(hourLi);


  if (this.data.shouldLabelHour(hourData)) {
    hourLi.innerText = hourData.hourNumber;
  }
}
ForecastRenderer.prototype._renderTemp = function(hourData){
  var tempLi = document.createElement('li');
  tempLi.className = "hour";
  this.tempsElement.appendChild(tempLi);

  if (this.data.temperatureRange.isHigh(hourData.temperature)) {
    var tempHighDiv = document.createElement('div');
    tempHighDiv.className = "temp-high";
    var tempHighSpan = document.createElement('span');
    tempHighSpan.innerText = Math.round(hourData.temperature) + "°";
    tempHighDiv.appendChild(tempHighSpan);
    tempLi.appendChild(tempHighDiv);
  }

  var barContainerDiv = document.createElement('div');
  barContainerDiv.className = "bar-container";
  tempLi.appendChild(barContainerDiv);

  var barDiv = document.createElement('div');
  barDiv.className = "bar";
  var heightPercent = this.data.temperatureRange.heightPercentFor(hourData.temperature);

  barDiv.style.height = heightPercent + "%";
  barContainerDiv.appendChild(barDiv);

  var tempLowDiv = document.createElement('div');
  tempLowDiv.className = "temp-low";
  if (this.data.temperatureRange.isLow(hourData.temperature)) {
    var tempLowSpan = document.createElement('span');
    tempLowSpan.innerText = Math.round(hourData.temperature) + "°";
    tempLowDiv.appendChild(tempLowSpan);
  }
  tempLi.appendChild(tempLowDiv);
}
ForecastRenderer.prototype._renderNoPrecipitation = function(){
  var noPrecipitationLi = document.createElement('li');
  noPrecipitationLi.className = "no-precip";
  noPrecipitationLi.innerText = "no precip";
  this.precipsElement.appendChild(noPrecipitationLi);
}
ForecastRenderer.prototype._renderPrecip = function(hourData){
  var precipLi = document.createElement('li');
  precipLi.className = "hour precip-hour";
  this.precipsElement.appendChild(precipLi);

  var precipBarDiv = document.createElement('div');
  precipBarDiv.className = "precip-bar";
  precipBarDiv.style.height = hourData.precipitationLikelihood + "%";
  precipLi.appendChild(precipBarDiv);

  if (this.data.shouldLabelPrecipitationBar(hourData)) {
    var precipLabelSpan = document.createElement('span');
    precipLabelSpan.className = "precip-label";
    precipLabelSpan.innerText = hourData.precipitationLikelihood + "%";
    precipBarDiv.appendChild(precipLabelSpan);
  }
}
