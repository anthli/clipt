'use strict';

const dir = __dirname;

exports.appName = 'Clipt';

exports.db = {
  dir: '.db',
  file: 'clipt.db',
  path: 'userData',
}

exports.platform = {
  mac: 'darwin',
  win: 'win32'
};

exports.indexHtml = `file://${dir}/../index.html`;

exports.tray = {
  icon: {
    mac: `${dir}/../assets/images/icon@2x.png`,
    win: `${dir}/../assets/images/icon.ico`
  },
  menu: {
    label: {
      about: 'About Clipt',
      preferences: 'Preferences...',
      show: 'Show',
      quit: 'Quit Clipt'
    },
    role: {
      about: 'about',
      quit: 'quit'
    },
    type: {
      normal: 'normal',
      separator: 'separator'
    }
  }
};

exports.shortcut = {
  open: {
    key: 'CommandOrControl+`',
    error: 'Failed to register CommandOrControl+`'
  }
};

exports.clipType = {
  image: 'image',
  text: 'text'
}

exports.message = {
  app: {
    activate: 'activate',
    closed: 'closed',
    didFinishLoad: 'did-finish-load',
    ready: 'ready',
    willQuit: 'will-quit',
    windowsAllClosed:'window-all-closed'
  },
  clip: {
    clips: 'clips',
    clipsReady: 'clips-ready',
    deleteClip: 'delete-clip'
  },
  tray: {
    doubleClick: 'double-click'
  }
}