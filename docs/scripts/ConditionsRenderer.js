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

  this.bodyElement.className = dark ? 'dark' : '';
  this._setText(this.descriptionElement, current.description || 'Weather');
  this._setText(this.currentTemperatureElement, this._formatTemperature(current.temperature));
  this._setText(this.realFeelElement, this._formatTemperature(current.feelsLikeTemperature));
  this._setText(this.nowLabelElement, this._formatLabelTime(current.currentTime));
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
  this._setText(this.sunriseElement, this._formatTime(today.sunriseTime) || '--');
  this._setText(this.sunsetElement, this._formatTime(today.sunsetTime) || '--');
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

ConditionsRenderer.prototype._formatLabelTime = function(value) {
  return this._formatTime(value) || '';
};

ConditionsRenderer.prototype._formatTime = function(value) {
  var date;

  if (!value) {
    return '';
  }

  date = new Date(value);

  if (isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit'
  });
};
