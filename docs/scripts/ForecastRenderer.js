function ForecastRenderer(config) {
  this.tempsElement = config.tempsElement;
  this.hoursElement = config.hoursElement;
  this.precipsElement = config.precipsElement;
}
ForecastRenderer.prototype.render = function(forecast) {
   
    this.tempsElement.innerHTML = "";
    this.hoursElement.innerHTML = "";
    this.precipsElement.innerHTML = "";

    this.forecast = forecast;

    var hours = this.forecast.hours();

    // loop and render various bits
    hours.forEach(function(hour) {
      this._renderHour(hour);
      this._renderTemp(hour);
    }, this);

    if (!this.forecast.hasPrecipitation()) {
      this._renderNoPrecipitation();
      return;
    }

    hours.forEach(function(hour) {
      this._renderPrecip(hour);
    }, this);

}
ForecastRenderer.prototype._renderHour = function(hour){

  // set up the element
  var hourLi = document.createElement('li');
  hourLi.className = "hour " + hour.sunStatuses.map(this._classNameForHourSunStatus, this).join(" ");
  this.hoursElement.appendChild(hourLi);

  if (this.forecast.shouldLabelHour(hour)) {
    hourLi.innerText = hour.hourNumber;
    return;
  }

  hourLi.className += " empty";
  hourLi.innerHTML = "&#8226;";
}
ForecastRenderer.prototype._classNameForHourSunStatus = function(sunStatus) {
  switch (sunStatus) {
    case "DAY":
      return "day";
    case "SUNSET":
      return "sunset";
    case "NIGHT":
      return "night";
    case "SUNRISE":
      return "sunrise";
    default:
      return "";
  }
};
ForecastRenderer.prototype._renderTemp = function(hour){
  var tempLi = document.createElement('li');
  tempLi.className = "hour";
  this.tempsElement.appendChild(tempLi);

  var tempHighDiv = document.createElement('div');
  tempHighDiv.className = "temp-high";
  if (this.forecast.shouldLabelExtreme(hour) && this.forecast.temperatureRange.isHigh(hour.temperature)) {
    var tempHighSpan = document.createElement('span');
    tempHighSpan.innerText = Math.round(hour.temperature);
    tempHighDiv.appendChild(tempHighSpan);
  } else {
    tempHighDiv.className += " temp-empty";
  }
  tempLi.appendChild(tempHighDiv);

  var barContainerDiv = document.createElement('div');
  barContainerDiv.className = "bar-container";
  tempLi.appendChild(barContainerDiv);

  var barDiv = document.createElement('div');
  barDiv.className = "bar temp-bar";
  var heightPercent = this.forecast.temperatureRange.percentFor(hour.temperature);
  var temperatureColor = this._temperatureColorForPercent(heightPercent);

  barDiv.style.height = heightPercent + "%";
  barDiv.style.background = temperatureColor;
  barContainerDiv.appendChild(barDiv);

  var tempLowDiv = document.createElement('div');
  tempLowDiv.className = "temp-low";
  tempLowDiv.style.background = temperatureColor;
  if (this.forecast.shouldLabelExtreme(hour) && this.forecast.temperatureRange.isLow(hour.temperature)) {
    var tempLowSpan = document.createElement('span');
    tempLowSpan.innerText = Math.round(hour.temperature);
    tempLowDiv.appendChild(tempLowSpan);
  } else {
    tempLowDiv.className += " temp-empty";
  }
  tempLi.appendChild(tempLowDiv);
}
ForecastRenderer.prototype._temperatureColorForPercent = function(percent) {
  var lowChannel = 0x22;
  var highChannel = 0xdd;
  var normalizedPercent = percent;
  var channel;
  var hexChannel;

  if (normalizedPercent < 0) {
    normalizedPercent = 0;
  } else if (normalizedPercent > 100) {
    normalizedPercent = 100;
  }

  channel = Math.round(lowChannel + ((highChannel - lowChannel) * (normalizedPercent / 100)));
  hexChannel = channel.toString(16);

  if (hexChannel.length < 2) {
    hexChannel = "0" + hexChannel;
  }

  return "#" + hexChannel + hexChannel + hexChannel;
};
ForecastRenderer.prototype._renderNoPrecipitation = function(){
  var noPrecipitationLi = document.createElement('li');
  noPrecipitationLi.className = "no-precip";
  noPrecipitationLi.innerText = "no precip";
  this.precipsElement.appendChild(noPrecipitationLi);
}
ForecastRenderer.prototype._renderPrecip = function(hour){
  var precipLi = document.createElement('li');
  precipLi.className = "hour precip-hour " + hour.sunStatuses.map(this._classNameForHourSunStatus, this).join(" ");
  this.precipsElement.appendChild(precipLi);

  var precipBarDiv = document.createElement('div');
  precipBarDiv.className = "bar precip-bar " + (hour.precipitationLikelihood > 50 ? "over-50" : "");
  precipBarDiv.style.height = hour.precipitationLikelihood + "%";
  precipLi.appendChild(precipBarDiv);

  if (this.forecast.shouldLabelPrecipitationBar(hour)) {
    var precipLabelSpan = document.createElement('span');
    precipLabelSpan.className = "precip-label";
    precipLabelSpan.innerText = hour.precipitationLikelihood + "%";
    precipBarDiv.appendChild(precipLabelSpan);
  }
}
