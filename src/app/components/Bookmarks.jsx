import {ipcRenderer} from 'electron';
import React from 'react';

import Clip from './Clip.jsx';
import Clips from './Clips.jsx';

import constants from '../utils/constants';

export default class Bookmarks extends React.Component {
  constructor() {
    super();

    this.state = {
      clips: []
    };
  }

  componentWillMount() {
    ipcRenderer.send(constants.Ipc.GetBookmarks);
  }

  componentDidMount() {
    // Render the Bookmarks received from the main process
    ipcRenderer.on(constants.Ipc.Bookmarks, (event, bookmarks) => {
      this.setState({clips: bookmarks});
    });
  }

  render() {
    return (
      <Clips clips={this.state.clips} />
    );
  }
}