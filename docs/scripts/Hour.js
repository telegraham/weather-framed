function Hour(config) {
  this.hourId = config.hourId;
  this.hourNumber = config.hourNumber;
  this.isDaytime = config.isDaytime;
  this.startTime = Hour.startOfHour(config.startTime);
  // this.endTime = config.endTime;
  this.temperature = config.temperature;
  this.precipitationLikelihood = config.precipitationLikelihood;
  this.sunStatuses = config.sunStatuses || [];
  this.isFirst = !!config.isFirst;
}

Hour.sunStatuses = function(hour, days) {
  if (!days) {
    return hour.isDaytime ? ["DAY"] : ["NIGHT"];
  }

  var sunStatuses = []

  if (days.sunsets[hour.startTime]) {
    sunStatuses.push("SUNSET");
  }
  else if (days.sunrises[hour.startTime]) {
    sunStatuses.push("SUNRISE");
  }

  sunStatuses.push(hour.isDaytime ? "DAY" : "NIGHT");
  return sunStatuses
};
Hour.startOfHour = function(dateTime) {
  var date = new Date(dateTime);

  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);

  return date.toISOString();
};
