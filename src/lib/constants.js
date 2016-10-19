'use strict';

const dir = __dirname;

exports.appName = 'Clipt';

exports.clipType = {
  image: 'Image',
  text: 'Text'
}

exports.db = {
  path: '.db/clipt.sqlite3',
  userData: 'userData',
}

exports.indexHtml = `file://${dir}/../index.html`;

exports.settingsHtml = `file://${dir}/../views/modals/settings.html`;

exports.message = {
  app: {
    activate: 'activate',
    closed: 'closed',
    didFinishLoad: 'did-finish-load',
    ready: 'ready',
    willQuit: 'will-quit',
    windowsAllClosed: 'window-all-closed'
  },
  clip: {
    clips: 'clips',
    copied: 'clip-copied',
    deleted: 'clip-deleted',
    ready: 'clips-ready',
    delete: 'delete-clip',
    star: 'star-clip',
    starred: 'clip-starred',
    unstar: 'unstar-clip',
    unstarred: 'clip-unstarred'
  },
  link: 'link',
  titleBar: {
    buttonClicked: 'title-bar-button-clicked'
  }
}

exports.modal = {
  about: 'about',
  readyToShow: 'ready-to-show',
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

exports.titleBar = {
  close: 'close',
  maximize: 'maximize',
  minimize: 'minimize'
}

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
      quit: 'quit'
    },
    type: {
      normal: 'normal',
      separator: 'separator'
    }
  }
};