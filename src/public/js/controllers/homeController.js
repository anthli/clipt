'use strict';

let timeoutPromise;
let globalClips = [];

const homeCtrl = function($scope, $location, $timeout, Clip) {
  $scope.clips = globalClips;
  $scope.clipDisplayCount = 10;
  $scope.busy = false;
  $scope.query = '';

  // Search for Clips using the query submitted by the user
  $scope.$watch('query', () => {
    $timeout.cancel(timeoutPromise);

    // If the query is empty, reset the Clips back to their original state
    if ($scope.query.length < 1) {
      $scope.clips = globalClips;
    }
    // Wait for the user to finish typing and the query is finalized before
    // filtering so that it isn't triggered on every keystroke
    else {
      timeoutPromise = $timeout(() => {
        $scope.clips = Clip.filterClips(globalClips, $scope.query);
        $scope.$digest();
      }, 500);
    }
  });

  // Load more clips when scrolled to the bottom of the list. This prevents
  // Clips from loading in all at once and slowing down the UI
  $scope.loadMoreClips = () => {
    $scope.clipDisplayCount += 10;
  };

  // Retrieve the starred_clip_id of the Clip at the given index
  $scope.isStarred = index => {
    return globalClips[index].starred_clip_id;
  };

  // Retrieve all Clips when the route changes
  $scope.$on('$routeChangeSuccess', () => {
    Clip.fetchAllClips();
  });

  // Copy the Clip at the given index
  $scope.copyClip = ($event, index) => {
    Clip.copyClip($event, globalClips[index]);
  };

  // Delete the Clip at the given index
  $scope.deleteClip = index => {
    Clip.deleteClip(globalClips[index], index);
  };

  // Check to see if the Clip should be starred or unstarred
  $scope.checkStar = index => {
    let clip = globalClips[index];

    // Star the Clip
    if (!clip.starred_clip_id) {
      Clip.starClip(clip, index);
    }
    // Unstar the Clip
    else {
      Clip.unstarClip(clip);
    }
  };

  // ipcRender configuration

  // Render the Clips that were received from the main process and notify
  // the main process that the Clips are ready to be displayed
  ipcRenderer.on(constants.Ipc.Clips, (event, clips) => {
    // Set the global Clips depending on the path of the current window
    switch ($location.path()) {
      case constants.Path.Home:
        globalClips = clips;

        break;

      // Filter out all clips that are not starred
      case constants.Path.Starred:
        globalClips = _.filter(clips, clip => clip.starred_clip_id);

        break;
    }

    // Signal the main process that the Clips are ready to be displayed
    ipcRenderer.send(constants.Ipc.ClipsReady);
    $scope.clips = globalClips;
    $scope.$digest();
  });

  // Delete the Clip from the list of Clips based on its id
  ipcRenderer.on(constants.Ipc.ClipDeleted, (event, id) => {
    _.remove(globalClips, clip => clip.id === id);
    $scope.$digest();
  });

  // Star the Clip at the given index by assigning its starredId
  ipcRenderer.on(constants.Ipc.ClipStarred, (event, id, starredId) => {
    _.each(globalClips, clip => {
      if (clip.id === id) {
        clip.starred_clip_id = starredId;
      }
    });

    $scope.clips = globalClips;
    $scope.$digest();
  });

  // Unstar the Clip at the given its id by setting its starred_clip_id to null
  ipcRenderer.on(constants.Ipc.ClipUnstarred, (event, starredId) => {
    _.each(globalClips, clip => {
      if (clip.starred_clip_id === starredId) {
        clip.starred_clip_id = null;
      }
    });

    // Delete it from the list of starred Clips
    if ($location.path() === constants.Path.Starred) {
      _.remove(globalClips, clip => !clip.starred_clip_id);
    }

    $scope.clips = globalClips;
    $scope.$digest();
  });
};

homeCtrl.$inject = ['$scope', '$location', '$timeout', 'Clip'];

app.controller(constants.Controller.Home, homeCtrl);