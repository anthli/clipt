'use strict';

const {ipcRenderer} = require('electron');
const $ = require('jquery');
const _ = require('lodash');
const path = require('path');

// Retrieve constants file
const projectDir = __dirname.substring(0, __dirname.indexOf('src') + 3);
const constantsPath = 'public/js/utils/constants';
const constants = require(path.join(projectDir, constantsPath));

const app = angular.module('clipt', [
  'infinite-scroll',
  'ngAnimate',
  'ngAria',
  'ngMaterial',
  'ngRoute'
  ]
);

const config = $routeProvider => {
  $routeProvider

  // Home page
  .when(constants.Path.Home, {
    templateUrl: constants.Html.Home,
    controller: constants.Controller.Home
  })

  // Bookmarks page
  .when(constants.Path.Bookmarks, {
    templateUrl: constants.Html.Bookmarks,
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