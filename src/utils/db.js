'use strict';

const {app} = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3');

const checkPath = require('./checkPath');
const constants = require('./constants');
const queries = require('./queries');

const userDataPath = app.getPath(constants.UserData);
const dbDir = path.join(userDataPath, constants.UserDir);

// Create the database file if it doesn't exist
const dbPath = dbDir + constants.DbFile;
if (!checkPath(dbDir, constants.DbFile)) {
  fs.writeFileSync(dbPath);
}

// Load the SQLite database
const db = new sqlite3.Database(dbPath);

// Create the tables if they does not exist
db.exec(queries.createTables);

// Retrieve all Clips from the database
exports.getClips = (cb) => {
  db.all(queries.getAllClips, (err, rows) => {
    if (err) {
      return cb(err, null);
    }

    cb(null, rows);
  });
};

// Insert the given Clip into the database and return the last row inserted
exports.addClip = (clip, cb) => {
  let data = [clip.text, clip.type];

  db.run(queries.insertClip, data, (err) => {
    if (err) {
      return cb(err, null);
    }

    db.get(queries.getLastInsertedClip, (err, row) => {
      if (err) {
        return cb(err, null);
      }

      cb(null, row);
    });
  });
};

// Star a Clip in the database given its id and return the last row inserted
exports.starClip = (id, cb) => {
  db.run(queries.starClip, id, (err) => {
    if (err) {
      return cb(err, null);
    }

    db.get(queries.getLastStarredClip, (err, row) => {
      if (err) {
        return cb(err, null);
      }

      cb(null, row);
    });
  });
};

// Delete a Clip in the database given its id
exports.deleteClip = (id, cb) => {
  db.run(queries.deleteClip, id, (err) => {
    if (err) {
      return cb(err);
    }

    cb(null);
  });
};

// Unstar a Clip in the database given its clip_id
exports.unstarClip = (id, cb) => {
  db.run(queries.unstarClip, id, (err) => {
    if (err) {
      return cb(err);
    }

    cb(null);
  });
};