'use strict';

let timeoutPromise;
let globalClips = [];

const homeCtrl = function($scope, $location, $timeout, Clip) {
  $scope.clips = globalClips;
  $scope.clipDisplayCount = 10;
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

  // Retrieve the favorite_clip_id of the Clip at the given index
  $scope.isFavorited = index => {
    return $scope.clips[index].favorite_clip_id;
  };

  // Retrieve all Clips when the route changes
  $scope.$on('$routeChangeSuccess', () => {
    Clip.fetchAllClips();
  });

  // Copy the Clip at the given index
  $scope.copyClip = ($event, index) => {
    Clip.copyClip($event, $scope.clips[index]);
  };

  // Delete the Clip at the given index
  $scope.deleteClip = index => {
    Clip.deleteClip($scope.clips[index], index);
  };

  // Check to see if the Clip should be favorited or unfavorited
  $scope.checkIfFavorited = index => {
    let clip = $scope.clips[index];

    // Favorite the Clip
    if (!clip.favorite_clip_id) {
      Clip.favoriteClip(clip, index);
    }
    // Unfavorite the Clip
    else {
      Clip.unfavoriteClip(clip);
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

      // Filter out all clips that are not favorited
      case constants.Path.Favorites:
        globalClips = _.filter(clips, clip => clip.favorite_clip_id);

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
  });

  // Favorite the Clip at the given index by assigning its favoriteId
  ipcRenderer.on(constants.Ipc.ClipFavorited, (event, id, favoritedId) => {
    _.each(globalClips, clip => {
      if (clip.id === id) {
        clip.favorite_clip_id = favoritedId;
      }
    });

    $scope.clips = globalClips;
    $scope.$digest();
  });

  // Unfavorite the Clip at the given its id by setting its favorite_clip_id to
  // null
  ipcRenderer.on(constants.Ipc.ClipUnfavorited, (event, favoriteId) => {
    _.each(globalClips, clip => {
      if (clip.favorite_clip_id === favoriteId) {
        clip.favorite_clip_id = null;
      }
    });

    // Delete it from the list of favorite Clips
    if ($location.path() === constants.Path.Favorite) {
      console.log('test');
      _.remove(globalClips, clip => !clip.favorite_clip_id);
    }

    $scope.clips = globalClips;
    $scope.$digest();
  });
};

homeCtrl.$inject = ['$scope', '$location', '$timeout', 'Clip'];

app.controller(constants.Controller.Home, homeCtrl);