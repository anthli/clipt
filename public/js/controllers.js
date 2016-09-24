'use strict';

const {ipcRenderer} = require('electron');

angular.module('clipt.controllers', [])

.controller('MainCtrl', ['$scope', ($scope) => {

  $scope.clips = [];
  $scope.search = '';

  // Set $scope.clips to the new list of clips received from the main process
  ipcRenderer.on('clips', (event, clips) => {
    $scope.$apply(() => {
      $scope.clips = clips;
    });
  });
}]);