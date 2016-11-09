'use strict';

const {BrowserWindow} = require('electron');
const path = require('path');

const constants = require('./constants');
const windowManager = require('./windowManager');

// Set up the browser window to be used with the app
module.exports.start = () => {
  let win = new BrowserWindow({
    autoHideMenuBar: true,
    // frame: false,
    width: 800,
    height: 600,
    show: false,
    title: constants.AppName
  });

  // Load index.html
  win.loadURL(path.normalize(constants.Html.Index));

  // Dereference the window when it closes
  win.on(constants.App.Closed, () => {
    win = null;
    windowManager.setMainWindow(win);
  });

  // Store the main window in the window manager
  windowManager.setMainWindow(win);
};