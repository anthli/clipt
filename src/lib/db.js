'use strict';

const {app} = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3');

const constants = require('./constants');

// Load the SQLite database
const db = new sqlite3.Database(path.join(
  app.getPath(constants.db.userData),
  constants.db.path
));

// db.run('DROP TABLE IF EXISTS clip');

// Create the table if it does not exist
db.run(constants.query.createTable);

// Retrieve all clips from the database
exports.getClips = (cb) => {
  db.all(constants.query.getAllRows, (err, rows) => {
    if (err) {
      return cb(err, null);
    }

    cb(null, rows);
  });
};

// Insert the given clip into the database
exports.addClip = (clip, cb) => {
  let data = [clip.text, clip.type];

  db.run(constants.query.insertRow, data, (err) => {
    if (err) {
      return cb(err, null);
    }

    // Return the last row inserted
    db.get(constants.query.getLastInsertedRow, (err, row) => {
      if (err) {
        return cb(err, null);
      }

      cb(null, row);
    });
  });
};

// Delete a clip in the database given its id
exports.deleteClip = (id, cb) => {
  db.run(constants.query.deleteRow, id, (err) => {
    if (err) {
      return cb(err);
    }

    cb(null);
  });
};