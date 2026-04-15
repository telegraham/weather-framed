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

ResetOverlay.prototype.setStatus = function(message) {
  this.statusElement.innerHTML = message || "";
};

ResetOverlay.prototype.onClear = function(listener) {
  this._clearListener = listener;
};
