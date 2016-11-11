'use strict';

const {app} = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3');

const constants = require('./constants');
const queries = require('./queries');

let db;

module.exports.configure = () => {
  // Load the SQLite database
  const dbPath = path.join(constants.UserDataDir, constants.DbFile);
  db = new sqlite3.Database(dbPath);

  // Create the tables if they does not exist
  db.exec(queries.createTables);
};

// Retrieve all Clips from the database
module.exports.getClips = (cb) => {
  db.all(queries.getAllClips, (err, rows) => {
    if (err) {
      return cb(err, null);
    }

    cb(null, rows);
  });
};

// Upsert the given Clip into the database and return the last row inserted
module.exports.upsertClip = (clip, cb) => {
  db.get(queries.findClip, clip.text, (err, row) => {
    if(err) {
      return cb(err);
    }

    // Update the existing row's timestamp
    if (row) {
      let clipData = [clip.timestamp, row.id];

      db.run(queries.updateClip, clipData, (err) => {
        if (err) {
          return cb(err);
        }

        cb(null);
      });
    }
    // The row doesn't exist
    else {
      let clipData = [clip.text, clip.type, clip.timestamp];

      db.run(queries.insertClip, clipData, (err) => {
        if (err) {
          return cb(err);
        }

        db.get(queries.getLastInsertedClip, (err, row) => {
          if (err) {
            return cb(err);
          }

          // Insert the image data into the database if there is any
          if (clip.image) {
            let imageData = [row.id, clip.image];

            db.run(queries.insertImage, imageData, (err) => {
              if (err) {
                return cb(err);
              }

              return cb(null);
            });
          }

          cb(null);
        });
      });
    }
  });
};

// Star a Clip in the database given its id and return the last row inserted
module.exports.starClip = (id, cb) => {
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
module.exports.deleteClip = (id, cb) => {
  db.run(queries.deleteClip, id, (err) => {
    if (err) {
      return cb(err);
    }

    cb(null);
  });
};

// Unstar a Clip in the database given its clip_id
module.exports.unstarClip = (id, cb) => {
  db.run(queries.unstarClip, id, (err) => {
    if (err) {
      return cb(err);
    }

    cb(null);
  });
};