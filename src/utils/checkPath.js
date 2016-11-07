'use strict';

const fs = require('fs');
const path = require('path');

// Create the given directory and file if they do not exist
module.exports = (dir, file) => {
  let filePath = path.join(dir, file);

  try {
    // Check if the file already exists
    fs.statSync(filePath);

    return true;
  }
  catch (err) {
    try {
      // Create the directory if it doesn't exist
      fs.mkdirSync(dir);
    }
    catch (err) {
      // Do nothing since the directory already exists
    }

    return false;
  }
};