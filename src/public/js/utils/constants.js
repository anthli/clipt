'use strict';

// Source: https://goo.gl/VT4OGk
exports.Accelerators = {
  17: 'Ctrl',
  91: 'Cmd',
  93: 'Cmd'
};

// Source: https://goo.gl/kZ11F3
exports.Modifiers = {
  16: 'Shift',
  18: 'Alt'
};

// Source: https://goo.gl/WlUNQc
exports.Actions = _.transform(_.range(26), (final, current) => { // letters
  final[current + 65] = String.fromCharCode(current + 65);
}, _.transform(_.range(10), (final, current) => { // digits
  final[current + 48] = current.toString(); // eslint-disable-line
}, _.transform(_.range(12), (final, current) => { // f-keys
  final[current + 112] = 'F' + (current + 1).toString();
}, {
  33: 'PageUp',
  34: 'PageDown',
  35: 'End',
  36: 'Home',
  37: 'Left',
  38: 'Up',
  39: 'Right',
  40: 'Down',
  45: 'Insert',
  46: 'Delete',
  186: ';',
  187: '=',
  188: ',',
  189: '-',
  190: '.',
  191: '/',
  192: '`',
  219: '[',
  220: '\\',
  221: ']',
  222: '\'',
})));

exports.Controller = {
  About: 'AboutCtrl',
  Home: 'HomeCtrl',
  Settings: 'SettingsCtrl',
  SideMenu: 'SideMenuCtrl',
  Starred: 'StarredCtrl',
  TitleBar: 'TitleBarCtrl'
};

exports.Html = {
  About: 'views/modals/about.html',
  Home: 'views/home.html',
  Settings: 'views/modals/settings.html',
  Starred: 'views/starred.html'
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

exports.Modal = {
  ReadyToShow: 'ready-to-show',
};

exports.Path = {
  Home: '/',
  Starred: '/starred/',
  Settings: '/settings/'
};

exports.Service = {
  Clip: 'Clip',
  Settings: 'Settings',
  TitleBar: 'TitleBar'
};