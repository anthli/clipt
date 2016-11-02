'use strict';

const settingsCtrl = function($scope, Settings) {
  // Lists of each key pressed when configuring a shortcut
  let ctrlOrCmd = [];
  let modifiers = [];
  let actions = [];
  $scope.shortcut = '';

  // Reset every field to take in a new shortcut
  const reset = () => {
    ctrlOrCmd = [];
    modifiers = [];
    actions = [];
    $scope.shortcut = '';
  }

  // Source: https://goo.gl/25tloa
  const constructShortcut = () => {
    if (ctrlOrCmd.length > 0) {
      modifiers.sort();
      actions.sort();

      if (actions.length > 0) {
        let shortcut = [ctrlOrCmd.join('+')];

        if (modifiers.length > 0) {
          shortcut.push(modifiers.join('+'));
        }

        shortcut.push(actions.join('+'));
        $scope.shortcut = shortcut.join('+');
      }
    }
  };

  // Record keydown events, then construct the shortcut
  $scope.keyDown = (e) => {
    const key = e.which;

    if (constants.CtrlOrCmd[key]) {
      ctrlOrCmd = [constants.CtrlOrCmd[key]];
    }
    else if (constants.Modifier[key]) {
      modifiers.push(constants.Modifier[key]);
    }
    else if (constants.Action[key]) {
      actions = [constants.Action[key]];
    }

    constructShortcut();
  };

  // Delete any record of keydown events
  $scope.keyUp = (e) => {
    const key = e.which;

    if (constants.CtrlOrCmd[key]) {
      _.remove(ctrlOrCmd, (value) => value === constants.CtrlOrCmd[key]);
    }
    else if (constants.Modifier[key]) {
      _.remove(modifiers, (value) => value === constants.Modifier[key]);
    }
    else if (constants.Action[key]) {
      _.remove(actions, (value) => value === constants.Action[key]);
    }
    else if (key === 27) {
      reset();
    }
  };

  $scope.register = (task) => {
    Settings.register(task, $scope.shortcut);
  }

  // Detect keydown events
  $(document).keydown((e) => {
    $scope.keyDown(e);
    $scope.$digest();
  });

  // Detect keyup events
  $(document).keyup((e) => {
    $scope.keyUp(e);
    $scope.$digest();
  });
};

settingsCtrl.$inject = ['$scope', 'Settings'];

app.controller('SettingsCtrl', settingsCtrl);