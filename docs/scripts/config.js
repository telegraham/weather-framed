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

function getQueryConfig() {
  var params = new URLSearchParams(window.location.search);

  return {
    apiKey: params.get('apiKey') || params.get('key') || '',
    lat: params.get('lat') || '',
    lon: params.get('lon') || params.get('long') || ''
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
