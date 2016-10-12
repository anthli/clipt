'use strict';

const {
  Menu,
  Tray
} = require('electron');
const path = require('path');

const constants = require('./constants');
const createWindow = require('./configureWindow');
const createShortcuts = require('./configureShortcuts');
const windowManager = require('./windowManager');

let tray;
let contextMenu;
let win;

// Set up the tray icon to be used with the app
module.exports = () => {
  // Detect which tray icon and context menu to use based on the system platform
  switch (process.platform) {
    // macOS
    case constants.platform.mac:
      tray = new Tray(path.normalize(constants.tray.icon.mac));
      break;

    // Windows
    case constants.platform.win:
      tray = new Tray(path.normalize(constants.tray.icon.win));
      break;
  }

  // Set up the context menu for the tray icon
  contextMenu = Menu.buildFromTemplate([
    // Show
    {
      label: constants.tray.menu.label.show,
      type: constants.tray.menu.type.normal,
      click: () => {
        win = windowManager.getMainWindow();

        if (win) {
          win.show();
        } else {
          createWindow();
        }
      }
    },
    {type: constants.tray.menu.type.separator},
    // About Clipt
    {
      label: constants.tray.menu.label.about,
      type: constants.tray.menu.type.normal,
      click: () => {
        win = windowManager.getMainWindow();

        if (win) {
          win.webContents.send(constants.modal.about);
        }
      }
    },
    {type: constants.tray.menu.type.separator},
    // Preferences...
    {
      label: constants.tray.menu.label.preferences,
      type: constants.tray.menu.type.normal,
      click: () => {
        win = windowManager.getMainWindow();

        if (win) {
          win.webContents.send(constants.modal.settings);
        }
      }
    },
    {type: constants.tray.menu.type.separator},
    // Quit Clipt
    {
      label: constants.tray.menu.label.quit,
      type: constants.tray.menu.type.normal,
      role: constants.tray.menu.role.quit
    }
  ]);

  // Display the app's name when hovering over the tray icon
  tray.setToolTip(constants.appName);

  // Link the context menu to the tray icon
  tray.setContextMenu(contextMenu);
}