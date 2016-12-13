'use strict';

const navBarComponent = {
  controller: constants.Controller.NavBar,
  template: `
    <div id="nav-bar">
      <div class="nav-bar-icon-container">
        <i
          class="nav-bar-icon fa fa-home"
          ng-class="{active: activeMenu === 'home'}"
          ng-click="setActiveMenu('home')"
        >
        </i>
      </div>

      <div class="nav-bar-icon-container">
        <i
          class="nav-bar-icon fa fa-star"
          ng-class="{active: activeMenu === 'favorites'}"
          ng-click="setActiveMenu('favorites')"
        >
        </i>
      </div>

      <div class="nav-bar-icon-container">
        <i
          class="nav-bar-icon fa fa-cog"
          ng-class="{active: activeMenu === 'settings'}"
          ng-click="setActiveMenu('settings')"
        >
        </i>
      </div>
    </div>
  `
};

app.component(constants.Component.NavBar, navBarComponent);