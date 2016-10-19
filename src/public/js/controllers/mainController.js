'use strict';

// Keep track of the current Clips to prevent them from disappearing
// when changing scopes
let globalClips = [];

const mainCtrl = function($scope, $location, $mdDialog, Main) {
  $scope.clips = globalClips;
  $scope.clipDisplayCount = 20;
  $scope.busy = false;
  $scope.search = '';

  // Load more clips when scrolled to the bottom of the list. This prevents
  // Clips from loading in all at once and slowing down the UI
  $scope.loadMoreClips = function() {
    if ($scope.busy) {
      return;
    }

    $scope.busy = true;
    $scope.clipDisplayCount += 10;
    $scope.busy = false;
  }

  // Signal the main process to copy the Clip at the given index
  $scope.copyClip = function($event, index) {
    Main.copyClip($event, $scope.clips[index]);
  };

  // Signal the main process to delete the Clip at the given index
  $scope.deleteClip = function(index) {
    Main.deleteClip($scope.clips[index], index);
  };

  // Check to see if the Clip should be starred or unstarred
  $scope.checkStar = function(index) {
    let clip = $scope.clips[index];

    // Unstar the Clip
    if (clip.starred_clip_id) {
      Main.unstarClip(clip, index);
      return;
    }

    // Star the Clip
    Main.starClip(clip, index);
  };

  // Retrieve the starred_clip_id of the Clip at the given index
  $scope.clipIsStarred = function(index) {
    return $scope.clips[index].starred_clip_id;
  }

  // Determine which set of Clips to show based on the current path
  $scope.checkCurrentPath = function(index) {
    switch ($location.path()) {
      // Home page shows all Clips
      case '/':
        return true;

      case '/starred':
        return $scope.clipIsStarred(index);
    }
  };

  // ipcRenderer Configuration

  // Render the Clips that were received from the main process and notify the
  // main process that the Clips are ready to be displayed
  ipcRenderer.on('clips', function(event, clips) {
    $scope.$apply(function() {
      globalClips = $scope.clips = clips;
      ipcRenderer.send('clips-ready');
    });
  });

  // Star the Clip at the given index by assigning its starred_clip_id
  ipcRenderer.on('clip-starred', function(event, index, starred_clip_id) {
    $scope.$apply(function() {
      $scope.clips[index].starred_clip_id = starred_clip_id;
      globalClips = $scope.clips;
    });
  });

  // Unstar the Clip at the given index by settings its starred_clip_id to null
  ipcRenderer.on('clip-unstarred', function(event, index) {
    $scope.$apply(function() {
      $scope.clips[index].starred_clip_id = null;
      globalClips = $scope.clips;
    });
  });

  // Since the main process successfully deleted the Clip from the database,
  // delete the Clip from the client-side
  ipcRenderer.on('clip-deleted', function(event, index) {
    $scope.$apply(function() {
      $scope.clips.splice(index, 1);
      globalClips = $scope.clips;
    });
  });

  // Open the About modal
  ipcRenderer.on('about', function(event) {
    $mdDialog.show({
      templateUrl: 'views/modals/about.html',
      controller: 'AboutCtrl',
      clickOutsideToClose: true
    });
  });
};

mainCtrl.$inject = ['$scope', '$location', '$mdDialog', 'Main'];

app.controller('MainCtrl', mainCtrl);