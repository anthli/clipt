'use strict';

const homeCtrl = function($scope, $location, Clip) {
  $scope.clips = [];
  $scope.clipDisplayCount = 10;
  $scope.busy = false;
  $scope.search = '';

  // Load more clips when scrolled to the bottom of the list. This prevents
  // Clips from loading in all at once and slowing down the UI
  $scope.loadMoreClips = () => {
    $scope.clipDisplayCount += 10;
  };

  // Retrieve the starred_clip_id of the Clip at the given index
  $scope.isStarred = (index) => {
    return $scope.clips[index].starred_clip_id;
  };

  // Retrieve all Clips
  $scope.$on('$routeChangeSuccess', () => {
    Clip.fetchAllClips().then((clips) => {
      if (clips) {
        $scope.clips = clips;

        // Signal the main process that the Clips are ready to be displayed
        ipcRenderer.send(constants.Ipc.ClipsReady);
      }
    });
  });

  // Copy the Clip at the given index
  $scope.copyClip = ($event, index) => {
    Clip.copyClip($event, $scope.clips[index]);
  };

  // Delete the Clip at the given index
  $scope.deleteClip = (index) => {
    Clip.deleteClip($scope.clips[index], index).then((clips) => {
      if (clips) {
        $scope.clips = clips;
      }
    });
  };

  // Check to see if the Clip should be starred or unstarred
  $scope.checkStar = (index) => {
    let clip = $scope.clips[index];

    // Star the Clip
    if (!clip.starred_clip_id) {
      Clip.starClip(clip, index).then((clips) => {
        if (clips) {
          $scope.clips = clips;
        }
      });
    }
    // Unstar the Clip
    else {
      Clip.unstarClip(clip).then((clips) => {
        if (clips) {
          $scope.clips = clips;
        }
      });
    }
  };
};

homeCtrl.$inject = ['$scope', '$location', 'Clip'];

app.controller(constants.Controller.Home, homeCtrl);