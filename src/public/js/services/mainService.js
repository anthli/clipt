'use strict';

app.factory('Main', function() {
  return {
    // When a clip is double-clicked on, send it back to the main process
    // for its data to be written to the clipboard
    copyClip: function(event, clip) {
      // Prevent a double-click registering when starring or deleting clips
      let elem = angular.element(event.target);
      if (elem.hasClass('star-clip') || elem.hasClass('delete-clip')) {
        return;
      }

      // Fade the popup message in at the cursor's position when copying a clip
      let popupContainer = $('#copy-popup-container');
      popupContainer.fadeIn(150);
      popupContainer.css({
        'display': 'flex',
        'left': event.pageX,
        'top': event.pageY
      });

      // Fade the popup message out after 750 ms
      setTimeout(function() {
        popupContainer.fadeOut(150);
      }, 500);

      ipcRenderer.send('clip-copied', clip);
    },

    // When the trash icon is clicked, notify the main process that the clip it
    // belongs should be deleted
    deleteClip: function(clip, index) {
      ipcRenderer.send('delete-clip', clip.id, index);
    },

    // When the star icon is clicked, notify the main process that the clip it
    // belongs to should be starred
    starClip: function(clip, index) {
      ipcRenderer.send('star-clip', clip.id, index);
    },

    // When the star icon is clicked after being starred, notify the main
    // process that the clip it belongs to should be unstarred
    unstarClip: function(clip, index) {
      ipcRenderer.send('unstar-clip', clip.starred_clip_id, index);
    }
  }
});