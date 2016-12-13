import {ipcRenderer} from 'electron';
import React from 'react';

import Clip from './Clip.jsx';
import Clips from './Clips.jsx';

import constants from '../utils/constants';

export default class Home extends React.Component {
  constructor() {
    super();

    this.state = {
      clips: []
    };
  }

  componentWillMount() {
    ipcRenderer.send(constants.Ipc.GetClips);
  }

  componentDidMount() {
    // Render the Clips received from the main process
    ipcRenderer.on(constants.Ipc.Clips, (event, clips) => {
      this.setState({clips: clips});

      ipcRenderer.send(constants.Ipc.ReadyToDisplay);
    });
  }

  render() {
    return (
      <Clips clips={this.state.clips} />
    );
  }
}