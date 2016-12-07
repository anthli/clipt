import React, {Component} from 'react';

import Bookmarks from './Bookmarks';
import Home from './Home';
import Navbar from './Navbar';

export default class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Home />
      </div>
    );
  }
}