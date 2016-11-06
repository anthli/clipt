'use strict';

const {
  app,
  globalShortcut,
  ipcMain
} = require('electron');
const _ = require('lodash');
const jsonfile = require('jsonfile');
const path = require('path');

const checkPath = require('./checkPath');
const constants = require('./constants');
const createWindow = require('./configureWindow');
const windowManager = require('./windowManager');

let settings;
let win;

const userDataPath = app.getPath(constants.UserData);
const settingsDir = path.join(userDataPath, constants.UserDir);
const settingsPath = settingsDir + constants.SettingsFile;

// Register global shortcuts for the application
const registerGlobalShortcut = (task, shortcut) => {
  switch (task) {
    // Toggles opening and closing the window
    case constants.Shortcut.OpenCloseTask:
      const openClose = globalShortcut.register(shortcut, () => {
        win = windowManager.getMainWindow();

        if (win) {
          win.destroy();
        }
        else {
          createWindow();
        }
      });

      if (!openClose) {
        console.error(constants.Shortcut.OpenCloseError);
      }

      break;
  }
};

// Set up the shortcuts to be used by the application
module.exports = () => {
  // Create settings.json if it doesn't exist
  if (!checkPath(settingsDir, constants.SettingsFile)) {
    jsonfile.writeFileSync(settingsPath, {shortcuts: []}, {spaces: 2});
  }

  settings = jsonfile.readFileSync(settingsPath);

  // Register each task's shortcut
  _.each(settings.shortcuts, (obj) => {
    if (obj.shortcut) {
      registerGlobalShortcut(obj.task, obj.shortcut);
    }
  })

  // Send the settings to the renderer
  ipcMain.on(constants.Ipc.FetchSettings, (event) => {
    win = windowManager.getMainWindow();
    win.webContents.send(constants.Ipc.Settings, settings);
  });

  // Register the shortcut received from the renderer
  ipcMain.on(constants.Ipc.RegisterShortcut, (event, task, shortcut) => {
    if (_.find(settings.shortcuts, (obj) => obj.task === task)) {
      // Reassign the shortcut
      _.each(settings.shortcuts, (obj) => {
        if (obj.task === task) {
          // Unregister the current task's shortcut
          if (obj.shortcut !== '') {
            globalShortcut.unregister(obj.shortcut);
          }

          obj.shortcut = shortcut ? shortcut : '';
        }
      });

      // Re-register the task with its new shortcut
      if (shortcut) {
        registerGlobalShortcut(task, shortcut);
      }
    }
    // Add the shortcut since it didn't exist
    else {
      settings.shortcuts.push({task: task, shortcut: shortcut});
    }

    // Write the new settings to settings.json
    jsonfile.writeFile(settingsPath, settings, {spaces: 2}, (err) => {
      if (err) {
        console.error(err);
      }

      // When written to settings.json, send the settings to the rendere again
      win = windowManager.getMainWindow();
      win.webContents.send(constants.Ipc.Settings, settings);
    });
  });
}