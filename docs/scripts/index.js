var debug = true;
var useTestData = true;

var configStore = new ConfigStore({
  windowObject: window
});

document.addEventListener('DOMContentLoaded', function() {
  var appController = new AppController({
    configStore: configStore,
    weatherService: new WeatherService(debug),
    forecastDataStore: new ForecastDataStore(),
    forecastRenderer: new ForecastRenderer({
      tempsElement: document.getElementById('temps'),
      hoursElement: document.getElementById('hours'),
      precipsElement: document.getElementById('precips')
    }),
    conditionsRenderer: new ConditionsRenderer({
      description: document.getElementById('description'),
      icon: document.getElementById('icon'),
      bodyElement: document.getElementById('body')
    }),
    emptyStateElement: document.getElementById('setup-banner'),
    useTestData: useTestData
  });

  appController.start();
});
