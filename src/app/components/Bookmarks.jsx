import {ipcRenderer} from 'electron';
import _ from 'lodash';
<<<<<<< HEAD
import React from 'react';
=======
import React, {Component} from 'react';
>>>>>>> parent of 5aa0dd6... Added About modal back

import Clip from './Clip.jsx';
import Clips from './Clips.jsx';

import constants from '../utils/constants';

export default class Bookmarks extends Component {
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
<<<<<<< HEAD
    // Render the Bookmarks received from the main process
    ipcRenderer.on(constants.Ipc.Bookmarks, (event, bookmarks) => {
      this.setState({clips: bookmarks});
=======
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
>>>>>>> parent of 5aa0dd6... Added About modal back

  componentWillUnmount() {
    this._isMounted = false;
  }

<<<<<<< HEAD
=======
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

>>>>>>> parent of 5aa0dd6... Added About modal back
  render() {
    return (
      <Clips clips={this.state.clips} />
    );
  }
}