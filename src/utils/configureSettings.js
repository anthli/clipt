'use strict';

const {
  app,
  globalShortcut,
  ipcMain
} = require('electron');
const _ = require('lodash');
const jsonfile = require('jsonfile');
const path = require('path');

const constants = require('./constants');
const configureWindow = require('./configureWindow');
const settingsManager = require('./settingsManager');
const windowManager = require('./windowManager');

let globalSettings;
let win;

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
          configureWindow.start();
        }
      });

      if (!openClose) {
        console.error(constants.Shortcut.OpenCloseError);
      }

      break;
  }
};

// Write the given settings to settings.json
const writeSettingsJson = (settings) => {
  jsonfile.writeFile(constants.SettingsPath, settings, {spaces: 2}, (err) => {
    if (err) {
      console.error(err);

      return;
    }

    // When written to settings.json, send the settings to the renderer
    win = windowManager.getMainWindow();
    win.webContents.send(constants.Ipc.Settings, settings);
  });
};

module.exports.configure = () => {
  // Retrieve the settings file
  try {
    globalSettings = jsonfile.readFileSync(constants.SettingsPath);
  }
  // Create it since it doesn't exist yet
  catch (err) {
    jsonfile.writeFileSync(constants.SettingsPath, {}, {spaces: 2});
    globalSettings = jsonfile.readFileSync(constants.SettingsPath);
  }

  settingsManager.setSettings(globalSettings);
};

// Set up the settings to be used by the application
module.exports.start = () => {
  // Register each task's shortcut
  _.each(globalSettings.shortcuts, (obj) => {
    if (obj.shortcut) {
      registerGlobalShortcut(obj.task, obj.shortcut);
    }
  });

  // Send the settings to the renderer
  ipcMain.on(constants.Ipc.FetchSettings, (event) => {
    win = windowManager.getMainWindow();
    win.webContents.send(constants.Ipc.Settings, globalSettings);
  });

  // Register the shortcut received from the renderer
  ipcMain.on(constants.Ipc.RegisterShortcut, (event, task, shortcut) => {
    if (_.find(globalSettings.shortcuts, (obj) => obj.task === task)) {
      // Reassign the shortcut
      _.each(globalSettings.shortcuts, (obj) => {
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
      if (globalSettings.shortcuts) {
        globalSettings.shortcuts.push({task: task, shortcut: shortcut});
      }
      else {
        globalSettings.shortcuts = [{task: task, shortcut: shortcut}];
      }
    }

    writeSettingsJson(globalSettings);
  });

  // Assign the image format received from the renderer
  ipcMain.on(constants.Ipc.SwitchImageFormat, (event, format) => {
    globalSettings.imageFormat = format;
    writeSettingsJson(globalSettings);
  });
};