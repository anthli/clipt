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
    windowsAllClosed:'window-all-closed'
  },
  clip: {
    clips: 'clips',
    clipCopied: 'clip-copied',
    clipDeleted: 'clip-deleted',
    clipsReady: 'clips-ready',
    deleteClip: 'delete-clip'
  },
  tray: {
    doubleClick: 'double-click'
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

// Database queries
exports.query = {
  createTable: `
    CREATE TABLE IF NOT EXISTS clip (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      type TEXT NOT NULL
    );
  `,
  getAllRows: `
    SELECT * FROM clip ORDER BY id DESC
  `,
  getLastInsertedRow: `
    SELECT * FROM clip
    WHERE id = (
     SELECT last_insert_rowid()
    );
  `,
  insertRow: `
    INSERT INTO clip (text, type) VALUES ($1, $2);
  `,
  deleteRow: `
    DELETE FROM clip WHERE id = $1
  `
}

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