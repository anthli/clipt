import React, {Component} from 'react';

export default class SearchBar extends Component {
  constructor() {
    super();

    this.state = {
      query: ''
    };
  }

  render() {
    return (
      <div id="search-bar">
        <i className="fa fa-search"></i>
        <input type="text" placeholder="Search..." />
      </div>
    );
  }
}