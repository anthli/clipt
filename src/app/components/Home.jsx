import _ from 'lodash';
import {ipcRenderer} from 'electron';
import React, {Component} from 'react';

import Clip from './Clip.jsx';
import Clips from './Clips.jsx';

import constants from '../utils/constants';

export default class Home extends Component {
  constructor() {
    super();

    this.state = {
      clips: []
    };

    this.checkBookmark = this.checkBookmark.bind(this);
    this.deleteClip = this.deleteClip.bind(this);
  }

  componentWillMount() {
    ipcRenderer.send(constants.Ipc.GetClips);
  }

  componentDidMount() {
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

  componentWillUnmount() {
    this._isMounted = false;
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

  render() {
    let clips = _.map(this.state.clips, clip => {
      return (
        <Clip
          key={clip.id}
          clipId={clip.id}
          type={clip.type}
          text={clip.text}
          bookmarkId={clip.bookmark_id}
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