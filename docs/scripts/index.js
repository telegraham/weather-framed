var debug = true;
var useTestData = true;

var configStore = new ConfigStore({
  windowObject: window
});

document.addEventListener('DOMContentLoaded', function() {
  var appController = new AppController({
    configStore: configStore,
    weatherService: new WeatherService(debug),
    weatherDataStore: new WeatherDataStore(),
    forecastRenderer: new ForecastRenderer({
      tempsElement: document.getElementById('temps'),
      hoursElement: document.getElementById('hours'),
      precipsElement: document.getElementById('precips')
    }),
    conditionsRenderer: new ConditionsRenderer({
      nowLabelElement: document.getElementById('now-label'),
      descriptionElement: document.getElementById('description'),
      iconElement: document.getElementById('icon'),
      currentTemperatureElement: document.getElementById('current-temp'),
      realFeelElement: document.getElementById('real-feel'),
      todayLabelElement: document.getElementById('today-label'),
      todayDescriptionElement: document.getElementById('today-description'),
      todayIconElement: document.getElementById('today-icon'),
      dayWindElement: document.getElementById('day-wind'),
      nightWindElement: document.getElementById('night-wind'),
      sunriseElement: document.getElementById('sunrise-time'),
      sunsetElement: document.getElementById('sunset-time'),
      bodyElement: document.getElementById('body')
    }),
    emptyStateElement: document.getElementById('setup-banner'),
    useTestData: useTestData
  });

  appController.start();
});
