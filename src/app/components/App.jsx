import React from 'react';

import AboutModal from './modals/AboutModal.jsx';
import NavBar from './NavBar.jsx';
import SearchBar from './SearchBar.jsx';
import TitleBar from './TitleBar.jsx'

import constants from '../utils/constants';

export default class App extends React.Component {
  render() {
    let isWin32 = process.platform === constants.Platform.Win;

    return (
      <div>
        {!isWin32 && <TitleBar />}
        <NavBar />
        <SearchBar />

        {this.props.children};
      </div>
    );
  }
}