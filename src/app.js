'use strict';

const {
  app,
  globalShortcut,
  ipcMain,
  nativeImage,
  shell
} = require('electron');
const mkdirp = require('mkdirp');

const clip = require('./utils/clip');
const clipboardWatcher = require('./utils/clipboardWatcher');
const configureWindow = require('./utils/configureWindow');
const configureSettings = require('./utils/configureSettings');
const configureTray = require('./utils/configureTray');
const constants = require('./utils/constants');
const db = require('./utils/db');
const settingsManager = require('./utils/settingsManager');
const windowManager = require('./utils/windowManager');

let win;

// Create the User data folder if it doesn't exist already
mkdirp.sync(constants.UserDataDir);
configureSettings.configure();
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
  onTextChange: text => {
    // New Clip containing the type, and text
    let textClip = clip(
      constants.ClipType.Text,
      {
        text: text
      }
    );

    db.upsertClip(textClip, err => {
      if (err) {
        console.error(err);

        return;
      }

      sendClipsToRenderer();
    });
  },

  onImageChange: (text, image) => {
    let imageFormat = settingsManager.getSettings().imageFormat;
    // Create a byte array from the image's bitmap
    let buf;

    // Retrive the image's buffer depending on its format
    switch (imageFormat) {
      case constants.ImageFormat.Jpg:
        buf = image.toJPEG(100);

        break;

      case constants.ImageFormat.Png:
        buf = image.toPNG();

        break;
    }

    // New Clip containing the type, text, and image's bitmap
    let imgClip = clip(
      constants.ClipType.Image,
      {
        text: text,
        image: buf
      }
    );

    db.upsertClip(imgClip, err => {
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
  configureWindow.start();
  configureSettings.start();
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

//
// ipcMain Configuration
//

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
ipcMain.on(constants.Ipc.GetClips, event => {
  win = windowManager.getMainWindow();

  db.getClips((err, clips) => {
    if (err) {
      console.error(err);

      return;
    }

    win.webContents.send(constants.Ipc.Clips, clips);
  });
});

// Retrieve all Bookmarks from the database and send them to the renderer
ipcMain.on(constants.Ipc.GetBookmarks, event => {
  win = windowManager.getMainWindow();

  db.getBookmarks((err, bookmarks) => {
    if (err) {
      console.error(err);

      return;
    }

    win.webContents.send(constants.Ipc.Bookmarks, bookmarks);
  });
});

// If the browser window is closed, prevent it from opening before all of the
// Clips or Bookmarks are ready to be displayed
ipcMain.on(constants.Ipc.ReadyToDisplay, event => {
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
    win.webContents.openDevTools();
  }
});

// Delete the Clip selected in the application window based on its id and send
// the id back to the renderer
ipcMain.on(constants.Ipc.DeleteClip, (event, id) => {
  db.deleteClip(id, err => {
    if (err) {
      console.error(err);

      return;
    }

    win.webContents.send(constants.Ipc.ClipDeleted, id);
  });
});

// Bookmark the Clip selected in the application window based on the Clip's id
// and send the Bookmark's id back to the renderer
ipcMain.on(constants.Ipc.Bookmark, (event, id) => {
  db.insertBookmark(id, (err, bookmark) => {
    if (err) {
      console.error(err);

      return;
    }

    win.webContents.send(constants.Ipc.Bookmarked, id, bookmark.id);
  });
});

// Remove the Bookmark selected in the application window based on its id
ipcMain.on(constants.Ipc.DeleteBookmark, (event, bookmarkId) => {
  db.deleteBookmark(bookmarkId, err => {
    if (err) {
      console.error(err);

      return;
    }

    win.webContents.send(constants.Ipc.BookmarkDeleted, bookmarkId);
  });
});

// Open the link in the desktop's default browser
ipcMain.on(constants.Ipc.OpenLink, (event, link) => shell.openExternal(link));