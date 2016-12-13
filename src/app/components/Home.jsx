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

export default class Home extends Component {
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
<<<<<<< HEAD
    // Render the Clips received from the main process
    ipcRenderer.on(constants.Ipc.Clips, (event, clips) => {
      this.setState({clips: clips});
=======
    this._isMounted = true;

    if (this._isMounted) {
      ipcRenderer.on(constants.Ipc.Clips, (event, clips) => {
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

        this.setState(() => ({
          clips: newClips
        }));
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

        this.setState(() => ({
          clips: newClips
        }));
      });
    }
  }

  // Delete the Clip with the given id
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