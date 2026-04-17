function ConditionEmoji() {}

ConditionEmoji.format = function(conditionType, isDaytime, style) {
  var conditionEmoji = ConditionEmoji._entry(conditionType);
  var emojiSet = conditionEmoji[style || 'interesting'] || conditionEmoji.interesting || {};

  if (!isDaytime && emojiSet.night) {
    return emojiSet.night;
  }

  return emojiSet.day || '';
};

ConditionEmoji.groupKey = function(conditionType, style) {
  var conditionEmoji = ConditionEmoji._entry(conditionType);
  var emojiSet = conditionEmoji[style || 'interesting'] || conditionEmoji.interesting || {};
  var variants = [];

  if (emojiSet.day) {
    variants.push(emojiSet.day);
  }

  if (emojiSet.night && emojiSet.night !== emojiSet.day) {
    variants.push(emojiSet.night);
  }

  variants.sort();

  return variants.join('|');
};

ConditionEmoji._entry = function(conditionType) {
  return ConditionEmoji.CONDITION_EMOJI[conditionType] || ConditionEmoji.CONDITION_EMOJI.TYPE_UNSPECIFIED;
};

ConditionEmoji.isPrecip = function(conditionType) {
  return !!ConditionEmoji.PRECIP_TYPES[conditionType];
};

ConditionEmoji.CONDITION_EMOJI = {
  TYPE_UNSPECIFIED: {
    interesting: { day: '🌡️', night: '🌡️' },
    boring: { day: '🌡️', night: '🌡️' }
  },
  CLEAR: {
    interesting: { day: '☀️', night: '🌃' },
    boring: { day: '☀️', night: '🌙' }
  },
  MOSTLY_CLEAR: {
    interesting: { day: '🌤️', night: '🌃' },
    boring: { day: '☀️', night: '🌙' }
  },
  PARTLY_CLOUDY: {
    interesting: { day: '⛅', night: '🌁' },
    boring: { day: '☁️', night: '☁️' }
  },
  MOSTLY_CLOUDY: {
    interesting: { day: '🌥️', night: '🌁' },
    boring: { day: '☁️', night: '☁️' }
  },
  CLOUDY: {
    interesting: { day: '☁️', night: '☁️' },
    boring: { day: '☁️', night: '☁️' }
  },
  WINDY: {
    interesting: { day: '💨', night: '💨' },
    boring: { day: '💨', night: '💨' }
  },
  WIND_AND_RAIN: {
    interesting: { day: '🔫', night: '🔫' },
    boring: { day: '🔫', night: '🔫' }
  },
  LIGHT_RAIN_SHOWERS: {
    interesting: { day: '🚿', night: '🚿' },
    boring: { day: '💦', night: '💦' }
  },
  CHANCE_OF_SHOWERS: {
    interesting: { day: '🌂', night: '🌂' },
    boring: { day: '💦', night: '💦' }
  },
  SCATTERED_SHOWERS: {
    interesting: { day: '🚿', night: '🚿' },
    boring: { day: '💦', night: '💦' }
  },
  RAIN_SHOWERS: {
    interesting: { day: '🚿', night: '🚿' },
    boring: { day: '💦', night: '💦' }
  },
  HEAVY_RAIN_SHOWERS: {
    interesting: { day: '🚿', night: '🚿' },
    boring: { day: '💦', night: '💦' }
  },
  LIGHT_TO_MODERATE_RAIN: {
    interesting: { day: '🌦️', night: '☔️' },
    boring: { day: '🌦️', night: '☔️' }
  },
  MODERATE_TO_HEAVY_RAIN: {
    interesting: { day: '🌧️', night: '🌧️' },
    boring: { day: '💦', night: '💦' }
  },
  RAIN: {
    interesting: { day: '🌧️', night: '🌧️' },
    boring: { day: '💦', night: '💦' }
  },
  LIGHT_RAIN: {
    interesting: { day: '🌦️', night: '💦' },
    boring: { day: '💦', night: '💦' }
  },
  HEAVY_RAIN: {
    interesting: { day: '🌧️', night: '🌧️' },
    boring: { day: '💦', night: '💦' }
  },
  RAIN_PERIODICALLY_HEAVY: {
    interesting: { day: '🌧️', night: '🌧️' },
    boring: { day: '💦', night: '💦' }
  },
  LIGHT_SNOW_SHOWERS: {
    interesting: { day: '🌨️', night: '🌨️' },
    boring: { day: '❄️', night: '❄️' }
  },
  CHANCE_OF_SNOW_SHOWERS: {
    interesting: { day: '🌨️', night: '🌨️' },
    boring: { day: '❄️', night: '❄️' }
  },
  SCATTERED_SNOW_SHOWERS: {
    interesting: { day: '🌨️', night: '🌨️' },
    boring: { day: '❄️', night: '❄️' }
  },
  SNOW_SHOWERS: {
    interesting: { day: '🌨️', night: '🌨️' },
    boring: { day: '❄️', night: '❄️' }
  },
  HEAVY_SNOW_SHOWERS: {
    interesting: { day: '🌨️', night: '🌨️' },
    boring: { day: '❄️', night: '❄️' }
  },
  LIGHT_TO_MODERATE_SNOW: {
    interesting: { day: '🌨️', night: '🌨️' },
    boring: { day: '❄️', night: '❄️' }
  },
  MODERATE_TO_HEAVY_SNOW: {
    interesting: { day: '🛷', night: '🛷' },
    boring: { day: '❄️', night: '❄️' }
  },
  SNOW: {
    interesting: { day: '🌨️', night: '🌨️' },
    boring: { day: '❄️', night: '❄️' }
  },
  LIGHT_SNOW: {
    interesting: { day: '🌨️', night: '🌨️' },
    boring: { day: '❄️', night: '❄️' }
  },
  HEAVY_SNOW: {
    interesting: { day: '⛷️', night: '⛷️' },
    boring: { day: '❄️', night: '❄️' }
  },
  SNOWSTORM: {
    interesting: { day: '☃️', night: '☃️' },
    boring: { day: '❄️', night: '❄️' }
  },
  SNOW_PERIODICALLY_HEAVY: {
    interesting: { day: '⛷️', night: '⛷️' },
    boring: { day: '❄️', night: '❄️' }
  },
  HEAVY_SNOW_STORM: {
    interesting: { day: '☃️', night: '☃️' },
    boring: { day: '❄️', night: '❄️' }
  },
  BLOWING_SNOW: {
    interesting: { day: '🏂', night: '🏂' },
    boring: { day: '❄️', night: '❄️' }
  },
  RAIN_AND_SNOW: {
    interesting: { day: '🍧', night: '🍧' },
    boring: { day: '💦', night: '💦' }
  },
  HAIL: {
    interesting: { day: '🧊', night: '🧊' },
    boring: { day: '🧊', night: '🧊' }
  },
  HAIL_SHOWERS: {
    interesting: { day: '🧊', night: '🧊' },
    boring: { day: '🧊', night: '🧊' }
  },
  THUNDERSTORM: {
    interesting: { day: '🌩️', night: '🌩️' },
    boring: { day: '⚡', night: '⚡' }
  },
  THUNDERSHOWER: {
    interesting: { day: '⛈️', night: '⛈️' },
    boring: { day: '⚡', night: '⚡' }
  },
  LIGHT_THUNDERSTORM_RAIN: {
    interesting: { day: '⛈️', night: '⛈️' },
    boring: { day: '⚡', night: '⚡' }
  },
  SCATTERED_THUNDERSTORMS: {
    interesting: { day: '⛈️', night: '⛈️' },
    boring: { day: '⚡', night: '⚡' }
  },
  HEAVY_THUNDERSTORM: {
    interesting: { day: '🌩️', night: '🌩️' },
    boring: { day: '⚡', night: '⚡' }
  }
};

ConditionEmoji.PRECIP_TYPES = {
  LIGHT_RAIN_SHOWERS: true,
  CHANCE_OF_SHOWERS: true,
  SCATTERED_SHOWERS: true,
  RAIN_SHOWERS: true,
  HEAVY_RAIN_SHOWERS: true,
  LIGHT_TO_MODERATE_RAIN: true,
  MODERATE_TO_HEAVY_RAIN: true,
  RAIN: true,
  LIGHT_RAIN: true,
  HEAVY_RAIN: true,
  RAIN_PERIODICALLY_HEAVY: true,
  LIGHT_SNOW_SHOWERS: true,
  CHANCE_OF_SNOW_SHOWERS: true,
  SCATTERED_SNOW_SHOWERS: true,
  SNOW_SHOWERS: true,
  HEAVY_SNOW_SHOWERS: true,
  LIGHT_TO_MODERATE_SNOW: true,
  MODERATE_TO_HEAVY_SNOW: true,
  SNOW: true,
  LIGHT_SNOW: true,
  HEAVY_SNOW: true,
  SNOWSTORM: true,
  SNOW_PERIODICALLY_HEAVY: true,
  HEAVY_SNOW_STORM: true,
  BLOWING_SNOW: true,
  RAIN_AND_SNOW: true,
  HAIL: true,
  HAIL_SHOWERS: true,
  THUNDERSTORM: true,
  THUNDERSHOWER: true,
  LIGHT_THUNDERSTORM_RAIN: true,
  SCATTERED_THUNDERSTORMS: true,
  HEAVY_THUNDERSTORM: true
};
