'use strict';

const {ipcRenderer} = require('electron');
const $ = require('jquery');
const _ = require('lodash');

const constants = require('./public/js/utils/constants');

const app = angular.module('clipt', [
  'infinite-scroll',
  'ngAnimate',
  'ngAria',
  'ngMaterial',
  'ngRoute'
  ]
);

const config = ($routeProvider) => {
  $routeProvider

  // Home page
  .when(constants.Path.Home, {
    templateUrl: constants.Html.Home,
    controller: constants.Controller.Home
  })

  // Starred Clips page
  .when(constants.Path.Starred, {
    templateUrl: constants.Html.Starred,
    controller: constants.Controller.Home
  })

  // Settings page
  .when(constants.Path.Settings, {
    templateUrl: constants.Html.Settings,
    controller: constants.Controller.Settings
  });
};

config.$inject = ['$routeProvider'];

app.config(config);