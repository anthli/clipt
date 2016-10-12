'use strict';

// Keep track of the current clips to prevent them from disappearing
// when changing scopes
let globalClips = [];

app.controller('MainCtrl', function($scope, $rootScope, $mdDialog, Main) {
  $scope.clips = globalClips;
  $scope.search = '';

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
      globalClips = $scope.clips = clips;

      // Notify the main process that the clips are ready to be displayed
      ipcRenderer.send('clips-ready');
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

  // Open the Settings modal
  ipcRenderer.on('settings', (event) => {
    $mdDialog.show({
      templateUrl: 'views/modals/settings.html',
      controller: 'SettingsCtrl'
    });
  });
}).$inject = ['$scope', '$rootScope', '$mdDialog', 'Main'];