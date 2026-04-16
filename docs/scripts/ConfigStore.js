function ConfigStore(options) {
  options = options || {};

  this.windowObject = options.windowObject || window;
  this.storageKeys = options.storageKeys || {
    apiKey: 'weatherFramedApiKey',
    lat: 'weatherFramedLat',
    lon: 'weatherFramedLon',
    savedAt: 'weatherFramedSavedAt'
  };
}

ConfigStore.prototype._getStoredValue = function(key) {
  try {
    return this.windowObject.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
};

ConfigStore.prototype._setStoredValue = function(key, value) {
  try {
    this.windowObject.localStorage.setItem(key, value);
  } catch (error) {
  }
};

ConfigStore.prototype.hasStoredConfig = function() {
  return !!(this._getStoredValue(this.storageKeys.apiKey) &&
    this._getStoredValue(this.storageKeys.lat) &&
    this._getStoredValue(this.storageKeys.lon));
};

ConfigStore.prototype.getStoredConfig = function() {
  if (!this.hasStoredConfig()) {
    return null;
  }

  return {
    apiKey: this._getStoredValue(this.storageKeys.apiKey),
    lat: this._getStoredValue(this.storageKeys.lat),
    lon: this._getStoredValue(this.storageKeys.lon)
  };
};

ConfigStore.prototype.saveStoredConfig = function(config) {
  this._setStoredValue(this.storageKeys.apiKey, config.apiKey);
  this._setStoredValue(this.storageKeys.lat, config.lat);
  this._setStoredValue(this.storageKeys.lon, config.lon);
  this._setStoredValue(this.storageKeys.savedAt, String((new Date()).getTime()));
};

ConfigStore.prototype.clearStoredValues = function() {
  try {
    this.windowObject.localStorage.clear();
  } catch (error) {
  }
};

ConfigStore.prototype.getSavedAt = function() {
  var savedAt = parseInt(this._getStoredValue(this.storageKeys.savedAt), 10);

  if (!savedAt) {
    return null;
  }

  return savedAt;
};
