'use strict';

app.factory('TitleBar', function() {
  return {
    // When a title bar button is clicked, notify the main process of the button
    // so it can perform the appropriate action
    clickTitleBarButton: function(button) {
      ipcRenderer.send('title-bar-button-clicked', button);
    }
  }
});