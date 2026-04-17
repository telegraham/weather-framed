function ConditionsRenderer(elements) {
  this.bodyElement = elements.bodyElement;
  this.conditionEmojiElement = elements.conditionEmojiElement;
  this.descriptionElement = elements.descriptionElement;
  this.iconElement = elements.iconElement;
  this.currentTemperatureElement = elements.currentTemperatureElement;
  this.realFeelElement = elements.realFeelElement;
  this.nowLabelElement = elements.nowLabelElement;
  this.todayEmojiElement = elements.todayEmojiElement;
  this.todayDescriptionElement = elements.todayDescriptionElement;
  this.todayLabelElement = elements.todayLabelElement;
  this.todayIconElement = elements.todayIconElement;
  this.dayWindElement = elements.dayWindElement;
  this.nightWindElement = elements.nightWindElement;
  this.moonPhaseElement = elements.moonPhaseElement;
  this.sunriseElement = elements.sunriseElement;
  this.sunsetElement = elements.sunsetElement;
}

ConditionsRenderer.prototype.render = function(data) {
  var current = data.current || {};
  var today = data.days && data.days.today;
  var dark = !!current.dark;
  var utcOffsetSeconds = this._getUtcOffsetSeconds(data.hours);

  this.bodyElement.className = dark ? 'dark' : '';
  this._setText(this.conditionEmojiElement, this._formatConditionEmoji(current.conditionType, current.isDaytime));
  this._setText(this.descriptionElement, current.description || 'Weather');
  this._setText(this.currentTemperatureElement, this._formatTemperature(current.temperature));
  this._setText(this.realFeelElement, this._formatTemperature(current.feelsLikeTemperature));
  this._setText(this.nowLabelElement, this._formatLabelTime(current.currentTime, utcOffsetSeconds));
  this._setIcon(this.iconElement, current.iconBaseUri, dark);

  if (!today) {
    this._setText(this.todayEmojiElement, '');
    this._setText(this.todayDescriptionElement, 'Day forecast');
    this._setText(this.todayLabelElement, '');
    this._setText(this.dayWindElement, '--');
    this._setText(this.nightWindElement, '--');
    this._setText(this.moonPhaseElement, '--');
    this._setText(this.sunriseElement, '--');
    this._setText(this.sunsetElement, '--');
    this._setIcon(this.todayIconElement, '', dark);
    return;
  }

  this._setText(this.todayEmojiElement, this._formatConditionEmoji(today.conditionType, true));
  this._setText(this.todayDescriptionElement, today.description || 'Day forecast');
  this._setText(this.todayLabelElement, today.dateLabel || '');
  this._setText(this.dayWindElement, this._formatWind(today.dayWindSpeed));
  this._setText(this.nightWindElement, this._formatWind(today.nightWindSpeed));
  this._setText(this.moonPhaseElement, this._formatMoonPhase(today.moonPhase));
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

ConditionsRenderer.prototype._formatMoonPhase = function(value) {
  var symbol = ConditionsRenderer.MOON_PHASE_SYMBOLS[value];
  var label = ConditionsRenderer._titleCaseMoonPhase(value);

  if (!symbol && !label) {
    return '--';
  }

  if (!symbol) {
    return label;
  }

  if (!label) {
    return symbol;
  }

  return symbol + ' ' + label;
};

ConditionsRenderer.prototype._formatConditionEmoji = function(conditionType, isDaytime) {
  var conditionEmoji = ConditionsRenderer.CONDITION_EMOJI[conditionType] || ConditionsRenderer.CONDITION_EMOJI.TYPE_UNSPECIFIED;

  if (!conditionEmoji) {
    return '';
  }

  if (!isDaytime && conditionEmoji.night) {
    return conditionEmoji.night;
  }

  return conditionEmoji.day || '';
};

ConditionsRenderer.prototype._formatLabelTime = function(value, utcOffsetSeconds) {
  return this._formatTime(value, utcOffsetSeconds) || '';
};

ConditionsRenderer.prototype._formatTime = function(value, utcOffsetSeconds) {
  var date;
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

  adjustedDate = new Date(date.getTime() + (utcOffsetSeconds * 1000));

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

ConditionsRenderer._titleCaseMoonPhase = function(value) {
  if (!value) {
    return '';
  }

  return String(value).toLowerCase().split('_').map(function(word) {
    return word.charAt(0).toUpperCase() + word.substring(1);
  }).join(' ');
};

ConditionsRenderer.MOON_PHASE_SYMBOLS = {
  NEW_MOON: '\uD83C\uDF11',
  WAXING_CRESCENT: '\uD83C\uDF12',
  FIRST_QUARTER: '\uD83C\uDF13',
  WAXING_GIBBOUS: '\uD83C\uDF14',
  FULL_MOON: '\uD83C\uDF15',
  WANING_GIBBOUS: '\uD83C\uDF16',
  LAST_QUARTER: '\uD83C\uDF17',
  WANING_CRESCENT: '\uD83C\uDF18'
};

ConditionsRenderer.CONDITION_EMOJI = {
  TYPE_UNSPECIFIED: { day: '\uD83C\uDF21\uFE0F' },
  CLEAR: { day: '\u2600\uFE0F', night: '\uD83C\uDF03' },
  MOSTLY_CLEAR: { day: '\uD83C\uDF24\uFE0F', night: '\uD83C\uDF03' },
  PARTLY_CLOUDY: { day: '\u26C5', night: '\uD83C\uDF01' },
  MOSTLY_CLOUDY: { day: '\uD83C\uDF25\uFE0F', night: '\uD83C\uDF2B\uFE0F' },
  CLOUDY: { day: '\u2601\uFE0F' },
  WINDY: { day: '\uD83D\uDCA8' },
  WIND_AND_RAIN: { day: '\uD83D\uDD2B' },
  LIGHT_RAIN_SHOWERS: { day: '\uD83D\uDEBF' },
  CHANCE_OF_SHOWERS: { day: '\uD83C\uDF02' },
  SCATTERED_SHOWERS: { day: '\uD83D\uDEBF' },
  RAIN_SHOWERS: { day: '\uD83D\uDEBF' },
  HEAVY_RAIN_SHOWERS: { day: '\uD83D\uDEBF' },
  LIGHT_TO_MODERATE_RAIN: { day: '\uD83C\uDF26\uFE0F', night: '\u2614\uFE0F' },
  MODERATE_TO_HEAVY_RAIN: { day: '\uD83C\uDF27\uFE0F' },
  RAIN: { day: '\u2614\uFE0F' },
  LIGHT_RAIN: { day: '\uD83C\uDF26\uFE0F', night: '\u2614\uFE0F' },
  HEAVY_RAIN: { day: '\uD83C\uDF27\uFE0F' },
  RAIN_PERIODICALLY_HEAVY: { day: '\uD83C\uDF27\uFE0F' },
  LIGHT_SNOW_SHOWERS: { day: '\uD83C\uDF28\uFE0F' },
  CHANCE_OF_SNOW_SHOWERS: { day: '\uD83C\uDF28\uFE0F' },
  SCATTERED_SNOW_SHOWERS: { day: '\uD83C\uDF28\uFE0F' },
  SNOW_SHOWERS: { day: '\uD83C\uDF28\uFE0F' },
  HEAVY_SNOW_SHOWERS: { day: '\uD83C\uDF28\uFE0F' },
  LIGHT_TO_MODERATE_SNOW: { day: '\u2744\uFE0F' },
  MODERATE_TO_HEAVY_SNOW: { day: '\uD83D\uDEF7' },
  SNOW: { day: '\u2744\uFE0F' },
  LIGHT_SNOW: { day: '\uD83C\uDF28\uFE0F' },
  HEAVY_SNOW: { day: '\u26F7\uFE0F' },
  SNOWSTORM: { day: '\u2603\uFE0F' },
  SNOW_PERIODICALLY_HEAVY: { day: '\u26F7\uFE0F' },
  HEAVY_SNOW_STORM: { day: '\u2603\uFE0F' },
  BLOWING_SNOW: { day: '\uD83C\uDFC2' },
  RAIN_AND_SNOW: { day: '\uD83C\uDF67' },
  HAIL: { day: '\uD83E\uDDCA' },
  HAIL_SHOWERS: { day: '\uD83E\uDDCA' },
  THUNDERSTORM: { day: '\uD83C\uDF29\uFE0F' },
  THUNDERSHOWER: { day: '\u26C8\uFE0F' },
  LIGHT_THUNDERSTORM_RAIN: { day: '\u26C8\uFE0F' },
  SCATTERED_THUNDERSTORMS: { day: '\u26C8\uFE0F' },
  HEAVY_THUNDERSTORM: { day: '\u26A1' }
};
