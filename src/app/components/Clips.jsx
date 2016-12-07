import React, {Component} from 'react';
import Infinite from 'react-infinite';

export default class Clips extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Infinite
        className="clip-list"
        elementHeight={80}
        useWindowAsScrollContainer
      >
        {this.props.clips}
      </Infinite>
    );
  }
}