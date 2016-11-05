'use strict';

const settingsFactory = () => {
  return {
    // Send the task and its shortcut to the main process for registration
    register: (task, shortcut) => {
      ipcRenderer.send(constants.Ipc.RegisterShortcut, task, shortcut);
    }
  }
};

app.factory('Settings', settingsFactory);