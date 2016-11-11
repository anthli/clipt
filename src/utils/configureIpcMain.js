'use strict';

const {
  ipcMain,
  shell
} = require('electron');

const constants = require('./constants');
const db = require('./db');
const windowManager = require('./windowManager');

let win;

module.exports.start = () => {
  ipcMain.on(constants.Ipc.TitleBarButtonClicked, (event, button) => {
    win = windowManager.getMainWindow();

    if (win) {
      switch (button) {
        case constants.TitleBar.Close:
          win.close();

          break;

        case constants.TitleBar.Maximize:
          if (win.isMaximized()) {
            win.unmaximize();
          }
          else {
            win.maximize();
          }

          break;

        case constants.TitleBar.Minimize:
          win.minimize();

          break;
      }
    }
  });

  // Retrieve all Clips from the database and send them to the renderer
  ipcMain.on(constants.Ipc.FetchClips, (event) => {
    win = windowManager.getMainWindow();

    db.getClips((err, clips) => {
      if (err) {
        console.error(err);

        return;
      }

      win.webContents.send(constants.Ipc.Clips, clips);
    });
  });

  // If the browser window is closed, prevent it from opening before all of the
  // clips are ready to be displayed
  ipcMain.on(constants.Ipc.ClipsReady, (event) => {
    win = windowManager.getMainWindow();

    if (win) {
      // Ignore showing the window if it's minimized
      if (win.isMinimized()) {
        return;
      }

      // Ignore showing the window if it's visible and out of focus to prevent
      // it from appearing and hovering over all other windows
      if (win.isVisible() && !win.isFocused()) {
        return;
      }

      win.show();
    }
  });

  // Delete the Clip selected in the application window based on its id and send
  // the id back to the renderer
  ipcMain.on(constants.Ipc.DeleteClip, (event, id) => {
    db.deleteClip(id, (err) => {
      if (err) {
        console.error(err);

        return;
      }

      win.webContents.send(constants.Ipc.ClipDeleted, id);
    });
  });

  // Star the Clip selected in the application window based on its id and send
  // the starred Clip's id and starred id back to the renderer
  ipcMain.on(constants.Ipc.StarClip, (event, id, index) => {
    db.starClip(id, (err, starredClip) => {
      if (err) {
        console.error(err);

        return;
      }

      win.webContents.send(constants.Ipc.ClipStarred, id, starredClip.id);
    });
  });

  // Unstar the Clip selected in the application window based on its id and send
  // its id back to the renderer
  ipcMain.on(constants.Ipc.UnstarClip, (event, id) => {
    db.unstarClip(id, (err) => {
      if (err) {
        console.error(err);

        return;
      }

      win.webContents.send(constants.Ipc.ClipUnstarred, id);
    });
  });

  // Open the link in the desktop's default browser
  ipcMain.on(constants.Ipc.OpenLink, (event, link) => shell.openExternal(link));
};