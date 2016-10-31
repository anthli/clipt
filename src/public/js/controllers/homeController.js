'use strict';

const homeCtrl = function($scope, $location, $mdDialog, Home) {
  $scope.clips;
  $scope.clipDisplayCount = 10;
  $scope.busy = false;
  $scope.search = '';

  // Retrieve all Clips
  $scope.$on('$routeChangeSuccess', () => {
    Home.getAllClips();
  });

  // Copy the Clip at the given index
  $scope.copyClip = ($event, index) => {
    Home.copyClip($event, $scope.clips[index]);
  };

  // Delete the Clip at the given index
  $scope.deleteClip = (index) => {
    Home.deleteClip($scope.clips[index], index);
  };

  // Retrieve the starred_clip_id of the Clip at the given index
  $scope.isStarred = (index) => {
    return $scope.clips[index].starred_clip_id;
  }

  // Check to see if the Clip should be starred or unstarred
  $scope.checkStar = (index) => {
    let clip = $scope.clips[index];

    // Unstar the Clip
    if (clip.starred_clip_id) {
      Home.unstarClip(clip, index);
      return;
    }

    // Star the Clip
    Home.starClip(clip, index);
  };

  // Load more clips when scrolled to the bottom of the list. This prevents
  // Clips from loading in all at once and slowing down the UI
  $scope.loadMoreClips = () => {
    if ($scope.busy) {
      return;
    }

    $scope.busy = true;
    $scope.clipDisplayCount += 10;
    $scope.busy = false;
  };

  // ipcRenderer Configuration

  // Render the Clips that were received from the main process and notify the
  // main process that the Clips are ready to be displayed
  ipcRenderer.on('clips', (event, clips) => {
    // Set $scope.clips depending on the path of the current window
    switch ($location.path()) {
      case '/':
        $scope.clips = clips;
        break;

      // Filter out all clips that are not starred
      case '/starred':
        $scope.clips = clips.filter((clip) => {
          return clip.starred_clip_id;
        });

        break;
    }

    ipcRenderer.send('clips-ready');
    $scope.$digest();
  });

  // Star the Clip at the given index by assigning its starred_clip_id
  ipcRenderer.on('clip-starred', (event, index, starred_clip_id) => {
    $scope.clips[index].starred_clip_id = starred_clip_id;
    $scope.$digest();
  });

  // Unstar the Clip at the given index by setting its starred_clip_id to null
  // and immediately delete it from the list of starred Clips
  ipcRenderer.on('clip-unstarred', (event, index) => {
    $scope.clips[index].starred_clip_id = null;

    if ($location.path() === '/starred') {
      $scope.clips.splice(index, 1);
    }

    $scope.$digest();
  });

  // Since the main process successfully deleted the Clip from the database,
  // delete the Clip from the client-side
  ipcRenderer.on('clip-deleted', (event, index) => {
    $scope.clips.splice(index, 1);
    $scope.$digest();
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

homeCtrl.$inject = ['$scope', '$location', '$mdDialog', 'Home'];

app.controller('HomeCtrl', homeCtrl);