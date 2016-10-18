'use strict';

const {app} = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3');

const constants = require('./constants');
const queries = require('./queries');

// Load the SQLite database
const db = new sqlite3.Database(path.join(
  app.getPath(constants.db.userData),
  constants.db.path
));

// Create the tables if they does not exist
db.exec(queries.createTables);

// Retrieve all clips from the database
exports.getClips = (cb) => {
  db.all(queries.getAllClips, (err, rows) => {
    if (err) {
      return cb(err, null);
    }

    cb(null, rows);
  });
};

// Insert the given clip into the database
exports.addClip = (clip, cb) => {
  let data = [clip.text, clip.type];

  db.run(queries.insertClip, data, (err) => {
    if (err) {
      return cb(err, null);
    }

    // Return the last row inserted
    db.get(queries.getLastInsertedClip, (err, row) => {
      if (err) {
        return cb(err, null);
      }

      cb(null, row);
    });
  });
};

// Star a clip in the database given its id
exports.starClip = (id, cb) => {
  db.run(queries.starClip, id, (err) => {
    if (err) {
      return cb(err);
    }

    cb(null);
  })
}

// Delete a clip in the database given its id
exports.deleteClip = (id, cb) => {
  db.run(queries.deleteClip, id, (err) => {
    if (err) {
      return cb(err);
    }

    cb(null);
  });
};