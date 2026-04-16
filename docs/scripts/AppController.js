function AppController(options) {
  options = options || {};

  this.configStore = options.configStore;
  this.weatherService = options.weatherService;
  this.weatherDataStore = options.weatherDataStore;
  this.forecastRenderer = options.forecastRenderer;
  this.conditionsRenderer = options.conditionsRenderer;
  this.emptyStateElement = options.emptyStateElement;
  this.useTestData = !!options.useTestData;
}

AppController.prototype.start = function() {
  this._bindWeatherUpdates();
  this._renderSetupState();
  this._loadWeather();
};

AppController.prototype._bindWeatherUpdates = function() {
  var self = this;

  this.weatherDataStore.onUpdate(function(data) {
    self.conditionsRenderer.render(data);

    if (!data.hours) {
      return;
    }

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
      self.weatherDataStore.addCurrentData(conditionsData);
    },
    onHourlyLoaded: function(hourlyData) {
      self.weatherDataStore.addHourlyData(hourlyData);
    },
    onDailyLoaded: function(dailyData) {
      self.weatherDataStore.addDailyData(dailyData);
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
