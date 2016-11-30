'use strict';

const {app} = require('electron');
const path = require('path');

const userDataDir = path.join(app.getPath('userData'), 'User/');

module.exports.AppName = 'Clipt';
module.exports.DbPath = path.join(userDataDir, 'clipt.sqlite3');
module.exports.SettingsPath = path.join(userDataDir, 'settings.json');
module.exports.UserDataDir = userDataDir;

module.exports.ClipType = {
  Image: 'Image',
  Text: 'Text'
};

module.exports.Html = {
  About: `file://${__dirname}/../views/modals/About.html`,
  Index: `file://${__dirname}/../index.html`
};

module.exports.App = {
  Activate: 'activate',
  Closed: 'closed',
  DidFinishLoad: 'did-finish-load',
  Ready: 'ready',
  ReadyToShow: 'ready-to-show',
  WillQuit: 'will-quit',
  WindowsAllClosed: 'window-all-closed'
};

module.exports.Error = {
  ENOENT: 'ENOENT',
  EEXIST: 'EEXIST'
};

module.exports.ImageFormat = {
  Jpg: 'jpg',
  Png: 'png'
};

module.exports.Ipc = {
  AboutModal: 'about-modal',
  ClipCopied: 'clip-copied',
  ClipDeleted: 'clip-deleted',
  Clips: 'clips',
  ClipsReady: 'clips-ready',
  ClipStarred: 'clip-starred',
  ClipUnstarred: 'clip-unstarred',
  DeleteClip: 'delete-clip',
  FetchClips: 'fetch-clips',
  FetchSettings: 'fetch-settings',
  OpenLink: 'open-link',
  RegisterShortcut: 'register-shortcut',
  Settings: 'settings',
  StarClip: 'star-clip',
  SwitchImageFormat: 'switch-image-format',
  TitleBarButtonClicked: 'title-bar-button-clicked',
  UnstarClip: 'unstar-clip'
};

module.exports.Platform = {
  Mac: 'darwin',
  Win: 'win32'
};

module.exports.Shortcut = {
  OpenCloseTask: 'open-close',
  OpenCloseError: 'Failed to register open-close'
};

module.exports.TitleBar = {
  Close: 'close',
  Maximize: 'maximize',
  Minimize: 'minimize'
};

module.exports.Tray = {
  DoubleClick: 'double-click',
  MacIcon: `${__dirname}/../assets/images/icon@2x.png`,
  WinIcon: `${__dirname}/../assets/images/icon.ico`,
  Menu: {
    AboutLabel: 'About Clipt',
    PreferencesLabel: 'Preferences...',
    QuitLabel: 'Quit Clipt',
    QuitRole: 'quit',
    ShowLabel: 'Show',
    TypeNormal: 'normal',
    TypeSeparator: 'separator'
  }
};