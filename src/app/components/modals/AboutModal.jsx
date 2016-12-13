import {ipcRenderer, remote} from 'electron';
import Dialog from 'material-ui/Dialog';
import React from 'react';

import constants from '../../utils/constants';

const appVersion = remote.app.getVersion();

export default class AboutModal extends React.Component {
  constructor() {
    super();

    this.state = {
      open: false
    };

    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on(constants.Ipc.AboutModal, event => {
      this.setState({open: true});
    });
  }

  handleClose() {
    this.setState({open: false});
  }

  // Send the link to the main process to open in an external browser
  openLink(link) {
    ipcRenderer.send(constants.Ipc.OpenLink, link);
  }

  render() {
    return (
      <Dialog
        modal={false}
        open={this.state.open}
        contentStyle={{width: '250px'}}
        onRequestClose={this.handleClose}
      >
        <div id="about">
          <div id="about-image-container">
            <img
              id="about-image"
              src="public/img/about.png"
            />
          </div>

          <div id="about-content-container">
            <div id="about-app-name">Clipt</div>

            <div id="about-content">
              <div id="about-version">Version {appVersion}</div>
              <div id="about-credits">Credits</div>

              <div id="about-creditor">
                {'Icons: '}

                <a
                  href=""
                  onClick={() => this.openLink('https://goo.gl/C6pdp0')}
                >
                  Nicholas Merten
                </a>
              </div>

              <div id="about-author">
                {'Copyright © 2016 '}

                <a
                  href=""
                  onClick={() => this.openLink('https://goo.gl/53rcXV')}
                >
                  Anthony Li
                </a>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}