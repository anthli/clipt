import React, {Component} from 'react';
import Infinite from 'react-infinite';

import constants from '../utils/constants';

export default class Clips extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let isWin32 = process.platform === constants.Platform.Win;

    return (
      <Infinite
        className={isWin32 ? 'clip-list-win32' : 'clip-list'}
        elementHeight={80}
        useWindowAsScrollContainer
      >
        {this.props.clips}
      </Infinite>
    );
  }
}