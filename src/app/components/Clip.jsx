import {ipcRenderer} from 'electron';
import React, {Component} from 'react';

import constants from '../utils/constants';

export default class Clip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bookmarkId: this.props.bookmarkId
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.bookmarkId !== nextProps.bookmarkId) {
      this.setState(() => ({
        bookmarkId: nextProps.bookmarkId
      }));
    }
  }

  render() {
    return (
      <div className="clip-container">
        <div className="clip-button-container">
          <i
            className={
              "bookmark-icon fa fa-star" +
              (this.state.bookmarkId ? ' bookmarked' : '-o')
            }
            onClick={() => this.props.checkBookmark(this.props.clipId)}
          >
          </i>

          <i className="delete-icon fa fa-trash-o"></i>
        </div>

        <div className="clip">
          <div className="clip-type">{this.props.type}</div>
          <div className="clip-text">{this.props.text}</div>
        </div>
      </div>
    );
  }
}