function ForecastRenderer(config) {
  this.data = config.data;
  this.tempsElement = config.tempsElement;
  this.hoursElement = config.hoursElement;
  this.precipsElement = config.precipsElement;

  this.hoursToRender = 16; // constant
}
ForecastRenderer.prototype.render = function() {

    this.hoursElement



    for (var i = 0; i < this.hoursToRender; i++) {

     var hourDiv = document.createElement('div');
     hourDiv.className = "hour";
     this.hoursElement.appendChild(hourDiv);

     var hourData = this.data.hours[i];

     hourDiv.innerText = hourData.hourNumber; //+ " " + hourData.weatherCondition.description.text;
    //  // hourly += <
    //  // Things[i]

    }


}