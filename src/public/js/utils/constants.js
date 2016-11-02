'use strict'

// Source: https://goo.gl/VT4OGk
exports.CtrlOrCmd = {
  17: 'Ctrl',
  91: 'Cmd',
  93: 'Cmd'
};

// Source: https://goo.gl/kZ11F3
exports.Modifier = {
  16: 'Shift',
  18: 'Alt'
};

// Source: https://goo.gl/WlUNQc
exports.Action = _.transform(_.range(26), (final, current) => { // letters
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
  Settings: 'SettingsCtrl'
};

exports.Html = {
  About: 'views/modals/about.html',
  Home: 'views/home.html',
  Settings: 'views/modals/settings.html',
  Starred: 'views/starred.html'
};

exports.Message = {
  App: {
    Activate: 'activate',
    Closed: 'closed',
    DidFinishLoad: 'did-finish-load',
    Ready: 'ready',
    WillQuit: 'will-quit',
    WindowsAllClosed: 'window-all-closed'
  },
  Ipc: {
    ClipCopied: 'clip-copied',
    ClipDeleted: 'clip-deleted',
    Clips: 'clips',
    ClipsReady: 'clips-ready',
    ClipStarred: 'clip-starred',
    ClipUnstarred: 'clip-unstarred',
    DeleteClip: 'delete-clip',
    FetchClips: 'fetch-clips',
    OpenLink: 'link',
    StarClip: 'star-clip',
    TitleBarButtonClicked: 'title-bar-button-clicked',
    UnstarClip: 'unstar-clip'
  }
};

exports.Modal = {
  About: 'about',
  ReadyToShow: 'ready-to-show',
  Settings: 'settings'
};

exports.Path = {
  Home: '/',
  Starred: '/starred',
  Settings: '/settings'
};