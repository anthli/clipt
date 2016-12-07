'use strict';

const path = require('path');

module.exports = {
  content: __dirname,
  entry: './src/app/main.js',
  target: 'electron',
  output: {
    path: path.join(__dirname, './src/dist'),
    filename: 'main.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
};