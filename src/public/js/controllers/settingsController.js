'use strict';

const ctrlOrCmd = {
  17: 'Ctrl',
  91: 'Cmd',
  93: 'Cmd'
};

const modifiers = {
  16: 'Shift',
  18: 'Alt'
};

const settingsCtrl = function($scope, Settings) {
  let keys = {};
  $scope.openShortcut = '';

  $scope.keyDown = (e) => {
    const key = e.which;

    if (ctrlOrCmd[key]) {
      keys[key] = ctrlOrCmd[key];
    }
    else if (modifiers[key]) {
      keys[key] = modifiers[key];
    }
  };

  $scope.keyUp = (e) => {
    const key = e.which;

    if (ctrlOrCmd[key]) {
      delete keys[key];
    }
    else if (modifiers[key]) {
      delete keys[key];
    }
    else if (key === 27) {
      $scope.openShortcut = '';
    }
  };

  $(document).keydown((e) => {
    $scope.keyDown(e);
    $scope.$digest();
  });

  $(document).keyup((e) => {
    $scope.keyUp(e);
    $scope.$digest();
  });
};

settingsCtrl.$inject = ['$scope', 'Settings'];

app.controller('SettingsCtrl', settingsCtrl);