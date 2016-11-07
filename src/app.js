'use strict';

const {
  app,
  globalShortcut,
  ipcMain,
  shell
} = require('electron');

const clip = require('./utils/clip');
const clipboardWatcher = require('./utils/clipboardWatcher');
const constants = require('./utils/constants');
const createWindow = require('./utils/configureWindow');
const createShortcuts = require('./utils/configureShortcuts');
const createTray = require('./utils/configureTray');
const db = require('./utils/db');
const windowManager = require('./utils/windowManager');

let win;

// Start the clipboard watcher
const watcher = clipboardWatcher({
  onTextChange: (text) => {
    win = windowManager.getMainWindow();
    // New Clip containing the type, timestamp, and text
    let textClip = clip(constants.ClipType.Text, {text: text});

    db.addClip(textClip, (err, clip) => {
      if (err) {
        console.error(err);

        return;
      }

      // Only refresh the clips if the window is open and visible
      if (win) {
        db.getClips((err, clips) => {
          if (err) {
            console.error(err);

            return;
          }

          win.webContents.send(constants.Ipc.Clips, clips);
        });
      }
    });
  },

  // onImageChange: (text, image) => {
  //   win = windowManager.getMainWindow();
  //   // New Clip containing the type, timestamp, and image
  //   let imgClip = clip(constants.ClipType.Image, {
  //     text: text,
  //     image: image
  //   });
  //
  //   db.addClip(imgClip, (err, doc) => {
  //     if (err) {
  //       console.error(err);
  //
  //       return;
  //     }
  //   });
  // }
});

/* app configuration */

app.on(constants.App.Ready, () => {
  // Initialize each component of the application
  createWindow();
  createShortcuts();
  createTray();
});

app.on(constants.App.Activate, () => {
  win = windowManager.getMainWindow();

  // On macOS it is common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open
  if (!win) {
    createWindow();
  }
});

app.on(constants.App.WillQuit, () => {
  // Unregister all shortcuts used by the app
  globalShortcut.unregisterAll();

  // Stop the clipboard watcher
  watcher.stop();
});

// Don't quit the application when all windows are closed
app.on(constants.App.WindowsAllClosed, () => {});

/* ipcMain configuration */

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
// the starred Clip's id and index back to the renderer
ipcMain.on(constants.Ipc.StarClip, (event, id, index) => {
  db.starClip(id, (err, clip) => {
    if (err) {
      console.error(err);
      return;
    }

    win.webContents.send(constants.Ipc.ClipStarred, clip.id, index);
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