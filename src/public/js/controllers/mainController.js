'use strict';

// Keep track of the current clips to prevent them from disappearing
// when changing scopes
let globalClips = [];

const mainCtrl = function($scope, $rootScope, $mdDialog, Main) {
  $scope.clips = globalClips;
  $scope.search = '';
  $scope.clipDisplayCount = 20;
  $scope.busy = false;

  // Load more clips when scrolled to the bottom of the list
  $scope.loadMoreClips = () => {
    if ($scope.busy) {
      return;
    }

    $scope.busy = true;
    $scope.clipDisplayCount += 10;
    $scope.busy = false;
  }

  // Signal the main process to copy the clip at the given index
  $scope.copyClip = ($event, index) => {
    Main.copyClip($event, $scope.clips[index]);
  };

  // Signal the main process to start the clip at the given index
  $scope.starClip = (index) => {
    Main.starClip($scope.clips[index]);
  }

  // Signal the main process to delete the clip at the given index
  $scope.deleteClip = (index) => {
    Main.deleteClip($scope.clips[index], index);
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
};

mainCtrl.$inject = ['$scope', '$rootScope', '$mdDialog', 'Main'];

app.controller('MainCtrl', mainCtrl);