var configStore = new ConfigStore({
  windowObject: window
});

document.addEventListener('DOMContentLoaded', function() {
  var resetOverlay = new ResetOverlay({
    ageElement: document.getElementById('reset-age'),
    buttonElement: document.getElementById('reset-button'),
    statusElement: document.getElementById('reset-status')
  });

  resetOverlay.renderAge(
    configStore.hasStoredConfig(),
    configStore.getSavedAt()
  );
  resetOverlay.setStatus('');
  resetOverlay.onClear(function() {
    configStore.clearStoredValues();
    resetOverlay.setAge('Local storage cleared.');
    resetOverlay.setStatus('Saved config removed. <a href="config.html">Set up weather again</a> or <a href="index.html">return to the forecast</a>.');
  });
});
