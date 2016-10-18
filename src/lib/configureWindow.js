'use strict';

const {BrowserWindow} = require('electron');
const path = require('path');

const constants = require('./constants');
const db = require('./db');
const windowManager = require('./windowManager');

// Set up the browser window to be used with the app
module.exports = () => {
  let win = new BrowserWindow({
    frame: false,
    width: 640,
    height: 480,
    show: false,
    title: constants.appName
  });

  // Load index.html
  win.loadURL(path.normalize(constants.indexHtml));

  // Retrieve all clips and send them to the renderer
  db.getClips((err, clips) => {
    if (err) {
      console.error(err);
      return;
    }

    // Send the clips to the renderer once it's finished loading
    win.webContents.on(constants.message.app.didFinishLoad, () => {
      win.webContents.send(constants.message.clip.clips, clips);
    });
  });

  // Dereference the window when it closes
  win.on(constants.message.app.closed, () => {
    win = null;
    windowManager.setMainWindow(win);
  });

  // Store the main window in the window manager
  windowManager.setMainWindow(win);
}