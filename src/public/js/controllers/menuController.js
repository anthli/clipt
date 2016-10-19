'use strict';

const menuCtrl = function($scope, $location) {
  $scope.menuItems = [
    'Home',
    'Starred'
  ];

  // Set Home as default
  $scope.activeMenu = $scope.menuItems[0];

  // Set the active menu
  $scope.setActiveMenu = function(menu) {
    $scope.activeMenu = menu;

    switch ($scope.activeMenu) {
      case 'Home':
        $location.path('/');
        break;
      case 'Starred':
        $location.path('/starred');
        break;
    }
  }
};

menuCtrl.$inject = ['$scope', '$location'];

app.controller('MenuCtrl', menuCtrl);