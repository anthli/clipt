'use strict';

const {BrowserWindow} = require('electron');
const path = require('path');

const constants = require('./constants');

// Set up the browser window to be used with the app
module.exports = () => {
  const win = new BrowserWindow({
    width: 640,
    height: 480,
    show: false,
    title: constants.appName
  });

  // Load index.html
  win.loadURL(path.normalize(constants.indexHtml));
  return win;
}