var configStore = new ConfigStore({
  windowObject: window
});

function trimString(value) {
  return String(value || '').replace(/^\s+|\s+$/g, '');
}

function normalizeConfig(rawConfig) {
  return {
    apiKey: trimString(rawConfig.apiKey),
    lat: trimString(rawConfig.lat),
    lon: trimString(rawConfig.lon)
  };
}

function isValidCoordinate(value) {
  return value !== '' && !isNaN(parseFloat(value));
}

function isValidConfig(config) {
  return !!(config.apiKey &&
    isValidCoordinate(config.lat) &&
    isValidCoordinate(config.lon));
}

function decodeQueryValue(value) {
  return decodeURIComponent(String(value || '').replace(/\+/g, ' '));
}

function getQueryValue(name) {
  var query = window.location.search;
  var pairs;
  var i;
  var parts;

  if (!query || query.length < 2) {
    return null;
  }

  pairs = query.substring(1).split('&');

  for (i = 0; i < pairs.length; i++) {
    parts = pairs[i].split('=');

    if (decodeQueryValue(parts[0]) === name) {
      return decodeQueryValue(parts.slice(1).join('='));
    }
  }

  return null;
}

function getQueryConfig() {
  return {
    apiKey: getQueryValue('apiKey') || getQueryValue('key') || '',
    lat: getQueryValue('lat') || '',
    lon: getQueryValue('lon') || getQueryValue('long') || ''
  };
}

document.addEventListener('DOMContentLoaded', function() {
  var configOverlay = new ConfigOverlay({
    formElement: document.getElementById('config-form'),
    apiKeyElement: document.getElementById('api-key'),
    latElement: document.getElementById('latitude'),
    lonElement: document.getElementById('longitude'),
    errorElement: document.getElementById('config-error')
  });

  configOverlay.prefill(configStore.getStoredConfig() || getQueryConfig());
  configOverlay.clearError();
  configOverlay.onSave(function(values) {
    var config = normalizeConfig(values);

    configOverlay.clearError();

    if (!isValidConfig(config)) {
      configOverlay.showError('Enter an API key plus numeric latitude and longitude values.');
      return;
    }

    configStore.saveStoredConfig(config);
    window.location.href = 'index.html';
  });
});
