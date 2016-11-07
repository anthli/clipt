'use strict';

const clipFactory = ($location, $q) => {
  let allClips = [];

  return {
    getClips: () => {
      return allClips;
    },

    // Signal the main process to retrieve all Clips
    fetchAllClips: () => {
      ipcRenderer.send(constants.Ipc.FetchClips);

      return $q((resolve, reject) => {
        // Render the Clips that were received from the main process and notify
        // the main process that the Clips are ready to be displayed
        ipcRenderer.on(constants.Ipc.Clips, (event, clips) => {
          // Set $scope.clips depending on the path of the current window
          switch ($location.path()) {
            case constants.Path.Home:
              allClips = clips;

              break;

            // Filter out all clips that are not starred
            case constants.Path.Starred:
              allClips = _.filter(clips, (clip) => clip.starred_clip_id);

              break;
          }

          if (event) {
            resolve(allClips);
          }
          else {
            reject(null);
          }
        });
      });
    },

    // When a Clip is double-clicked on, send it back to the main process
    // for its data to be written to the clipboard
    copyClip: (event, clip) => {
      // Prevent a double-click registering when starring or deleting Clips
      let elem = angular.element(event.target);
      if (!elem.hasClass('star-clip') && !elem.hasClass('delete-clip')) {
        // Fade the popup message in at the cursor's position when copying a
        // Clip
        let popupContainer = $('#copy-popup-container');
        popupContainer.fadeIn(150);
        popupContainer.css({
          'display': 'flex',
          'left': event.pageX,
          'top': event.pageY
        });

        // Fade the popup message out after 750 ms
        setTimeout(() => {
          popupContainer.fadeOut(150);
        }, 500);

        ipcRenderer.send(constants.Ipc.ClipCopied, clip);
      }
    },

    // When the trash icon is clicked, signal the main process that the Clip it
    // belongs should be deleted
    deleteClip: (clip, index) => {
      ipcRenderer.send(constants.Ipc.DeleteClip, clip.id, index);

      return $q((resolve, reject) => {
        // Delete the Clip from the list of Clips based on its id
        ipcRenderer.on(constants.Ipc.ClipDeleted, (event, id) => {
          _.remove(allClips, (clip) => clip.id === id);

          if (event) {
            resolve(allClips);
          }
          else {
            reject(null);
          }
        });
      });
    },

    // When the star icon is clicked, signal the main process that the Clip it
    // belongs to should be starred
    starClip: (clip, index) => {
      ipcRenderer.send(constants.Ipc.StarClip, clip.id, index);

      return $q((resolve, reject) => {
        // Star the Clip at the given index by assigning its starredId
        ipcRenderer.on(constants.Ipc.ClipStarred, (event, id, starredId) => {
          _.each(allClips, (clip) => {
            if (clip.id === id) {
              clip.starred_clip_id = starredId;
            }
          });

          if (event) {
            resolve(allClips);
          }
          else {
            reject(null);
          }
        });
      });
    },

    // When the star icon is clicked after being starred, signal the main
    // process that the Clip it belongs to should be unstarred
    unstarClip: (clip) => {
      ipcRenderer.send(constants.Ipc.UnstarClip, clip.starred_clip_id);

      return $q((resolve, reject) => {
        // Unstar the Clip at the given its id by setting its starred_clip_id
        // to null
        ipcRenderer.on(constants.Ipc.ClipUnstarred, (event, starredId) => {
          _.each(allClips, (clip) => {
            if (clip.starred_clip_id === starredId) {
              clip.starred_clip_id = null;
            }
          });

          // Delete it from the list of starred Clips
          if ($location.path() === constants.Path.Starred) {
            _.remove(allClips, (clip) => !clip.starred_clip_id);
          }

          if (event) {
            resolve(allClips);
          }
          else {
            reject(null);
          }
        });
      });
    }
  };
};

clipFactory.$inject = ['$location', '$q'];

app.factory(constants.Service.Clip, clipFactory);