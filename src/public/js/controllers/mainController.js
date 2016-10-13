'use strict';

// Keep track of the current clips to prevent them from disappearing
// when changing scopes
let globalClips = [];

app.controller('MainCtrl', function($scope, $rootScope, $mdDialog, Main) {
  $scope.clips = globalClips;
  $scope.search = '';

  // Signal the main process to copy the clip at the given index
  $scope.copyClip = ($event, index) => {
    // Prevent a double-click registering when rapidly deleting clips
    if (!angular.element($event.target).hasClass('delete-clip')) {
      Main.copyClip($scope.clips, index);
    }
  };

  // Signal the main process to delete the clip at the given index
  $scope.deleteClip = (index) => {
    Main.deleteClip($scope.clips, index);
  };

  // Render the clips that were received from the main process
  ipcRenderer.on('clips', (event, clips) => {
    $scope.$apply(() => {
      globalClips = $scope.clips = clips;

      // Notify the main process that the clips are ready to be displayed
      ipcRenderer.send('clips-ready');
    });
  });

  // Since the main process successfully deleted the clip from the database,
  // delete the clip from the client-side
  ipcRenderer.on('clip-deleted', (event, index) => {
    $scope.$apply(() => {
      $scope.clips.splice(index, 1);
      globalClips = $scope.clips;
    });
  });

  // Open the About modal
  ipcRenderer.on('about', (event) => {
    $mdDialog.show({
      templateUrl: 'views/modals/about.html',
      controller: 'AboutCtrl',
      clickOutsideToClose: true
    });
  });
}).$inject = ['$scope', '$rootScope', '$mdDialog', 'Main'];