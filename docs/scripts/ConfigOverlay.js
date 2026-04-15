function ConfigOverlay(elements) {
  this.formElement = elements.formElement;
  this.apiKeyElement = elements.apiKeyElement;
  this.latElement = elements.latElement;
  this.lonElement = elements.lonElement;
  this.errorElement = elements.errorElement;
  this._saveListener = null;

  this._bindEvents();
}

ConfigOverlay.prototype._bindEvents = function() {
  var self = this;

  this.formElement.onsubmit = function(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    if (self._saveListener) {
      self._saveListener(self.getValues());
    }

    return false;
  };
};

ConfigOverlay.prototype.getValues = function() {
  return {
    apiKey: this.apiKeyElement.value,
    lat: this.latElement.value,
    lon: this.lonElement.value
  };
};

ConfigOverlay.prototype.prefill = function(values) {
  if (!values) {
    return;
  }

  if (typeof values.apiKey != "undefined" && values.apiKey !== null) {
    this.apiKeyElement.value = values.apiKey;
  }

  if (typeof values.lat != "undefined" && values.lat !== null) {
    this.latElement.value = values.lat;
  }

  if (typeof values.lon != "undefined" && values.lon !== null) {
    this.lonElement.value = values.lon;
  }
};

ConfigOverlay.prototype.clearError = function() {
  this.errorElement.innerHTML = "";
};

ConfigOverlay.prototype.showError = function(message) {
  this.errorElement.innerHTML = message || "";
};

ConfigOverlay.prototype.onSave = function(listener) {
  this._saveListener = listener;
};
