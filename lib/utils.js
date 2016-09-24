'use strict';

// Checks if the oldText is different from the newText
exports.textHasDiff = (oldTxt, newTxt) => {
  return oldTxt !== newTxt;
};

// Checks if the oldImg is different from the newImg
exports.imageHasDiff = (oldImg, newImg) => {
  return !oldImg.isEmpty() && oldImg.toDataURL() !== newImg.toDataURL();
};