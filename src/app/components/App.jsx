import React, {Component} from 'react';

import Bookmarks from './Bookmarks.jsx';
import Home from './Home.jsx';
import Navbar from './Navbar.jsx';
import SearchBar from './SearchBar.jsx';
import TitleBar from './TitleBar.jsx'

export default class App extends Component {
  render() {
    return (
      <div>
        <TitleBar />
        <Navbar />
        <SearchBar />

        {this.props.children};
      </div>
    );
  }
}