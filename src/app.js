'use strict';

const {
  app,
  globalShortcut,
  ipcMain,
  shell
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

          win.webContents.send(constants.Message.Ipc.Clips, clips);
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
  //       return;
  //     }
  //   });
  // }
});

/* app configuration */

app.on(constants.Message.App.Ready, () => {
  // Initialize each component of the application
  createWindow();
  createShortcuts();
  createTray();
});

// Quit when all windows are closed
app.on(constants.Message.App.WindowsAllClosed, () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== constants.Platform.Mac) {
  //   app.quit();
  // }
});

app.on(constants.Message.App.Activate, () => {
  win = windowManager.getMainWindow();

  // On macOS it is common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open
  if (!win) {
    createWindow();
  }
});

app.on(constants.Message.App.WillQuit, () => {
  // Unregister all shortcuts used by the app
  globalShortcut.unregisterAll();

  // Stop the clipboard watcher
  watcher.stop();
});

/* ipcMain configuration */

ipcMain.on(constants.Message.TitleBar.ButtonClicked, (event, button) => {
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
ipcMain.on(constants.Message.Ipc.FetchClips, (event) => {
  win = windowManager.getMainWindow();

  db.getClips((err, clips) => {
    if (err) {
      console.error(err);
      return;
    }

    win.webContents.send(constants.Message.Ipc.Clips, clips);
  });
});

// If the browser window is closed, prevent it from opening before all of the
// clips are ready to be displayed
ipcMain.on(constants.Message.Ipc.ClipsReady, (event) => {
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

// Star the Clip selected in the window and send its index back to the
// renderer along with its starred_clip_id so it can star the Clip
ipcMain.on(constants.Message.Ipc.StarClip, (event, id, index) => {
  db.starClip(id, (err, clip) => {
    if (err) {
      console.error(err);
      return;
    }

    win.webContents.send(constants.Message.Ipc.ClipStarred, index, clip.id);
  });
});

// Unstar the Clip selected in the window and send its index back to the
// renderer so it can unstar the Clip
ipcMain.on(constants.Message.Ipc.UnstarClip, (event, id, index) => {
  db.unstarClip(id, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    win.webContents.send(constants.Message.Ipc.ClipUnstarred, index);
  });
});

// Delete the Clip selected in the window and send its index back to the
// renderer so it can delete the Clip
ipcMain.on(constants.Message.Ipc.DeleteClip, (event, id, index) => {
  db.deleteClip(id, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    win.webContents.send(constants.Message.Ipc.ClipDeleted, index);
  });
});

// Open the link in the desktop's default browser
ipcMain.on(constants.Message.Ipc.OpenLink, (event, link) => {
  shell.openExternal(link);
});