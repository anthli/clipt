'use strict';

const {
  BrowserWindow,
  Tray,
  Menu
} = require('electron');
const path = require('path');

const constants = require('./constants');

let tray;
let contextMenu;

// Set up the tray icon to be used with the app
module.exports = () => {
  // Detect which tray icon and context menu to use based on the system platform
  switch (process.platform) {
    case constants.platform.mac:
      tray = new Tray(path.normalize(constants.tray.icon.mac));

      contextMenu = Menu.buildFromTemplate([
        // Show
        {
          label: constants.tray.menu.label.show,
          type: constants.tray.menu.type.normal,
          click: () => {
            BrowserWindow.getAllWindows()[0].show();
          }
        },
        {type: constants.tray.menu.type.separator},
        // About Clipt
        {
          label: constants.tray.menu.label.about,
          type: constants.tray.menu.type.normal,
          role: constants.tray.menu.role.about
        },
        {type: constants.tray.menu.type.separator},
        // Preferences...
        {
          label: constants.tray.menu.label.preferences
        },
        {type: constants.tray.menu.type.separator},
        // Quit Clipt
        {
          label: constants.tray.menu.label.quit,
          type: constants.tray.menu.type.normal,
          role: constants.tray.menu.role.quit
        }
      ]);

      break;

    case constants.platform.win:
      tray = new Tray(path.normalize(constants.tray.icon.win));

      contextMenu = Menu.buildFromTemplate([
        // Show
        {
          label: constants.tray.menu.label.show,
          type: constants.tray.menu.type.normal,
          click: () => {
            BrowserWindow.getAllWindows()[0].show();
          }
        },
        {type: constants.tray.menu.type.separator},
        // Preferences...
        {
          label: constants.tray.menu.label.preferences
        },
        {type: constants.tray.menu.type.separator},
        // Quit Clipt
        {
          label: constants.tray.menu.label.quit,
          type: constants.tray.menu.type.normal,
          role: constants.tray.menu.role.quit
        }
      ]);

      break;
  }

  // Display the app's name when hovering over the tray icon
  tray.setToolTip(constants.appName);

  // Link the context menu to the tray icon
  tray.setContextMenu(contextMenu);

  return tray;
}