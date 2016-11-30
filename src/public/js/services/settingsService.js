'use strict';

const settingsFactory = () => {
  return {
    // Send the task and its shortcut to the main process for registration
    registerShortcut: (task, shortcut) => {
      ipcRenderer.send(constants.Ipc.RegisterShortcut, task, shortcut);
    },

    // Send the new image type to the main process
    switchImageFormat: format => {
      ipcRenderer.send(constants.Ipc.SwitchImageFormat, format);
    }
  };
};

app.factory(constants.Service.Settings, settingsFactory);