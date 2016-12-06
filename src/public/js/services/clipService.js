'use strict';

const clipFactory = () => {
  return {
    // Signal the main process to retrieve all Clips
    fetchAllClips: () => {
      ipcRenderer.send(constants.Ipc.FetchClips);
    },

    // When a Clip is double-clicked on, send it back to the main process
    // for its data to be written to the clipboard
    copyClip: (event, clip) => {
      // Prevent a double-click registering when favoriting or deleting Clips
      let elem = angular.element(event.target);

      if (!elem.hasClass('favorite-clip') && !elem.hasClass('delete-clip')) {
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
    },

    // When the favorite icon is clicked, signal the main process that the Clip
    // it belongs to should be favorited
    favoriteClip: (clip, index) => {
      ipcRenderer.send(constants.Ipc.FavoriteClip, clip.id, index);
    },

    // When the favorite icon is clicked after being favorited, signal the main
    // process that the Clip it belongs to should be unfavorited
    unfavoriteClip: clip => {
      ipcRenderer.send(constants.Ipc.UnfavoriteClip, clip.favorite_clip_id);
    },

    // Filter the given Clips by filtering out the ones that don't contain the
    // query in their text
    filterClips: (clips, query) => {
      return _.filter(clips, clip => clip.text.indexOf(query) > -1);
    }
  };
};

app.factory(constants.Service.Clip, clipFactory);