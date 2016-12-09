import {ipcRenderer} from 'electron';
import _ from 'lodash';
import React, {Component} from 'react';

import Clip from './Clip.jsx';
import Clips from './Clips.jsx';

import constants from '../utils/constants';

export default class Bookmarks extends Component {
  constructor() {
    super();

    this.state = {
      clips: []
    };

    this.copyClip = this.copyClip.bind(this);
    this.checkBookmark = this.checkBookmark.bind(this);
    this.deleteClip = this.deleteClip.bind(this);
  }

  componentWillMount() {
    ipcRenderer.send(constants.Ipc.GetBookmarks);
  }

  componentDidMount() {
    this._isMounted = true;

    if (this._isMounted) {
      ipcRenderer.on(constants.Ipc.Bookmarks, (event, clips) => {
        this.setState(() => ({
          clips: clips
        }));

        ipcRenderer.send(constants.Ipc.ReadyToDisplay);
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // Find the copied Bookmark with its id and send it to the main process to be
  // written to the clipboard
  copyClip(id, event) {
    // Don't copy the Bookmark if either the Bookmark or Delete icons are
    // clicked on
    let iconClickedOn = _.find(event.target.classList, className => {
      return className === 'bookmark-icon' || className === 'delete-icon';
    });

    if (!iconClickedOn) {
      let clip = _.find(this.state.clips, clip => clip.id === id);
      ipcRenderer.send(constants.Ipc.ClipCopied, clip);
    }
  }

  // Delete the Bookmark given its id
  checkBookmark(id) {
    let clip = _.find(this.state.clips, clip => clip.id === id);

    ipcRenderer.send(constants.Ipc.DeleteBookmark, clip.bookmark_id);

    // Set the deleted Bookmark's id to null
    ipcRenderer.on(constants.Ipc.BookmarkDeleted, (event, bookmarkId) => {
      // Filter out the deleted Bookmark
      let newClips = _.reject(this.state.clips, clip => {
        return clip.bookmark_id === bookmarkId;
      });

      this.setState(() => ({
        clips: newClips
      }));
    });
  }

  // Delete the Clip given its id
  deleteClip(id) {
    ipcRenderer.send(constants.Ipc.DeleteClip, id);

    ipcRenderer.on(constants.Ipc.ClipDeleted, (event, clipId) => {
      this.setState(() => ({
        clips: _.filter(this.state.clips, clip => clip.id !== id)
      }));
    });
  }

  render() {
    let clips = _.map(this.state.clips, clip => {
      return (
        <Clip
          key={clip.id}
          clipId={clip.id}
          type={clip.type}
          text={clip.text}
          bookmarkId={clip.bookmark_id}
          copyClip={this.copyClip}
          checkBookmark={this.checkBookmark}
          deleteClip={this.deleteClip}
        />
      );
    });

    return (
      <Clips clips={clips} />
    );
  }
}