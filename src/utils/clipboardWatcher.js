// Watches the system clipboard for changes
// Source: https://goo.gl/Caaio7

'use strict';

const {
  clipboard,
  ipcMain,
  nativeImage
} = require('electron');

const constants = require('./constants');

let watchDelay;
let currText;
let currImg;
let clipboardWatcher;
let intervalId;

// Checks if the oldText is different from the newText
const textHasDiff = (oldText, newText) => {
  return oldText !== newText;
};

// Checks if the oldImg is different from the newImg
const imageHasDiff = (oldImg, newImg) => {
  return !oldImg.isEmpty() && oldImg.toDataURL() !== newImg.toDataURL();
};

// Take the data from the Clip and write it to the Clipboard
ipcMain.on(constants.Ipc.ClipCopied, (event, clip) => {
  // Pause the clipboard watcher to prevent copying from Clips being registered
  // as a user-triggered copy
  clearInterval(intervalId);

  switch (clip.type) {
    case constants.ClipType.Text:
      clipboard.writeText(clip.text);

      break;

    case constants.ClipType.Image:
      // Create the copied image from the Clip's buffer
      let copiedImage = nativeImage.createFromBuffer(clip.image);
      clipboard.writeImage(copiedImage);

      break;
  }

  // Set the current text/image to the current clipboard so they match with the
  // text/image in the new clipboard watcher instance
  currText = clipboard.readText();
  currImg = clipboard.readImage();

  // Start up the clipboard watcher again
  intervalId = setInterval(clipboardWatcher, watchDelay);
});

module.exports = opts => {
  opts = opts || {};
  // Default delay is 1000 ms
  watchDelay = opts.watchDelay || 1000;

  // The text/image from the current clipboard
  currText = clipboard.readText();
  currImg = clipboard.readImage();

  clipboardWatcher = () => {
    // Text or image from the latest change in the clipboard
    const newText = clipboard.readText();
    const newImg = clipboard.readImage();

    // Detect whether only text was copied, or if an image was copied.
    // When copying an image, the name of the file also counts as a change
    // in the clipboard
    if (textHasDiff(currText, newText) || imageHasDiff(currImg, newImg)) {
      // Only text was copied
      if (newImg.isEmpty()) {
        currText = newText;

        return opts.onTextChange(newText);
      }
      // An image was copied
      else {
        currText = newText;
        currImg = newImg;

        return opts.onImageChange(currText, newImg);
      }
    }
  };

  intervalId = setInterval(clipboardWatcher, watchDelay);

  return {
    // Stop the current clipboardWatcher
    stop: () => {
      clearInterval(intervalId);
    }
  };
};