function ForecastRenderer(config) {
  this.data = config.data;
  this.tempsElement = config.tempsElement;
  this.hoursElement = config.hoursElement;
  this.precipsElement = config.precipsElement;

  this.hoursToRender = 16; // constant
}
ForecastRenderer.prototype.render = function() {

    for (var i = 0; i < this.hoursToRender; i++) {

      this._renderHour(this.data.hours[i]);
      this._renderTemp(this.data.hours[i]);
      this._renderPrecip(this.data.hours[i]);
    }

}
ForecastRenderer.prototype._renderHour =  function(hourData){

     var hourLi = document.createElement('li');
     hourLi.className = "hour";
     this.hoursElement.appendChild(hourLi);

     hourLi.innerText = hourData.hourNumber;
}
ForecastRenderer.prototype._renderTemp = function(){

}
ForecastRenderer.prototype._renderPrecip = function(){

}