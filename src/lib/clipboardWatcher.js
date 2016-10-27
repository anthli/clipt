// Watches the system clipboard for changes in copied data
// Source: https://goo.gl/Caaio7

'use strict'

const {
  clipboard,
  ipcMain
} = require('electron');

const constants = require('./constants');

// Directory where copied files are stored
const fileDir = './.db/files/';

let copiedFromClip = false;

// Checks if the oldText is different from the newText
const textHasDiff = (oldTxt, newTxt) => {
  return oldTxt !== newTxt;
};

// Checks if the oldImg is different from the newImg
const imageHasDiff = (oldImg, newImg) => {
  return !oldImg.isEmpty() && oldImg.toDataURL() !== newImg.toDataURL();
};

// Take the data from the Clip and write it to the Clipboard
ipcMain.on(constants.message.clip.copied, (event, clip) => {
  switch (clip.type) {
    case constants.clipType.text:
      clipboard.writeText(clip.text);
      break

    // case constants.clipType.image:
    //   clipboard.writeImage(clip.image);
    //   break
  }

  copiedFromClip = true;
});

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

    // Data was copied from a Clip in the window
    if (copiedFromClip) {
      copiedFromClip = false;

      // Prevent copying from a Clip registering as a copy from the system
      if (newImg.isEmpty()) {
        currTxt = newTxt;
        return;
      }
      else {
        currImg = newImg;
      }

      return;
    }

    // isEmpty() will detect whether only text was copied, or if an image was
    // copied. When copying an image, the name of the file is registered as a
    // change in copied text
    if (textHasDiff(currTxt, newTxt) || imageHasDiff(currImg, newImg)) {
      switch (newImg.isEmpty()) {
        // Only text was copied
        case true:
          if (opts.onTextChange) {
            currTxt = newTxt;
            return opts.onTextChange(newTxt);
          }
        // An image was copied
        case false:
          // An image was copied
          // if (opts.onImageChange) {
          //   currImg = newImg;
          //   return opts.onImageChange(clipboard.readText(), newImg);
          // }
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