'use strict';

const {BrowserWindow} = require('electron');
const path = require('path');

const constants = require('./constants');
const windowManager = require('./windowManager');

// Set up the browser window to be used with the app
module.exports = () => {
  let win = new BrowserWindow({
    frame: false,
    width: 768,
    height: 576,
    show: false,
    title: constants.appName
  });

  // Load index.html
  win.loadURL(path.normalize(constants.indexHtml));

  // Dereference the window when it closes
  win.on(constants.message.app.closed, () => {
    win = null;
    windowManager.setMainWindow(win);
  });

  // Store the main window in the window manager
  windowManager.setMainWindow(win);
}