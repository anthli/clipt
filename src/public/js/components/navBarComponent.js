'use strict';;

app.component(constants.Component.NavBar, {
  template: `
    <div id="nav-bar" ng-controller="NavBarCtrl">
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
          ng-class="{active: activeMenu === 'bookmarks'}"
          ng-click="setActiveMenu('bookmarks')"
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
});