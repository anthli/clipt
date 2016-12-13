'use strict';

let timeoutPromise;
let globalClips = [];

const homeCtrl = function($scope, $location, $timeout, Home) {
  $scope.clips = globalClips;
  $scope.clipDisplayCount = 10;
  $scope.query = '';

  const update = () => {
    $scope.clips = globalClips;
    $scope.$digest();
  };

  // Retrieve all Clips when the route changes
  $scope.$on('$routeChangeSuccess', () => {
    Home.fetchAllClips();
  });

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
        $scope.clips = Home.filterClips(globalClips, $scope.query);
        $scope.$digest();
      }, 500);
    }
  });

  // Load more clips when scrolled to the bottom of the list. This prevents
  // Clips from loading in all at once and slowing down the UI
  $scope.loadMore = () => {
    console.log('loading more');
    $scope.clipDisplayCount += 10;
  };

  // Retrieve the Bookmark id of the Clip at the given index
  $scope.isBookmarked = index => {
    return $scope.clips[index].bookmark_id;
  };

  // Copy the Clip at the given index
  $scope.copyClip = ($event, index) => {
    Home.copyClip($event, $scope.clips[index]);
  };

  // Delete the Clip at the given index
  $scope.deleteClip = index => {
    Home.deleteClip($scope.clips[index].id);
  };

  // Check to see if the Bookmark should be added or deleted
  $scope.checkBookmark = index => {
    if (!Home.bookmark_id) {
      Home.bookmarkClip($scope.clips[index].id);
    }
    else {
      Home.deleteBookmark($scope.clips[index].bookmark_id);
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

      // Filter out all Clips that aren't Bookmarks
      case constants.Path.Bookmarks:
        globalClips = _.filter(clips, clip => Home.bookmark_id);

        break;
    }

    // Signal the main process that the Clips are ready to be displayed
    ipcRenderer.send(constants.Ipc.ReadyToDisplay);
    update();
  });

  // Delete the Clip from the list of Clips based on its id
  ipcRenderer.on(constants.Ipc.ClipDeleted, (event, clipId) => {
    _.remove(globalClips, clip => clip.id === clipId);

    update();
  });

  // Bookmark the Clip at the given index
  ipcRenderer.on(constants.Ipc.Bookmarked, (event, clipId, bookmarkId) => {
    _.each(globalClips, clip => {
      if (clip.id === clipId) {
        clip.bookmark_id = bookmarkId;
      }
    });

    update();
  });

  // Delete the Bookmark by assigning its id to null
  ipcRenderer.on(constants.Ipc.BookmarkDeleted, (event, bookmarkId) => {
    _.each(globalClips, clip => {
      if (clip.bookmark_id === bookmarkId) {
        clip.bookmark_id = null;
      }
    });

    // Delete it if the current view is the Bookmarks page
    if ($location.path() === constants.Path.Bookmark) {
      _.remove(globalClips, clip => !clip.bookmark_id);
    }

    update();
  });
};

homeCtrl.$inject = ['$scope', '$location', '$timeout', 'Home'];

app.controller(constants.Controller.Home, homeCtrl);