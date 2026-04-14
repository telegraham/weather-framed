function ForecastParser(data) {
  this.data = data;
}

// 3. Method on the Prototype (shared across all instances)
ForecastParser.prototype.parse = function() {



  var hours = this.data.forecastHours.map(function(forecastHour) {
    return { hourNumber: 6 }
  });

  return { 
    hours: hours,
  };
};