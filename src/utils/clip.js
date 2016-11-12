'use strict';

const constants = require('./constants');

// Create a new Clip object containing:
//   1. The type of data (Text, Image, etc.)
//   2. The current Unix timestamp
//   3. The object of the copied data
module.exports = (type, data) => {
  let date = new Date();
  let obj = {
    type: type,
    timestamp: date.getTime()
  };

  switch (type) {
    case constants.ClipType.Text:
      obj.text = data.text;

      break;

    case constants.ClipType.Image:
      obj.text = data.text;
      obj.image = data.image;

      break;
  }

  return obj;
};