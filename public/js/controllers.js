'use strict';

const ipcRenderer = require('electron').ipcRenderer;

angular.module('clipt.controllers', [])

.controller('MainCtrl', ['$scope', ($scope) => {
  $scope.clips;
  $scope.clipIndex;
  $scope.search;

  // Get the index of the clip that was clicked on
  $scope.getClip = (index) => {
    $scope.clipIndex = index;
  };

  // Set $scope.clips to the new list of clips received from the main process
  ipcRenderer.on('clips', (event, clips) => {
    $scope.$apply(() => {
      $scope.clips = clips;
    });
  });

  // When a clip is clicked on, send it back to the main process
  $(document).on('click', (event) => {
    ipcRenderer.send('clip-copied', $scope.clips[$scope.clipIndex]);
  });
}]);