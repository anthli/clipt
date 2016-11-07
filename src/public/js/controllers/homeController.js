'use strict';

const homeCtrl = function($scope, $location, Clip) {
  $scope.clips;
  $scope.clipDisplayCount = 10;
  $scope.busy = false;
  $scope.search = '';

  // Retrieve all Clips
  $scope.$on('$routeChangeSuccess', () => {
    Clip.fetchAllClips();

    // Render the Clips that were received from the main process and notify the
    // main process that the Clips are ready to be displayed
    ipcRenderer.on(constants.Ipc.Clips, (event, clips) => {
      // Set $scope.clips depending on the path of the current window
      switch ($location.path()) {
        case constants.Path.Home:
          $scope.clips = clips;

          break;

        // Filter out all clips that are not starred
        case constants.Path.Starred:
          $scope.clips = clips.filter((clip) => {
            return clip.starred_clip_id;
          });

          break;
      }

      ipcRenderer.send(constants.Ipc.ClipsReady);
      $scope.$digest();
    });
  });

  // Copy the Clip at the given index
  $scope.copyClip = ($event, index) => {
    Clip.copyClip($event, $scope.clips[index]);
  };

  // Delete the Clip at the given index
  $scope.deleteClip = (index) => {
    Clip.deleteClip($scope.clips[index], index);

    // Since the main process successfully deleted the Clip from the database,
    // delete the Clip from the client-side
    ipcRenderer.on(constants.Ipc.ClipDeleted, (event, id, index) => {
      _.remove($scope.clips, (clip) => clip.id === id);
      $scope.$digest();
    });
  };

  // Retrieve the starred_clip_id of the Clip at the given index
  $scope.isStarred = (index) => {
    return $scope.clips[index].starred_clip_id;
  };

  // Check to see if the Clip should be starred or unstarred
  $scope.checkStar = (index) => {
    let clip = $scope.clips[index];

    // Unstar the Clip
    if (clip.starred_clip_id) {
      Clip.unstarClip(clip, index);

      // Unstar the Clip at the given index by setting its starred_clip_id to
      // null and immediately delete it from the list of starred Clips
      ipcRenderer.on(constants.Ipc.ClipUnstarred, (event, starred_clip_id) => {
        _.each($scope.clips, (clip) => {
          if (clip.starred_clip_id === starred_clip_id) {
            clip.starred_clip_id = null;
          }
        });

        if ($location.path() === constants.Path.Starred) {
          _.remove($scope.clips, (clip) => !clip.starred_clip_id);
        }

        $scope.$digest();
      });
    }
    // Star the Clip
    else {
      Clip.starClip(clip, index);

      // Star the Clip at the given index by assigning its starred_clip_id
      ipcRenderer.on(constants.Ipc.ClipStarred, (event, id, index) => {
        $scope.clips[index].starred_clip_id = id;
        $scope.$digest();
      });
    }
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
};

homeCtrl.$inject = ['$scope', '$location', 'Clip'];

app.controller(constants.Controller.Home, homeCtrl);