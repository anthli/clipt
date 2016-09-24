// Watches the system clipboard for changes in copied data
// Source: https://goo.gl/Caaio7

'use strict'

const clipboard = require('electron').clipboard;
const ipcMain = require('electron').ipcMain;

const utils = require('./utils.js');

// Directory where copied files are stored
const fileDir = './.db/files/';

// Take the data from the clip and write it to the clipboard
ipcMain.on('clip-copied', (event, clip) => {
  switch (clip.type) {
    case 'text':
      console.log(clip.text);
      clipboard.writeText(clip.text);

      break
    // case 'image':
    //   console.log(clip.text);
    //   console.log(clip.image);
    //
    //   break
  }
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

    // Detect the type of copied data. When copying an file, the name of the
    // file is registered as a change in copied text. In this scenario,
    // isEmpty() will detect whether only text was copied, or if some file was
    // copied
    switch (newImg.isEmpty()) {
      // Only text was copied
      case true:
        if (opts.onTextChange && utils.textHasDiff(newTxt, currTxt)) {
          currTxt = newTxt;

          return opts.onTextChange(newTxt);
        }
      // Non-text was copied
      case false:
        // An image was copied
        // if (opts.onImageChange && utils.imageHasDiff(newImg, currImg)) {
        //   currImg = newImg;
        //
        //   return opts.onImageChange(clipboard.readText(), newImg);
        // }
    }
  }, watchDelay);

  return {
    // Stop the current clipboardWatcher
    stop: () => {
      clearInterval(intervalId);
    }
  }
}