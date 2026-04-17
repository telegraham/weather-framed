var debug = false;
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
      conditionEmojiElement: document.getElementById('condition-emoji'),
      descriptionElement: document.getElementById('description'),
      currentTemperatureElement: document.getElementById('current-temp'),
      realFeelElement: document.getElementById('real-feel'),
      currentWindElement: document.getElementById('current-wind'),
      currentHumidityElement: document.getElementById('current-humidity'),
      currentUvElement: document.getElementById('current-uv'),
      currentVisibilityElement: document.getElementById('current-visibility'),
      currentCloudCoverElement: document.getElementById('current-cloud-cover'),
      todayLabelElement: document.getElementById('today-label'),
      todayEmojiElement: document.getElementById('today-emoji'),
      todayDescriptionElement: document.getElementById('today-description'),
      dayWindElement: document.getElementById('day-wind'),
      dayHumidityElement: document.getElementById('day-humidity'),
      dayUvElement: document.getElementById('day-uv'),
      tonightEmojiElement: document.getElementById('tonight-emoji'),
      tonightDescriptionElement: document.getElementById('tonight-description'),
      nightWindElement: document.getElementById('night-wind'),
      nightHumidityElement: document.getElementById('night-humidity'),
      moonPhaseElement: document.getElementById('moon-phase'),
      nextMoonBulletElement: document.getElementById('next-moon-bullet'),
      nextMoonElement: document.getElementById('next-moon'),
      sunriseElement: document.getElementById('sunrise-time'),
      sunsetElement: document.getElementById('sunset-time'),
      moonriseElement: document.getElementById('moonrise-time'),
      moonsetElement: document.getElementById('moonset-time'),
      bodyElement: document.getElementById('body')
    }),
    emptyStateElement: document.getElementById('setup-banner'),
    useTestData: useTestData
  });

  appController.start();
});
