function ResetOverlay(elements) {
  this.ageElement = elements.ageElement;
  this.buttonElement = elements.buttonElement;
  this.statusElement = elements.statusElement;
  this._clearListener = null;

  this._bindEvents();
}

ResetOverlay.prototype._bindEvents = function() {
  var self = this;

  this.buttonElement.onclick = function() {
    if (self._clearListener) {
      self._clearListener();
    }

    return false;
  };
};

ResetOverlay.prototype.setAge = function(message) {
  this.ageElement.innerHTML = message || "";
};

ResetOverlay.prototype.renderAge = function(hasStoredConfig, savedAt) {
  if (!hasStoredConfig) {
    this.setAge('No saved local storage config found.');
    return;
  }

  this.setAgeFromSavedAt(savedAt);
};

ResetOverlay.prototype.setAgeFromSavedAt = function(savedAt) {
  var elapsedMs;
  var minuteMs = 60 * 1000;
  var hourMs = 60 * minuteMs;
  var dayMs = 24 * hourMs;

  if (!savedAt) {
    this.setAge('Saved config found, but no timestamp is available.');
    return;
  }

  elapsedMs = (new Date()).getTime() - savedAt;

  if (elapsedMs < minuteMs) {
    this.setAge('Saved less than a minute ago.');
    return;
  }

  if (elapsedMs < hourMs) {
    this.setAge('Saved ' + Math.floor(elapsedMs / minuteMs) + ' minute(s) ago.');
    return;
  }

  if (elapsedMs < dayMs) {
    this.setAge('Saved ' + Math.floor(elapsedMs / hourMs) + ' hour(s) ago.');
    return;
  }

  this.setAge('Saved ' + Math.floor(elapsedMs / dayMs) + ' day(s) ago.');
};

ResetOverlay.prototype.setStatus = function(message) {
  this.statusElement.innerHTML = message || "";
};

ResetOverlay.prototype.onClear = function(listener) {
  this._clearListener = listener;
};
