'use strict';

const {ipcRenderer} = require('electron');

angular.module('clipt.controllers', [])

.controller('MainCtrl', ['$scope', ($scope) => {
  $scope.clips;
  $scope.clipIndex;
  $scope.search;

  // Get the index of the clip that was clicked on
  $scope.getClip = (index) => {
    $scope.clipIndex = index;
  };

  // Render the clips that were received from the main process
  ipcRenderer.on('clips', (event, clips) => {
    $scope.$apply(() => {
      $scope.clips = clips;
    });
  });

  // When a clip is clicked on, send it back to the main process
  $(document).dblclick((event) => {
    // Ignore double-clicks that weren't inside the area of a clip
    if ($scope.clipIndex !== undefined) {
      ipcRenderer.send('clip-copied', $scope.clips[$scope.clipIndex]);
    }
  });
}]);