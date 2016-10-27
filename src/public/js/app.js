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

const config = function($routeProvider) {
  $routeProvider

  // Home page of the application
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })

  // Starred Clips page of the application
  .when('/starred', {
    templateUrl: 'views/starred.html',
    controller: 'MainCtrl'
  });
};

config.$inject = ['$routeProvider'];

app.config(config);