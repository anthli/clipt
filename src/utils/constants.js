'use strict';

const dir = __dirname;

exports.AppName = 'Clipt';
exports.DbFile = 'clipt.sqlite3';
exports.SettingsFile = 'settings.json';
exports.UserData = 'userData';
exports.UserDir = 'User/';

exports.ClipType = {
  Image: 'Image',
  Text: 'Text'
};

exports.Html = {
  Index: `file://${dir}/../index.html`,
  Settings: `file://${dir}/../views/modals/settings.html`
};

exports.App = {
  Activate: 'activate',
  Closed: 'closed',
  DidFinishLoad: 'did-finish-load',
  Ready: 'ready',
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
  MacIcon: `${dir}/../assets/images/icon@2x.png`,
  WinIcon: `${dir}/../assets/images/icon.ico`,
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