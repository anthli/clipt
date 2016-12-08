'use strict';

const {BrowserWindow} = require('electron');
const path = require('path');

const constants = require('./constants');
const windowManager = require('./windowManager');

// Set up the browser window to be used with the app
module.exports.start = () => {
  let win;
  let titleBarStyle;

  // Determine the title bar style based on the current operating system
  switch (process.platform) {
    // macOS
    case constants.Platform.Mac:
      win = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        title: constants.AppName,
        titleBarStyle: constants.TitleBar.Style.HiddenInset
      });

      break;

    // Windows
    case constants.Platform.Win:
      win = new BrowserWindow({
        autoHideMenuBar: true,
        frame: false,
        width: 800,
        height: 600,
        show: false,
        title: constants.AppName
      });

      break;
  }

  // Load index.html
  win.loadURL(path.normalize(constants.Html.Index));

  // Dereference the window when it closes
  win.on(constants.App.Closed, () => {
    win = null;
    windowManager.setMainWindow(win);
  });

  // Store the main window
  windowManager.setMainWindow(win);
};