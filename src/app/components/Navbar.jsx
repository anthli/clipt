import React from 'react';
import {Link} from 'react-router';

import constants from '../utils/constants';

export default class Navbar extends React.Component {
  constructor() {
    super();

    this.state = {
      activeMenu: 'home'
    };
  }

  switchActiveMenu(menu) {
    this.setState({activeMenu: menu});
  }

  render() {
    let isWin32 = process.platform === constants.Platform.Win;

    return (
      <div id={isWin32 ? 'nav-bar-win32' : 'nav-bar'}>
        <div className="nav-bar-icon-container">
          <Link to="/">
            <i
              className={
                "nav-bar-icon fa fa-home" +
                (this.state.activeMenu === 'home' ? ' active' : '')
              }
              onClick={() => this.switchActiveMenu('home')}
            >
            </i>
          </Link>
        </div>

        <div className="nav-bar-icon-container">
          <Link to="/bookmarks">
            <i
              className={
                "nav-bar-icon fa fa-star" +
                (this.state.activeMenu === 'bookmarks' ? ' active' : '')
              }
              onClick={() => this.switchActiveMenu('bookmarks')}
            >
            </i>
          </Link>
        </div>

        <div className="nav-bar-icon-container">
          <Link to="/settings">
            <i
              className={
                "nav-bar-icon fa fa-cog" +
                (this.state.activeMenu === 'settings' ? ' active' : '')
              }
              onClick={() => this.switchActiveMenu('settings')}
            >
            </i>
          </Link>
        </div>
      </div>
    );
  }
}