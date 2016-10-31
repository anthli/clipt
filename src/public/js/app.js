'use strict';

const {ipcRenderer} = require('electron');
const $ = require('jquery');

const app = angular.module('clipt', [
  'infinite-scroll',
  'ngAnimate',
  'ngMaterial',
  'ngRoute'
  ]
);

const config = ($routeProvider) => {
  $routeProvider

  // Home page
  .when('/', {
    templateUrl: 'views/home.html',
    controller: 'HomeCtrl'
  })

  // Starred Clips page
  .when('/starred', {
    templateUrl: 'views/starred.html',
    controller: 'HomeCtrl'
  })

  // Settings page
  .when('/settings', {
    templateUrl: 'views/modals/settings.html',
    controller: 'SettingsCtrl'
  });
};

config.$inject = ['$routeProvider'];

app.config(config);