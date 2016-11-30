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
    },

    // When the star icon is clicked, signal the main process that the Clip it
    // belongs to should be starred
    starClip: (clip, index) => {
      ipcRenderer.send(constants.Ipc.StarClip, clip.id, index);
    },

    // When the star icon is clicked after being starred, signal the main
    // process that the Clip it belongs to should be unstarred
    unstarClip: clip => {
      ipcRenderer.send(constants.Ipc.UnstarClip, clip.starred_clip_id);
    },

    // Filter the given Clips by filtering out the ones that don't contain the
    // query in their text
    filterClips: (clips, query) => {
      return _.filter(clips, clip => clip.text.indexOf(query) > -1);
    }
  };
};

app.factory(constants.Service.Clip, clipFactory);