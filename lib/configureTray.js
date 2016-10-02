'use strict';

const {
  Tray,
  Menu
} = require('electron');
const constants = require('./constants');

let tray;

// Set up the tray icon to be used with the app
module.exports = () => {
  // Detect which icon to use based on the system platform
  switch (process.platform) {
    case constants.platform.mac:
      tray = new Tray(constants.trayIcon.mac);
      break;
    case constants.platform.win:
      tray = new Tray(constants.trayIcon.win);
      break;
  }

  // Set up the context menu for when the tray icon is clicked on
  const contextMenu = Menu.buildFromTemplate([{
    label: constants.trayMenu.label.about,
    type: constants.trayMenu.type.normal,
    role: constants.trayMenu.role.about
  }, {
    type: constants.trayMenu.type.separator
  }, {
    label: constants.trayMenu.label.preferences
  }, {
    type: constants.trayMenu.type.separator
  }, {
    label: constants.trayMenu.label.quit,
    type: constants.trayMenu.type.normal,
    role: constants.trayMenu.role.quit
  }]);

  tray.setToolTip(constants.appName);
  tray.setContextMenu(contextMenu);
  return tray;
}