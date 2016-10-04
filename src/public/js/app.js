'use strict';

const {ipcRenderer} = require('electron');
const $ = require('jquery');

angular.module('clipt', [
  'ngDialog',
  'clipt.controllers',
  'clipt.services'
]);