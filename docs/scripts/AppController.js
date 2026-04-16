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

  var self = this;

  setTimeout(function(){
    setInterval(function(){
      self._loadWeather();
    }, 5 * 60 * 1000) // 5min
  }, AppController.msUntilFirstRefresh(new Date()));

  setTimeout(function () {
    window.location.reload();
  }, AppController.msUntilTotalRefresh(new Date()));
};

AppController.msUntilFirstRefresh = function(now){ 
  var currentMinute = now.getMinutes();
  var nextMinute = currentMinute - (currentMinute % 5) + 6;
  var next = new Date(now);

  next.setMinutes(nextMinute, 0, 0);

  return next.getTime() - now.getTime();
}

AppController.msUntilTotalRefresh = function(now) {
  var currentMinute = now.getMinutes();
  var next = new Date(now);

  next.setMinutes(42, 0, 0);

  if (currentMinute > 30) {
    next.setHours(next.getHours() + 1);
  }

  return next.getTime() - now.getTime();
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
