'use strict';

const titleBarCtrl = function($scope, TitleBar) {
  // Signal the main process that one of the title bar buttons was clicked on
  $scope.clickTitleBarButton = function(button) {
    TitleBar.clickTitleBarButton(button);
  };
};

titleBarCtrl.$inject = ['$scope', 'TitleBar'];

app.controller('TitleBarCtrl', titleBarCtrl);