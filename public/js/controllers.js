'use strict';

const {ipcRenderer} = require('electron');

angular.module('clipt.controllers', [])

.controller('MainCtrl', ['$scope', ($scope) => {
  $scope.clips;
  $scope.index;
  $scope.search;

  // Get the index of the clip that was clicked on
  $scope.getClip = (index) => {
    $scope.index = index;
  };

  // Render the clips that were received from the main process
  ipcRenderer.on('clips', (event, clips) => {
    $scope.$apply(() => {
      $scope.clips = clips;

      // Notify the main process that the clips are ready to be displayed
      ipcRenderer.send('clips-ready');
    });
  });

  // When a clip is clicked on, send it back to the main process
  $(document).dblclick((event) => {
    // Ignore double-clicks that weren't inside the area of a clip
    if ($scope.index !== undefined) {
      ipcRenderer.send('clip-copied', $scope.clips[$scope.index]);
    }
  });
}]);