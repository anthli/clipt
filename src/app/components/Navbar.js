import React, {Component} from 'react';

export default class Navbar extends Component {
  constructor() {
    super();

    this.state = {
      activeMenu: 'home'
    };
  }

  switchActiveMenu(menu) {
    this.setState(() => ({
      activeMenu: menu
    }));
  }

  render() {
    return (
      <div id="navbar">
        <i
          className={
            "navbar-icon fa fa-home" +
            (this.state.activeMenu === 'home' ? ' active' : '')
          }
          onClick={() => this.switchActiveMenu('home')}
        >
        </i>

        <i
          className={
            "navbar-icon fa fa-star" +
            (this.state.activeMenu === 'favorites' ? ' active' : '')
          }
          onClick={() => this.switchActiveMenu('favorites')}
        >
        </i>

        <i
          className={
            "navbar-icon fa fa-cog" +
            (this.state.activeMenu === 'settings' ? ' active' : '')
          }
          onClick={() => this.switchActiveMenu('settings')}
        >
        </i>
      </div>
    );
  }
}