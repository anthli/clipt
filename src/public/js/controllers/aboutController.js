'use strict';

const aboutCtrl = function($scope) {
  // Get the version of the application
  $scope.appVersion = require('electron').remote.app.getVersion();

  // Signal the main process to open the given link
  $scope.openLink = (link) => {
    ipcRenderer.send(constants.Message.Ipc.OpenLink, link);
  };
};

aboutCtrl.$inject = ['$scope'];

app.controller('AboutCtrl', aboutCtrl);