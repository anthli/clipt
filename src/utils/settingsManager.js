'use strict';

// Store the global application settings to be used in other modules
let globalSettings = {};

module.exports.getSettings = () => {
  return globalSettings;
};

module.exports.setSettings = settings => {
  globalSettings = settings;
};