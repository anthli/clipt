import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, browserHistory, IndexRoute} from 'react-router';

import App from './components/App.jsx';
import Bookmarks from './components/Bookmarks.jsx';
import Home from './components/Home.jsx';
import Settings from './components/Settings.jsx';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/bookmarks" component={Bookmarks} />
      <Route path="/settings" component={Settings} />
    </Route>
  </Router>,
  document.getElementById('clipt')
);