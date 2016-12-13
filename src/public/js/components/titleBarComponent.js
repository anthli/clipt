'use strict';

// Determine which title bar to select based on the current operating system
const selectTitleBar = () => {
  let template = '';

  switch (process.platform) {
    case constants.Platform.Mac:
      template = `
        <div id="title-bar-container">
          <div id="full-title-bar"></div>
        </div>
      `;

      break;

    case constants.Platform.Win:
      template = `
        <div id="title-bar-container">
          <div id="short-title-bar">
            <div id="title-bar">
              <div id="title-bar-button-container">
                <button
                  id="minimize-button"
                  ng-click="click('minimize')"
                >
                  <span></span>
                </button>

                <button
                  id="maximize-button"
                  ng-click="click('maximize')"
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
                  ng-click="click('close')"
                >
                  <span></span>
                  <span></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      break;
  }

  return template;
};

const titleBarComponent = {
  controller: constants.Controller.TitleBar,
  template: selectTitleBar
};

app.component(constants.Component.TitleBar, titleBarComponent);