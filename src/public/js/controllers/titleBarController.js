'use strict';

const titleBarCtrl = function($scope, TitleBar) {
  // Signal the main process that one of the title bar buttons was clicked on
  $scope.click = button => {
    TitleBar.click(button);
  };
};

titleBarCtrl.$inject = ['$scope', 'TitleBar'];

app.controller(constants.Controller.TitleBar, titleBarCtrl);