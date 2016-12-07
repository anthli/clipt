'use strict';

// Source: https://goo.gl/VT4OGk
module.exports.Accelerators = {
  17: 'Ctrl',
  91: 'Cmd',
  93: 'Cmd'
};

// Source: https://goo.gl/kZ11F3
module.exports.Modifiers = {
  16: 'Shift',
  18: 'Alt'
};

// Source: https://goo.gl/WlUNQc
module.exports.Actions = _.transform(
  // Letters
  _.range(26), (final, current) => {
    final[current + 65] = String.fromCharCode(current + 65);
  },

  // Digits
  _.transform(
    _.range(10), (final, current) => {
      final[current + 48] = current.toString();
    },

    // F-keys
    _.transform(
      _.range(12), (final, current) => {
        final[current + 112] = 'F' + (current + 1).toString();
      },

      // Miscellaneous keys
      {
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
      }
    )
  )
);

module.exports.Controller = {
  About: 'AboutCtrl',
  Home: 'HomeCtrl',
  Navbar: 'NavbarCtrl',
  Settings: 'SettingsCtrl',
  TitleBar: 'TitleBarCtrl'
};

module.exports.Html = {
  About: 'views/modals/about.html',
  Bookmarks: 'views/bookmarks.html',
  Home: 'views/home.html',
  Settings: 'views/modals/settings.html'
};

module.exports.Ipc = {
  AboutModal: 'about-modal',
  Bookmark: 'bookmark',
  Bookmarked: 'bookmarked',
  BookmarkDeleted: 'bookmark-deleted',
  ClipCopied: 'clip-copied',
  ClipDeleted: 'clip-deleted',
  Clips: 'clips',
  ClipsReady: 'clips-ready',
  DeleteBookmark: 'delete-bookmark',
  DeleteClip: 'delete-clip',
  GetBookmarks: 'fetch-bookmarks',
  GetClips: 'fetch-clips',
  GetSettings: 'fetch-settings',
  OpenLink: 'open-link',
  RegisterShortcut: 'register-shortcut',
  Settings: 'settings',
  SwitchImageFormat: 'switch-image-format',
  TitleBarButtonClicked: 'title-bar-button-clicked'
};

module.exports.Modal = {
  ReadyToShow: 'ready-to-show',
};

module.exports.Path = {
  Home: '/',
  Bookmarks: '/bookmarks/',
  Settings: '/settings/'
};

module.exports.Service = {
  Clip: 'Clip',
  Settings: 'Settings',
  TitleBar: 'TitleBar'
};