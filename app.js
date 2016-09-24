'use strict';

const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const globalShortcut = require('electron').globalShortcut;
const clip = require('./lib/clip.js');
const clipboardWatcher = require('./lib/clipboardWatcher.js');
const db = require('./lib/db.js');

let win;

// Start the clipboard watcher
const watcher = clipboardWatcher({
  onTextChange: (text) => {
    // New clip containing the type, timestamp, and text
    let txtClip = clip('text', {text: text});

    db.addClip(txtClip, (err, doc) => {
      if (err) {
        console.error(err);

        return;
      }
    });
  },

  // onImageChange: (text, image) => {
  //   // New clip containing the type, timestamp, and image
  //   let imgClip = clip('image', {
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

// Initialize the BrowserWindow
const createWindow = () => {
  const {screen} = require('electron');
  let screenSize = screen.getPrimaryDisplay().workAreaSize;
  let cursorPos = screen.getCursorScreenPoint();

  // Configure the browser window and keep it closed until all required data has
  // been sent to the renderer
  win = new BrowserWindow({
    width: screenSize.width / 2,
    height: (screenSize.height * 2) / 3,
    x: cursorPos.x,
    y: cursorPos.y,
    show: false
  });

  // Load index.html
  win.loadURL(`file://${__dirname}/index.html`);

  // Retrieve all clips and send them to the renderer
  db.getClips((err, clips) => {
    if (err) {
      console.error(err);

      return;
    }

    // Send the clips to the renderer and show the window
    win.webContents.on('did-finish-load', () => {
      win.webContents.send('clips', clips);
      win.show();
    });
  });

  // Dereference the window when it closes
  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', () => {
  createWindow();

  // Open a new window or close the existing one when CommandOrControl+`
  // is pressed
  const openPressed = globalShortcut.register('CommandOrControl+`', (data) => {
    // Toggles opening and closing the window
    if (win) {
      win.destroy();
    }
    else {
      createWindow();
    }
  });

  if (!openPressed) {
    console.error('Failed to register CommandOrControl+`');
  }
});

// Close the window when it gets blurred
// app.on('browser-window-blur', () => {
//   if (win) {
//     win.destroy();
//   }
// });

app.on('activate', () => {
  // On macOS it is common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open
  if (!win) {
    createWindow();
  }
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  // Unregister all shortcuts used by the app
  globalShortcut.unregisterAll();

  // Stop the clipboard watcher
  watcher.stop();
});