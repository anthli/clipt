'use strict';

const dir = __dirname;

exports.appName = 'Clipt';

exports.clipType = {
  image: 'image',
  text: 'text'
}

exports.db = {
  dir: '.db',
  file: 'clipt.db',
  path: 'userData',
}

exports.indexHtml = `file://${dir}/../index.html`;

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
    clipCopied: 'clip-copied',
    clipsReady: 'clips-ready',
    deleteClip: 'delete-clip'
  },
  tray: {
    doubleClick: 'double-click'
  }
}

exports.modal = {
  about: 'about',
  settings: 'settings'
}

exports.platform = {
  mac: 'darwin',
  win: 'win32'
};

exports.shortcut = {
  open: {
    key: 'CommandOrControl+`',
    error: 'Failed to register CommandOrControl+`'
  }
};

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