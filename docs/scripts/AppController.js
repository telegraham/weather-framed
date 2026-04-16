function AppController(options) {
  options = options || {};

  this.configStore = options.configStore;
  this.weatherService = options.weatherService;
  this.forecastDataStore = options.forecastDataStore;
  this.forecastRenderer = options.forecastRenderer;
  this.conditionsRenderer = options.conditionsRenderer;
  this.emptyStateElement = options.emptyStateElement;
  this.useTestData = !!options.useTestData;
}

AppController.prototype.start = function() {
  this._bindForecastUpdates();
  this._renderSetupState();
  this._loadWeather();
};

AppController.prototype._bindForecastUpdates = function() {
  var self = this;

  this.forecastDataStore.onUpdate(function(data) {
    self.forecastRenderer.render(new Forecast(data));
  });
};

AppController.prototype._loadWeather = function() {
  var self = this;
  var storedConfig = this.configStore.getStoredConfig();
  var shouldUseTestData = !storedConfig && this.useTestData;

  if (!storedConfig && !shouldUseTestData) {
    return;
  }

  this.weatherService.load({
    onConditionsLoaded: function(conditionsData) {
      self.conditionsRenderer.render(conditionsData);
    },
    onHourlyLoaded: function(hourlyData) {
      self.forecastDataStore.addHourlyData(hourlyData);
    },
    onDailyLoaded: function(dailyData) {
      self.forecastDataStore.addDailyData(dailyData);
    }
  }, storedConfig, shouldUseTestData);
};

AppController.prototype._renderSetupState = function() {
  if (!this.emptyStateElement) {
    return;
  }

  if (this.configStore.hasStoredConfig()) {
    this.emptyStateElement.innerHTML = '';
    this.emptyStateElement.style.display = 'none';
    return;
  }

  this.emptyStateElement.style.display = 'block';
  this.emptyStateElement.innerHTML = 'Showing test data. <a href="config.html">Set up live weather</a> or <a href="reset.html">manage saved config</a>.';
};
