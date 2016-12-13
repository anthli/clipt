import {ipcRenderer} from 'electron';
import React from 'react';

import constants from '../utils/constants';

export default class TitleBar extends React.Component {
  click(button) {
    ipcRenderer.send(constants.Ipc.TitleBarButtonClicked, button);
  }

  render() {
    let titleBar;

    // Determine whether to use custom title bar buttons
    switch (process.platform) {
      case constants.Platform.Mac:
        titleBar = (
          <div id="full-title-bar"></div>
        );

        break;

      case constants.Platform.Win:
        titleBar = (
          <div id="short-title-bar">
            <div id="title-bar-button-container">
              <button
                id="minimize-button"
                onClick={() => this.click('minimize')}
              >
                <span></span>
              </button>
              <button
                id="maximize-button"
                onClick={() => this.click('maximize')}
              >
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </button>
              <button
                id="close-button"
                onClick={() => this.click('close')}
              >
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        );

        break;
    }

    return (
      <div id="title-bar-container">
        {titleBar}
      </div>);
  }
}