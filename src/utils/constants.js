'use strict';

const {app} = require('electron');
const path = require('path');

exports.AppName = 'Clipt';
exports.DbFile = 'clipt.sqlite3';
exports.SettingsFile = 'settings.json';
exports.UserDataDir = path.join(app.getPath('userData'), 'User/');

exports.ClipType = {
  Image: 'Image',
  Text: 'Text'
};

exports.Html = {
  About: `file://${__dirname}/../views/modals/About.html`,
  Index: `file://${__dirname}/../index.html`

};

exports.App = {
  Activate: 'activate',
  Closed: 'closed',
  DidFinishLoad: 'did-finish-load',
  Ready: 'ready',
  ReadyToShow: 'ready-to-show',
  WillQuit: 'will-quit',
  WindowsAllClosed: 'window-all-closed'
};

exports.Error = {
  ENOENT: 'ENOENT',
  EEXIST: 'EEXIST'
};

exports.Ipc = {
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
  TitleBarButtonClicked: 'title-bar-button-clicked',
  UnstarClip: 'unstar-clip'
};

exports.Platform = {
  Mac: 'darwin',
  Win: 'win32'
};

exports.Shortcut = {
  OpenCloseTask: 'open-close',
  OpenCloseError: 'Failed to register open-close'
};

exports.TitleBar = {
  Close: 'close',
  Maximize: 'maximize',
  Minimize: 'minimize'
};

exports.Tray = {
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