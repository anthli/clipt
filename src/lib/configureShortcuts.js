'use strict';

const {globalShortcut} = require('electron');

const constants = require('./constants');
const createWindow = require('./configureWindow');
const windowManager = require('./windowManager');

let win;

// Set up the shortcuts to be used by the application
module.exports = () => {
  const open = globalShortcut.register(constants.shortcut.open.key, () => {
    win = windowManager.getMainWindow();

    // Toggles opening and closing the window
    if (win) {
      win.destroy();
    } else {
      createWindow();
    }
  });

  if (!open) {
    console.error(constants.shortcut.open.error);
  }
}