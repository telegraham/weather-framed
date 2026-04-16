function Hour(config) {
  this.hourId = config.hourId;
  this.hourNumber = config.hourNumber;
  this.isDaytime = config.isDaytime;
  this.temperature = config.temperature;
  this.precipitationLikelihood = config.precipitationLikelihood;
  this.sunStatuses = config.sunStatuses || [];
  this.isFirst = !!config.isFirst;
}

Hour.sunStatuses = function(hour, days) {
  var startOfHour = hour.startOfHour;
  var sunStatuses = []

  if (days) {
    if (days.sunsets[startOfHour]) {
      sunStatuses.push("SUNSET");
    }
    else if (days.sunrises[startOfHour]) {
      sunStatuses.push("SUNRISE");
    }
  }

  sunStatuses.push(hour.isDaytime ? "DAY" : "NIGHT");
  return sunStatuses;
};
Hour.startOfHour = function(dateTime) {
  var date = new Date(dateTime);

  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);

  return date.toISOString();
};
