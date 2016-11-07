'use strict';

const sideMenuCtrl = function($scope, $location) {
  $scope.menuItems = [
    'home',
    'starred',
    'settings'
  ];

  // Set Main as default menu
  $scope.activeMenu = $scope.menuItems[0];

  // Set the active menu
  $scope.setActiveMenu = (menu) => {
    $scope.activeMenu = menu;

    switch (menu) {
      case 'home':
        $location.path('/');

        break;

      default:
        $location.path('/' + menu + '/');

        break;
    }
  };
};

sideMenuCtrl.$inject = ['$scope', '$location'];

app.controller(constants.Controller.SideMenu, sideMenuCtrl);