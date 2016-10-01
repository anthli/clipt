'use strict';

angular.module('clipt.services', [])

.factory('Clipt', () => {
  return {
    // When a clip is double-clicked on, send it back to the main process
    // for its data to be written to the clipboard
    copyClip: (clips, index) => {
      let popupContainer = $('#copy-popup-container');

      // Fade the popup message in at the cursor's position when copying a clip
      popupContainer.fadeIn(300);
      popupContainer.css({
        'display': 'flex',
        'left': event.pageX,
        'top': event.pageY
      });

      // Fade the popup message out after 750 ms
      setTimeout(() => {
        popupContainer.fadeOut(300);
      }, 750);

      ipcRenderer.send('clip-copied', clips[index]);
    },

    // When the trash icon is clicked, notify the main process that the clip it
    // belongs should be deleted
    deleteClip: (clips, index) => {
      ipcRenderer.send('delete-clip', clips[index]._id);
    }
  }
});