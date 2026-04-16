function ConditionsRenderer(elements) {
  this.bodyElement = elements.bodyElement;
  this.descriptionElement = elements.descriptionElement;
  this.iconElement = elements.iconElement;
  this.currentTemperatureElement = elements.currentTemperatureElement;
  this.realFeelElement = elements.realFeelElement;
  this.nowLabelElement = elements.nowLabelElement;
  this.todayDescriptionElement = elements.todayDescriptionElement;
  this.todayLabelElement = elements.todayLabelElement;
  this.todayIconElement = elements.todayIconElement;
  this.dayWindElement = elements.dayWindElement;
  this.nightWindElement = elements.nightWindElement;
  this.sunriseElement = elements.sunriseElement;
  this.sunsetElement = elements.sunsetElement;
}

ConditionsRenderer.prototype.render = function(data) {
  var current = data.current || {};
  var today = data.days && data.days.today;
  var dark = !!current.dark;
  var utcOffsetSeconds = this._getUtcOffsetSeconds(data.hours);

  this.bodyElement.className = dark ? 'dark' : '';
  this._setText(this.descriptionElement, current.description || 'Weather');
  this._setText(this.currentTemperatureElement, this._formatTemperature(current.temperature));
  this._setText(this.realFeelElement, this._formatTemperature(current.feelsLikeTemperature));
  this._setText(this.nowLabelElement, this._formatLabelTime(current.currentTime, utcOffsetSeconds));
  this._setIcon(this.iconElement, current.iconBaseUri, dark);

  if (!today) {
    this._setText(this.todayDescriptionElement, 'Day forecast');
    this._setText(this.todayLabelElement, '');
    this._setText(this.dayWindElement, '--');
    this._setText(this.nightWindElement, '--');
    this._setText(this.sunriseElement, '--');
    this._setText(this.sunsetElement, '--');
    this._setIcon(this.todayIconElement, '', dark);
    return;
  }

  this._setText(this.todayDescriptionElement, today.description || 'Day forecast');
  this._setText(this.todayLabelElement, today.dateLabel || '');
  this._setText(this.dayWindElement, this._formatWind(today.dayWindSpeed));
  this._setText(this.nightWindElement, this._formatWind(today.nightWindSpeed));
  this._setText(this.sunriseElement, this._formatTime(today.sunriseTime, utcOffsetSeconds) || '--');
  this._setText(this.sunsetElement, this._formatTime(today.sunsetTime, utcOffsetSeconds) || '--');
  this._setIcon(this.todayIconElement, today.iconBaseUri, dark);
};

ConditionsRenderer.prototype._setText = function(element, text) {
  if (!element) {
    return;
  }

  element.textContent = text;
};

ConditionsRenderer.prototype._setIcon = function(element, iconBaseUri, dark) {
  if (!element) {
    return;
  }

  if (!iconBaseUri) {
    element.src = './images/sharknado.svg';
    return;
  }

  element.src = iconBaseUri + (dark ? '_dark.svg' : '.svg');
};

ConditionsRenderer.prototype._formatTemperature = function(value) {
  if (typeof value !== 'number') {
    return '--';
  }

  return Math.round(value) + '\u00b0';
};

ConditionsRenderer.prototype._formatWind = function(value) {
  if (typeof value !== 'number') {
    return '--';
  }

  return Math.round(value) + ' mph';
};

ConditionsRenderer.prototype._formatLabelTime = function(value, utcOffsetSeconds) {
  return this._formatTime(value, utcOffsetSeconds) || '';
};

ConditionsRenderer.prototype._formatTime = function(value, utcOffsetSeconds) {
  var date;
  var utcTimeMs;
  var adjustedDate;

  if (!value) {
    return '';
  }

  date = new Date(value);

  if (isNaN(date.getTime())) {
    return '';
  }

  if (typeof utcOffsetSeconds !== 'number') {
    return '';
  }

  utcTimeMs = date.getTime() + (date.getTimezoneOffset() * 60 * 1000);
  adjustedDate = new Date(utcTimeMs + (utcOffsetSeconds * 1000));

  return this._padNumber(adjustedDate.getUTCHours()) + ':' + this._padNumber(adjustedDate.getUTCMinutes());
};

ConditionsRenderer.prototype._getUtcOffsetSeconds = function(hours) {
  var firstHour;

  if (!hours || !hours.length) {
    return null;
  }

  firstHour = hours[0];

  if (typeof firstHour.utcOffsetSeconds !== 'number') {
    return null;
  }

  return firstHour.utcOffsetSeconds;
};

ConditionsRenderer.prototype._padNumber = function(value) {
  if (value < 10) {
    return '0' + value;
  }

  return String(value);
};
