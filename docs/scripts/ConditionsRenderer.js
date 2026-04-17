function ConditionsRenderer(elements) {
  this.bodyElement = elements.bodyElement;
  this.conditionEmojiElement = elements.conditionEmojiElement;
  this.descriptionElement = elements.descriptionElement;
  this.currentTemperatureElement = elements.currentTemperatureElement;
  this.realFeelElement = elements.realFeelElement;
  this.currentWindElement = elements.currentWindElement;
  this.currentHumidityElement = elements.currentHumidityElement;
  this.currentUvElement = elements.currentUvElement;
  this.currentVisibilityElement = elements.currentVisibilityElement;
  this.currentCloudCoverElement = elements.currentCloudCoverElement;
  this.nowLabelElement = elements.nowLabelElement;
  this.todayEmojiElement = elements.todayEmojiElement;
  this.todayDescriptionElement = elements.todayDescriptionElement;
  this.todayLabelElement = elements.todayLabelElement;
  this.dayWindElement = elements.dayWindElement;
  this.dayHumidityElement = elements.dayHumidityElement;
  this.dayUvElement = elements.dayUvElement;
  this.tonightEmojiElement = elements.tonightEmojiElement;
  this.tonightDescriptionElement = elements.tonightDescriptionElement;
  this.nightWindElement = elements.nightWindElement;
  this.nightHumidityElement = elements.nightHumidityElement;
  this.moonPhaseElement = elements.moonPhaseElement;
  this.nextMoonBulletElement = elements.nextMoonBulletElement;
  this.nextMoonElement = elements.nextMoonElement;
  this.sunriseElement = elements.sunriseElement;
  this.sunsetElement = elements.sunsetElement;
  this.moonriseElement = elements.moonriseElement;
  this.moonsetElement = elements.moonsetElement;
}

ConditionsRenderer.prototype.render = function(data) {
  var current = data.current || {};
  var today = data.days && data.days.today;
  var dark = !!current.dark;
  var utcOffsetSeconds = this._getUtcOffsetSeconds(data.hours);

  this.bodyElement.className = dark ? 'dark' : '';
  this._setText(this.conditionEmojiElement, this._formatConditionEmoji(current.conditionType, current.isDaytime));
  this._setText(this.descriptionElement, current.description || 'Weather');
  this._setText(this.currentTemperatureElement, this._formatRoundedNumber(current.temperature));
  this._setText(this.realFeelElement, this._formatRoundedNumber(current.feelsLikeTemperature));
  this._setText(this.currentWindElement, this._formatRoundedNumber(current.windSpeed));
  this._setText(this.currentHumidityElement, this._formatRoundedNumber(current.relativeHumidity));
  this._setText(this.currentUvElement, this._formatRoundedNumber(current.uvIndex));
  this._setText(this.currentVisibilityElement, this._formatVisibility(current.visibilityMiles));
  this._setText(this.currentCloudCoverElement, this._formatRoundedNumber(current.cloudCover));
  this._setText(this.nowLabelElement, this._formatTime(current.currentTime, utcOffsetSeconds) || '');

  if (!today) {
    this._setText(this.todayEmojiElement, '');
    this._setText(this.todayDescriptionElement, 'Day forecast');
    this._setText(this.todayLabelElement, '');
    this._setText(this.dayWindElement, '--');
    this._setText(this.dayHumidityElement, '--');
    this._setText(this.dayUvElement, '--');
    this._setText(this.tonightEmojiElement, '');
    this._setText(this.tonightDescriptionElement, 'Night forecast');
    this._setText(this.nightWindElement, '--');
    this._setText(this.nightHumidityElement, '--');
    this._setText(this.moonPhaseElement, '--');
    this._hideNextMoon();
    this._setText(this.sunriseElement, '--');
    this._setText(this.sunsetElement, '--');
    this._setText(this.moonriseElement, '--');
    this._setText(this.moonsetElement, '--');
    return;
  }

  this._setText(this.todayEmojiElement, this._formatConditionEmoji(today.conditionType, true));
  this._setText(this.todayDescriptionElement, today.description || 'Day forecast');
  this._setText(this.todayLabelElement, today.dateLabel || '');
  this._setText(this.dayWindElement, this._formatRoundedNumber(today.dayWindSpeed));
  this._setText(this.dayHumidityElement, this._formatRoundedNumber(today.dayHumidity));
  this._setText(this.dayUvElement, this._formatRoundedNumber(today.dayUvIndex));
  this._setText(this.tonightEmojiElement, this._formatConditionEmoji(today.nightConditionType, false));
  this._setText(this.tonightDescriptionElement, today.nightDescription || 'Night forecast');
  this._setText(this.nightWindElement, this._formatRoundedNumber(today.nightWindSpeed));
  this._setText(this.nightHumidityElement, this._formatRoundedNumber(today.nightHumidity));
  this._renderMoonLine(today.moonPhase, data.days && data.days.nextMoon);
  this._setText(this.sunriseElement, this._formatTime(today.sunriseTime, utcOffsetSeconds) || '--');
  this._setText(this.sunsetElement, this._formatTime(today.sunsetTime, utcOffsetSeconds) || '--');
  this._setText(this.moonriseElement, this._formatTime(today.moonriseTime, utcOffsetSeconds) || '--');
  this._setText(this.moonsetElement, this._formatTime(today.moonsetTime, utcOffsetSeconds) || '--');
};

ConditionsRenderer.prototype._setText = function(element, text) {
  if (!element) {
    return;
  }

  element.textContent = text;
};

ConditionsRenderer.prototype._formatRoundedNumber = function(value) {
  if (typeof value !== 'number') {
    return '--';
  }

  return Math.round(value);
};

ConditionsRenderer.prototype._formatVisibility = function(value) {
  if (typeof value !== 'number') {
    return '--';
  }

  if (value === Math.round(value)) {
    return value;
  }

  return value.toFixed(1);
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
  return ConditionEmoji.format(conditionType, isDaytime);
};

ConditionsRenderer.prototype._renderNextMoon = function(nextMoon) {
  if (!nextMoon || !this.nextMoonElement || !ConditionsRenderer._nextMoonText(nextMoon)) {
    this._hideNextMoon();
    return;
  }

  if (this.nextMoonBulletElement) {
    this.nextMoonBulletElement.style.display = 'inline';
  }
  this._setText(this.nextMoonElement, ConditionsRenderer._nextMoonText(nextMoon));
};

ConditionsRenderer.prototype._hideNextMoon = function() {
  if (!this.nextMoonElement) {
    return;
  }

  if (this.nextMoonBulletElement) {
    this.nextMoonBulletElement.style.display = 'none';
  }
  this._setText(this.nextMoonElement, '');
};

ConditionsRenderer.prototype._renderMoonLine = function(moonPhase, nextMoon) {
  this._setText(this.moonPhaseElement, this._formatMoonPhase(moonPhase));
  this._renderNextMoon(nextMoon);
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

ConditionsRenderer._nextMoonText = function(nextMoon) {
  var parts = [];

  if (!nextMoon) {
    return '';
  }

  if (nextMoon.fullMoonDateLabel) {
    parts.push('full ' + nextMoon.fullMoonDateLabel);
  }

  if (nextMoon.newMoonDateLabel) {
    parts.push('new ' + nextMoon.newMoonDateLabel);
  }

  return parts.join('  ');
};

ConditionsRenderer.MOON_PHASE_SYMBOLS = {
  NEW_MOON: '🌑',
  WAXING_CRESCENT: '🌒',
  FIRST_QUARTER: '🌓',
  WAXING_GIBBOUS: '🌔',
  FULL_MOON: '🌕',
  WANING_GIBBOUS: '🌖',
  LAST_QUARTER: '🌗',
  WANING_CRESCENT: '🌘'
};
