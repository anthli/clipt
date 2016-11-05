'use strict';

const Accelerators = constants.Accelerators;
const Modifiers = constants.Modifiers;
const Actions = constants.Actions;

let shortcuts = [];

const settingsCtrl = function($scope, Settings) {
  // Lists of each key pressed when configuring a shortcut
  let accelerators = [];
  let modifiers = [];
  let actions = [];
  $scope.shortcuts = shortcuts;

  // Reset every field and the task's shortcut if it exists
  const reset = () => {
    accelerators = [];
    modifiers = [];
    actions = [];

    let task = $(document.activeElement).attr('id');
    if (task) {
      Settings.register(task, null);
    }
  };

  // Source: https://goo.gl/25tloa
  // Register the created shortcut
  const registerShortcut = () => {
    let task = $(document.activeElement).attr('id');

    // Make sure a shortcut input field is selected to register a shortcut
    if (task) {
      if (accelerators.length > 0) {
        modifiers.sort();
        actions.sort();

        if (actions.length > 0) {
          let shortcut = [accelerators.join('+')];

          if (modifiers.length > 0) {
            shortcut.push(modifiers.join('+'));
          }

          shortcut.push(actions.join('+'));
          Settings.register(task, shortcut.join('+'));
        }
      }
    }
  };

  // Register the current shortcut with the given task
  $scope.register = (task) => {
    Settings.register(task, $scope.shortcut);
  };

  // Source: https://goo.gl/GrkqVb
  // Record keydown events
  $scope.keyDown = (e) => {
    const key = e.which;

    if (Accelerators[key]) {
      accelerators = [Accelerators[key]];
    }
    else if (Modifiers[key]) {
      modifiers.push(Modifiers[key]);
    }
    else if (Actions[key]) {
      actions = [Actions[key]];
    }

    registerShortcut();
    e.preventDefault();
  };

  // Source: https://goo.gl/KAMmyp
  // Delete any record of keydown events
  $scope.keyUp = (e) => {
    const key = e.which;

    if (Accelerators[key]) {
      _.remove(accelerators, (value) => value === Accelerators[key]);
    }
    else if (Modifiers[key]) {
      _.remove(modifiers, (value) => value === Modifiers[key]);
    }
    else if (Actions[key]) {
      _.remove(actions, (value) => value === Actions[key]);
    }
    else if (key === 27) {
      reset();
    }

    registerShortcut();
  };

  // Detect keydown events
  $(document).keydown((e) => {
    // Only register the keydown event if focused on an input
    if($(document.activeElement).attr('class').indexOf('task') > -1) {
      $scope.keyDown(e);
      $scope.$digest();
    }
  });

  // Detect keyup events
  $(document).keyup((e) => {
    // Only register the keyup event if focused on an input
    if($(document.activeElement).attr('class').indexOf('task') > -1) {
      $scope.keyUp(e);
      $scope.$digest();
    }
  });

  // ipcRenderer Configuration
  ipcRenderer.send(constants.Ipc.FetchSettings);

  // Render the settings sent from the main process
  ipcRenderer.on(constants.Ipc.Settings, (event, settings) => {
    shortcuts = $scope.shortcuts = settings.shortcuts;
    $scope.$digest();
  });
};

settingsCtrl.$inject = ['$scope', 'Settings'];

app.controller('SettingsCtrl', settingsCtrl);