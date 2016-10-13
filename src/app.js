'use strict';

const {
  app,
  globalShortcut,
  ipcMain,
} = require('electron');

const clip = require('./lib/clip');
const clipboardWatcher = require('./lib/clipboardWatcher');
const constants = require('./lib/constants');
const createWindow = require('./lib/configureWindow');
const createShortcuts = require('./lib/configureShortcuts');
const createTray = require('./lib/configureTray');
const db = require('./lib/db');
const windowManager = require('./lib/windowManager');

let win;

// Start the clipboard watcher
const watcher = clipboardWatcher({
  onTextChange: (text) => {
    win = windowManager.getMainWindow();
    // New clip containing the type, timestamp, and text
    let txtClip = clip(constants.clipType.text, {text: text});

    db.addClip(txtClip, (err, row) => {
      if (err) {
        console.error(err);
        return;
      }

      // Only refresh the clips if the window is open
      if (win) {
        db.getClips((err, clips) => {
          if (err) {
            console.error(err);
            return;
          }

          win.webContents.send(constants.message.clip.clips, clips);
        });
      }
    });
  },

  // onImageChange: (text, image) => {
  //   win = windowManager.getMainWindow();
  //   // New clip containing the type, timestamp, and image
  //   let imgClip = clip(constants.clipType.image, {
  //     text: text,
  //     image: image
  //   });
  //
  //   db.addClip(imgClip, (err, doc) => {
  //     if (err) {
  //       console.error(err);
  //       return;
  //     }
  //   });
  // }
});

/* app configuration */

app.on(constants.message.app.ready, () => {
  // Initialize each component of the application
  createWindow();
  createShortcuts();
  createTray();

  win = windowManager.getMainWindow();
});

// Quit when all windows are closed
app.on(constants.message.app.windowsAllClosed, () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== constants.platform.mac) {
  //   app.quit();
  // }
});

app.on(constants.message.app.activate, () => {
  // On macOS it is common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open
  if (!win) {
    createWindow();
    createShortcuts();
    createTray();
  }
});

app.on(constants.message.app.willQuit, () => {
  // Unregister all shortcuts used by the app
  globalShortcut.unregisterAll();

  // Stop the clipboard watcher
  watcher.stop();
});

/* ipcMain configuration */

// If the browser window is closed, prevent it from opening before all of the
// clips are ready to be displayed
ipcMain.on(constants.message.clip.clipsReady, (event) => {
  win = windowManager.getMainWindow();

  if (!win.isVisible()) {
    win.show();
  }
});

// Delete the clip selected in the window and send its index back to the
// renderer so it can delete the clip on the client-side
ipcMain.on(constants.message.clip.deleteClip, (event, id, index) => {
  db.deleteClip(id, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    win.webContents.send(constants.message.clip.clipDeleted, index);
  });
});