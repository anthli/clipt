# Clipt

Working on a research paper where you copied some information to use, but
accidentally copied over it with the URL of a funny post on Reddit?

With Clipt, whatever you copy will be stored and can be used at a later
time. Never again will you have to worry about copying over something
important!

![alt text](./src/public/img/demo.png)

## Features
- Clips are copied at the click of a (left mouse) button
- Ordered by timestamp and displayed top to bottom in descending order (latest
  to earliest)
- Application window closes when a Clip is copied so you can get right back to
  work
- Ability to bookmark and delete Clips on demand
- Customizable shortcut to open and close the application window
- Minimizing to the menu/task bar without the application quitting
- Prevention of duplicate Clips by utilizing and updating the timestamps

## Features To Be Added
- Copying of images

## Development

### Requirements
- [Node.js](https://goo.gl/QXkkAl)
- [Yarn](https://goo.gl/QRG7dO) (optional, but significantly faster than npm)

To start developing, clone the repo and run the following:

```bash
# If you're using npm
$ npm install

# If you're using Yarn
$ yarn

$ npm run build/watch
$ npm run start
```

To build executables, run the following:

```bash
$ npm run portable
```

To build the installer, run the following:

```bash
$ npm run dist
```
