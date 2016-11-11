'use strict';

const {
  app,
  globalShortcut
} = require('electron');
const mkdirp = require('mkdirp');

const clip = require('./utils/clip');
const clipboardWatcher = require('./utils/clipboardWatcher');
const configureIpcMain = require('./utils/configureIpcMain');
const configureWindow = require('./utils/configureWindow');
const configureShortcuts = require('./utils/configureShortcuts');
const configureTray = require('./utils/configureTray');
const constants = require('./utils/constants');
const db = require('./utils/db');
const windowManager = require('./utils/windowManager');

let win;

// Create the User data folder if it doesn't exist already
mkdirp.sync(constants.UserDataDir);
configureShortcuts.configure();
db.configure();

// Retrieve all Clips from the database and send them to the renderer if the
// application window is open
const sendClipsToRenderer = () => {
  win = windowManager.getMainWindow();
  if (win) {
    db.getClips((err, clips) => {
      if (err) {
        console.error(err);

        return;
      }

      win.webContents.send(constants.Ipc.Clips, clips);
    });
  }
};

// Start the clipboard watcher
const watcher = clipboardWatcher({
  onTextChange: (text) => {
    // New Clip containing the type, and text
    let textClip = clip(
      constants.ClipType.Text,
      {
        text: text
      }
    );

    db.upsertClip(textClip, (err) => {
      if (err) {
        console.error(err);

        return;
      }

      sendClipsToRenderer();
    });
  },

  onImageChange: (text, image) => {
    // Create a byte array from the image's bitmap
    let buf = image.toBitmap();
    let ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    let byteArr = new Uint8Array(
      buf.buffer,
      buf.byteOffset,
      buf.byteLength / Uint8Array.BYTES_PER_ELEMENT
    );

    // New Clip containing the type, text, and image
    let imgClip = clip(
      constants.ClipType.Image,
      {
        text: text,
        image: byteArr
      }
    );

    console.log(imgClip.text);
    console.log(imgClip.image);

    db.upsertClip(imgClip, (err) => {
      if (err) {
        console.error(err);

        return;
      }

      sendClipsToRenderer();
    });
  }
});

/* app configuration */

// Prevent multiple instances of the application from running
const secondInstance = app.makeSingleInstance((argv, workingDirectory) => {
  win = windowManager.getMainWindow();

  // Refocus the primary window
  if (win) {
    if (win.isMinimized()) {
      win.restore();
    }

    win.focus();
  }
  // Initialize a new window of the primary instance
  else {
    configureWindow.start();
  }
});

if (secondInstance) {
  app.quit();
}

app.on(constants.App.Ready, () => {
  // Initialize each component of the application
  configureIpcMain.start();
  configureWindow.start();
  configureShortcuts.start();
  configureTray.start();
});

// On macOS it is common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open
app.on(constants.App.Activate, () => {
  win = windowManager.getMainWindow();
  if (!win) {
    configureWindow.start();
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