'use strict';

const aboutCtrl = function($scope) {
  // Get the version of the application
  $scope.appVersion = require('electron').remote.app.getVersion();
};

aboutCtrl.$inject = ['$scope'];

app.controller('AboutCtrl', aboutCtrl);