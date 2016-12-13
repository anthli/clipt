'use strict';

const homeFactory = () => {
  return {
    // Signal the main process to retrieve all Clips
    fetchAllClips: () => {
      ipcRenderer.send(constants.Ipc.GetClips);
    },

    // When a Clip is clicked on, send the clip to the main process to be
    // written to the system clipboard
    copyClip: (event, clip) => {
      // Prevent copying when clicking on the Bookmark or Delete icons
      let elem = angular.element(event.target);

      if (!elem.hasClass('bookmark-icon') && !elem.hasClass('delete-icon')) {
        ipcRenderer.send(constants.Ipc.ClipCopied, clip);
      }
    },

    // When the delete icon is clicked, signal the main process that the Clip it
    // belongs should be deleted
    deleteClip: clipId => {
      ipcRenderer.send(constants.Ipc.DeleteClip, clipId);
    },

    // Send the Clip id and its index to
    bookmarkClip: clipId => {
      ipcRenderer.send(constants.Ipc.Bookmark, clipId);
    },

    // When the bookmark icon is clicked after being favorited, signal the main
    // process that the Clip it belongs to should be unfavorited
    deleteBookmark: bookmarkId => {
      ipcRenderer.send(constants.Ipc.DeleteBookmark, bookmarkId);
    },

    // Filter the given Clips by filtering out the ones that don't contain the
    // query in their text
    filterClips: (clips, query) => {
      return _.filter(clips, clip => clip.text.indexOf(query) > -1);
    }
  };
};

app.factory(constants.Service.Home, homeFactory);