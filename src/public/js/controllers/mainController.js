'use strict';

angular.module('clipt.controllers', [])

.controller('MainCtrl', ['$scope', 'Main', ($scope, Main) => {
  $scope.clips;
  $scope.search;

  // Copy the clip at the given index
  $scope.copyClip = ($event, index) => {
    // Prevent a double-click registering when rapidly deleting clips
    if (!angular.element($event.target).hasClass('delete-clip')) {
      Main.copyClip($scope.clips, index);
    }
  };

  // Delete the clip at the given index
  $scope.deleteClip = (index) => {
    Main.deleteClip($scope.clips, index);
  };

  // Render the clips that were received from the main process
  ipcRenderer.on('clips', (event, clips) => {
    $scope.$apply(() => {
      $scope.clips = clips;

      // Notify the main process that the clips are ready to be displayed
      ipcRenderer.send('clips-ready');
    });
  });
}]);