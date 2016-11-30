'use strict';

const titleBarFactory = () => {
  return {
    // When a title bar button is clicked, notify the main process of the button
    // so it can perform the appropriate action
    click: button => {
      ipcRenderer.send(constants.Ipc.TitleBarButtonClicked, button);
    }
  };
};

app.factory(constants.Service.TitleBar, titleBarFactory);