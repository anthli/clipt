# Clipt

Working on a research paper where you copied some information to use, but
accidentally copied over it with the URL of a funny post on Reddit?

With Clipt, whatever you copy will be stored and can be used at a later
time. Never again will you have to worry about copying over something
important!

![alt text](./src/assets/images/demo.png)

## Features
- Clips are displayed top to bottom in descending order (latest to earliest)
- Ability to favorite and delete Clips on demand
- Customizable shortcut to open and close the application window
- Minimizing to the menu/task bar without the application quitting

## Features To Be Added
- Copying of images
- More settings that could utilize more shortcuts
- Restoring the custom title bar (was not working on Windows)

## Development

### Requirements
- [Node.js](https://goo.gl/QXkkAl)
- [Yarn](https://goo.gl/QRG7dO) (optional, but significantly faster than npm)

To start developing, clone the repo and run the following:

```bash
$ npm/yarn install
$ npm run rebuild
$ npm start
```

To build executables, run the following:

```bash
$ npm run pack
```

To build the installer, run the following:

```bash
$ npm run dist
```
