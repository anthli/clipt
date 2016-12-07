import _ from 'lodash';
import {ipcRenderer} from 'electron';
import React, {Component} from 'react';

import Clip from './Clip';
import Clips from './Clips';

import constants from '../utils/constants';

export default class Home extends Component {
  constructor() {
    super();

    this.state = {
      clips: []
    };

    this.checkBookmark = this.checkBookmark.bind(this);
  }

  componentWillMount() {
    ipcRenderer.send(constants.Ipc.GetClips);

    ipcRenderer.on(constants.Ipc.Clips, (event, clips) => {
      this.setState(() => ({
        clips: clips
      }));
    });
  }

  componentDidMount() {
    ipcRenderer.send(constants.Ipc.ClipsReady);
  }

  checkBookmark(id) {
    let index = _.findIndex(this.state.clips, clip => clip.id === id);
    let clip = this.state.clips[index];

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
        />
      );
    });

    return (
      <Clips clips={clips} />
    );
  }
}