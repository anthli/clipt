'use strict';

const {
  BrowserWindow,
  Menu,
  Tray
} = require('electron');
const path = require('path');

const constants = require('./constants');
const createWindow = require('./configureWindow');
const windowManager = require('./windowManager');

let tray;
let contextMenu;
let win;

// Set up the tray icon to be used with the app
module.exports = () => {
  // Detect which tray icon and context menu to use based on the system platform
  switch (process.platform) {
    // macOS
    case constants.Platform.Mac:
      tray = new Tray(path.normalize(constants.Tray.MacIcon));
      break;

    // Windows
    case constants.Platform.Win:
      tray = new Tray(path.normalize(constants.Tray.WinIcon));
      break;
  }

  // Set up the context menu for the tray icon
  contextMenu = Menu.buildFromTemplate([
    // Show
    {
      label: constants.Tray.Menu.ShowLabel,
      type: constants.Tray.Menu.TypeNormal,
      click: () => {
        win = windowManager.getMainWindow();

        if (win) {
          win.show();
        } else {
          createWindow();
        }
      }
    },
    {type: constants.Tray.Menu.TypeSeparator},
    // About Clipt
    {
      label: constants.Tray.Menu.AboutLabel,
      type: constants.Tray.Menu.TypeNormal,
      click: () => {
        win = windowManager.getMainWindow();

        if (win) {
          win.webContents.send(constants.Modal.About);
        }
      }
    },
    {type: constants.Tray.Menu.TypeSeparator},
    // Preferences...
    {
      label: constants.Tray.Menu.PreferencesLabel,
      type: constants.Tray.Menu.TypeNormal,
      click: () => {
        win = windowManager.getMainWindow();

        if (win) {
          // Set up the Settings modal window
          let settingsModal = new BrowserWindow({
            height: 400,
            modal: true,
            resizable: false,
            show: false,
            title: constants.AppName,
            width: 600
          });

          settingsModal.loadURL(constants.Html.Settings);

          // Show the Settings modal once ready
          settingsModal.once(constants.Modal.ReadyToShow, () => {
            settingsModal.show();
          });
        }
      }
    },
    {type: constants.Tray.Menu.TypeSeparator},
    // Quit Clipt
    {
      label: constants.Tray.Menu.QuitLabel,
      type: constants.Tray.Menu.TypeNormal,
      role: constants.Tray.Menu.QuitRole
    }
  ]);

  // Display the app's name when hovering over the tray icon
  tray.setToolTip(constants.AppName);

  // Link the context menu to the tray icon
  tray.setContextMenu(contextMenu);
}