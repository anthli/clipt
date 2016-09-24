// Watches the system clipboard for changes in copied data
// Source: https://goo.gl/Caaio7

'use strict'

const {clipboard} = require('electron');

// Checks if the oldText is different from the newText
const textHasDiff = (oldTxt, newTxt) => {
  return oldTxt !== newTxt;
};

// Checks if the oldImg is different from the newImg
const imageHasDiff = (oldImg, newImg) => {
  return !oldImg.isEmpty() && oldImg.toDataURL() !== newImg.toDataURL();
};

module.exports = (opts) => {
  opts = opts || {};
  // Default delay is 1000 ms
  const watchDelay = opts.watchDelay || 1000;

  // The text/image from the current copy
  let currTxt = clipboard.readText();
  let currImg = clipboard.readImage();

  const intervalId = setInterval(() => {
    // Text or image from the latest copy
    const newTxt = clipboard.readText();
    const newImg = clipboard.readImage();

    // Detect the type of copied data. When copying an file, the name of the
    // file is registered as a change in copied text. In this scenario,
    // isEmpty() will detect whether only text was copied, or if some file was
    // copied
    switch (newImg.isEmpty()) {
      // Only text was copied
      case true:
        if (opts.onTextChange && textHasDiff(newTxt, currTxt)) {
          currTxt = newTxt;

          return opts.onTextChange(newTxt);
        }
      // Non-text was copied
      case false:
        // An image was copied
        if (opts.onImageChange && imageHasDiff(newImg, currImg)) {
          currImg = newImg;

          return opts.onImageChange(clipboard.readText(), newImg);
        }
    }
  }, watchDelay);

  return {
    // Stop the current clipboardWatcher
    stop: () => {
      clearInterval(intervalId);
    }
  }
}