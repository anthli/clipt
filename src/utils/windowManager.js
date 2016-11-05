'use strict';

const {BrowserWindow} = require('electron');

// Store each window of the application to be referenced by other modules
const windows = {};

exports.setMainWindow = (win) => {
  windows.main = win;
};

exports.getMainWindow = () => {
  return windows.main;
};