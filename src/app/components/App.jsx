import React, {Component} from 'react';

<<<<<<< HEAD
import AboutModal from './modals/AboutModal.jsx';
=======
import Bookmarks from './Bookmarks.jsx';
import Home from './Home.jsx';
>>>>>>> parent of 5aa0dd6... Added About modal back
import Navbar from './Navbar.jsx';
import SearchBar from './SearchBar.jsx';
import TitleBar from './TitleBar.jsx'

import constants from '../utils/constants';

export default class App extends Component {
  render() {
    let isWin32 = process.platform === constants.Platform.Win;

    return (
      <div>
        {!isWin32 && <TitleBar />}
        <Navbar />
        <SearchBar />

        {this.props.children};
      </div>
    );
  }
}