'use strict';

// Create a new clip object containing:
//   1. The type of data
//   2. The current Unix timestamp
//   3. The an object of the copied data
module.exports = (type, data) => {
  let obj = {
    type: type,
    timestamp: new Date().getTime()
  };

  switch (type) {
    case 'text':
      obj.text = data.text;

      break
    case 'image':
      obj.text = data.text;
      obj.image = data.image;

      break
  }

  return obj;
};