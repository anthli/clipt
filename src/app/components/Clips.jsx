import {ipcRenderer} from 'electron';
import _ from 'lodash';
import React from 'react';
import {AutoSizer, List} from 'react-virtualized';

import Clip from './Clip.jsx';

import constants from '../utils/constants';

export default class Clips extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clips: []
    };

    this.copyClip = this.copyClip.bind(this);
    this.checkBookmark = this.checkBookmark.bind(this);
    this.deleteClip = this.deleteClip.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({clips: newProps.clips});
  }

  // Find the copied Clip with its id and send it to the main process to be
  // written to the clipboard
  copyClip(id, event) {
    // Don't copy the Clip if either the Bookmark or Delete icons are clicked on
    let iconClickedOn = _.find(event.target.classList, className => {
      return className === 'bookmark-icon' || className === 'delete-icon';
    });

    if (!iconClickedOn) {
      let clip = _.find(this.state.clips, clip => clip.id === id);
      ipcRenderer.send(constants.Ipc.ClipCopied, clip);
    }
  }

  // Toggle the Bookmark given the Clip's id
  checkBookmark(id) {
    let clip = _.find(this.state.clips, clip => clip.id === id);

    // Bookmark the Clip
    if (!clip.bookmark_id) {
      ipcRenderer.send(constants.Ipc.Bookmark, clip.id);

      // Assign a bookmarkId to the new Bookmark
      ipcRenderer.on(constants.Ipc.Bookmarked, (event, clipId, bookmarkId) => {
        let newClips = _.each(this.state.clips, clip => {
          if (clip.id === clipId) {
            clip.bookmark_id = bookmarkId;
          }
        });

        this.setState({clips: newClips});
      });
    }
    // Delete the Bookmark
    else {
      ipcRenderer.send(constants.Ipc.DeleteBookmark, clip.bookmark_id);

      // Set the deleted Bookmark's id to null
      ipcRenderer.on(constants.Ipc.BookmarkDeleted, (event, bookmarkId) => {
        let newClips = _.each(this.state.clips, clip => {
          if (clip.bookmark_id === bookmarkId) {
            clip.bookmark_id = null;
          }
        });

        this.setState({clips: newClips});
      });
    }
  }

  // Delete the Clip with the given id
  deleteClip(id) {
    ipcRenderer.send(constants.Ipc.DeleteClip, id);

    ipcRenderer.on(constants.Ipc.ClipDeleted, (event, clipId) => {
      this.setState({
        clips: _.filter(this.state.clips, clip => clip.id !== id)
      });
    });
  }

  rowRenderer({key, index, style}) {
    let clip = this.state.clips[index];

    return (
      <Clip
        key={key}
        style={style}
        clipId={clip.id}
        type={clip.type}
        text={clip.text}
        bookmarkId={clip.bookmark_id}
        copyClip={this.copyClip}
        checkBookmark={this.checkBookmark}
        deleteClip={this.deleteClip}
      />
    );
  }

  render() {
    let isWin32 = process.platform === constants.Platform.Win;

    return (
      <div id={isWin32 ? 'clip-list-win32' : 'clip-list'}>
        <AutoSizer>
          {({height, width}) => (
            <List
              height={height}
              rowCount={this.state.clips.length}
              rowHeight={80}
              rowRenderer={this.rowRenderer}
              width={width}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
}