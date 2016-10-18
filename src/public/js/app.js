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

  // Main page of the application
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  });
};

config.$inject = ['$routeProvider'];

app.config(config);