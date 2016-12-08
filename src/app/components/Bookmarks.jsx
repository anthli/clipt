import _ from 'lodash';
import {ipcRenderer} from 'electron';
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

    this.deleteBookmark = this.deleteBookmark.bind(this);
    this.deleteClip = this.deleteClip.bind(this);
  }

  componentWillMount() {
    ipcRenderer.send(constants.Ipc.GetBookmarks);

    ipcRenderer.on(constants.Ipc.Bookmarks, (event, clips) => {
      this.setState(() => ({
        clips: clips
      }));
    });
  }

  componentDidMount() {
    ipcRenderer.send(constants.Ipc.ReadyToDisplay);
  }

  // Delete the Bookmark given its id
  deleteBookmark(id) {
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
          deleteBookmark={this.deleteBookmark}
          deleteClip={this.deleteClip}
        />
      );
    });

    return (
      <Clips clips={clips} />
    );
  }
}