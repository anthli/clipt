# Clipt

Working on a research paper where you copied some information to use, but
accidentally copied over it with the URL of a funny post on Reddit?

With Clipt, whatever you copy will be stored and can be used at a later
time. Never again will you have to worry about copying over something
important!

![alt text](./public/imgs/search.png)

## Features
- Displays clips in descending order (latest to earliest) so the most recent
  clips appear at the top, and the oldest ones at the bottom
- Clips can be deleted on demand (currently being worked on)
- Searching for clips can be easily done through the search bar at the bottom
- Currently, the supported data can be copied:
  - text
- To be added:
  - images
  - documents

## Development

### Requirements
- [Node.js](https://goo.gl/QXkkAl)
- [Bower](https://goo.gl/j0z3QO)
- [Electron](https://goo.gl/3gzXUm)

To start developing, clone the repo and run the following:

```bash
$ bower install
$ npm install
$ npm start
```

To build all installers, run the following:

```bash
$ npm run build
```

For individual installers:

```bash
$ npm run build:win (Windows)
$ npm run build:darwin (macOS)
$ npm run build:linux (Linux)
```