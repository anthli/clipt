'use strict';

const {
  app,
  globalShortcut,
  ipcMain,
} = require('electron');

const configuredBrowser = require('./lib/configureBrowser');
const clip = require('./lib/clip');
const clipboardWatcher = require('./lib/clipboardWatcher');
const constants = require('./lib/constants');
const db = require('./lib/db');
const configuredTray = require('./lib/configureTray');

let win;
let tray;

// Start the clipboard watcher
const watcher = clipboardWatcher({
  onTextChange: (text) => {
    // New clip containing the type, timestamp, and text
    let txtClip = clip(constants.clipType.text, {text: text});

    db.addClip(txtClip, (err, doc) => {
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

// Initialize the browser window
const createWindow = () => {
  win = configuredBrowser();

  // Retrieve all clips and send them to the renderer
  db.getClips((err, clips) => {
    if (err) {
      console.error(err);
      return;
    }

    // Send the clips to the renderer once it's finishsed loading
    win.webContents.on(constants.message.app.didFinishLoad, () => {
      win.webContents.send(constants.message.clip.clips, clips);
    });
  });

  // Dereference the window when it closes
  win.on(constants.message.app.closed, () => {
    win = null;
  });
}

// Initialize the application tray
const createTray = () => {
  tray = configuredTray();

  // Set up the tray actions based on the system platform
  switch (process.platform) {
    case constants.platform.mac:
      break;

    case constants.platform.win:
      // Open/close the window when the tray icon is double-clicked on
      tray.on(constants.message.tray.doubleClick, () => {
        win.isVisible() ? win.hide() : win.show();
      });

      break;
  }
}

// Initialize the application shortcuts
const createShortcuts = () => {
  // Open a new window or close the existing one when CommandOrControl+`
  // is pressed
  const open = globalShortcut.register(constants.shortcut.open.key, () => {
    // Toggles opening and closing the window
    if (win) {
      win.destroy();
    }
    else {
      createWindow();
    }
  });

  if (!open) {
    console.error(constants.shortcut.open.error);
  }
}

/* app configuration */

app.on(constants.message.app.ready, () => {
  createWindow();
  createTray();
  createShortcuts();
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
  if (!win.isVisible()) {
    win.show();
  }
});

// Delete the clip selected in the window and send the remaining clips back
// to be displayed
ipcMain.on(constants.message.clip.deleteClip, (event, id) => {
  db.deleteClip(id, (err, count) => {
    if (err) {
      console.error(err);
      return;
    }

    // Retrieve all clips and send them to the renderer
    db.getClips((err, clips) => {
      if (err) {
        console.error(err);
        return;
      }

      // Send the remaining clips to the renderer
      win.webContents.send(constants.message.clip.clips, clips);
    });
  });
});