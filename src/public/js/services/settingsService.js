'use strict';

const settingsFactory = () => {
  return {
    register: (task, shortcut) => {
      console.log(task, shortcut);
    }
  }
};

app.factory('Settings', settingsFactory);