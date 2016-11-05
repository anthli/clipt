'use strict';

// Create a new Clip object containing:
//   1. The type of data (Text, Image, etc.)
//   2. The current Unix timestamp
//   3. The an object of the copied data
module.exports = (type, data) => {
  let obj = {
    type: type
  };

  switch (type) {
    case 'Text':
      obj.text = data.text;
      break;

    case 'Image':
      obj.text = data.text;
      obj.image = data.image;
      break;
  }

  return obj;
};