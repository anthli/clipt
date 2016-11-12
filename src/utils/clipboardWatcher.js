// Watches the system clipboard for changes in copied data
// Source: https://goo.gl/Caaio7

'use strict';

const {
  clipboard,
  ipcMain,
  nativeImage
} = require('electron');

const constants = require('./constants');

// Directory where copied files are stored
const fileDir = './.db/files/';

let copiedFromClip = false;

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

  copiedFromClip = true;
});

module.exports = (opts) => {
  opts = opts || {};
  // Default delay is 1000 ms
  const watchDelay = opts.watchDelay || 1000;

  // The text/image from the current clipboard
  let currText = clipboard.readText();
  let currImg = clipboard.readImage();

  const intervalId = setInterval(() => {
    // Text or image from the latest change in the clipboard
    const newText = clipboard.readText();
    const newImg = clipboard.readImage();

    // Prevent copying from a Clip registering as a change in the clipboard
    switch (copiedFromClip) {
      case true:
        if (newImg.isEmpty()) {
          currText = newText;
        }
        else {
          currText = newText;
          currImg = newImg;
        }

        copiedFromClip = false;

        break;

      case false:
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

        break;
    }
  }, watchDelay);

  return {
    // Stop the current clipboardWatcher
    stop: () => {
      clearInterval(intervalId);
    }
  };
};