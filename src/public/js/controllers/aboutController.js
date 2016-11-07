'use strict';

const aboutCtrl = function($scope, $mdDialog) {
  // Get the version of the application
  $scope.appVersion = require('electron').remote.app.getVersion();

  // Signal the main process to open the given link
  $scope.openLink = (link) => {
    ipcRenderer.send(constants.Ipc.OpenLink, link);
  };

  ipcRenderer.on(constants.Ipc.AboutModal, (event) => {
    $mdDialog.show({
      templateUrl: constants.Html.About,
      clickOutsideToClose: true,
      controller: function() {this.scope = $scope},
      controllerAs: constants.Controller.About
    });
  });
};

aboutCtrl.$inject = ['$scope', '$mdDialog'];

app.controller(constants.Controller.About, aboutCtrl);