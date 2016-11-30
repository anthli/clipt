'use strict';

// Store each window of the application to be referenced by other modules
const windows = {};

module.exports.getMainWindow = () => {
  return windows.main;
};

module.exports.setMainWindow = win => {
  windows.main = win;
};