'use strict';

const {app} = require('electron');
const nedb = require('nedb');
const path = require('path');

const constants = require('./constants');

// Initialize and load the local database
const db = new nedb({
  filename: path.join(
    app.getPath(constants.db.path),
    constants.db.dir,
    constants.db.file
  ),
  autoload: true
});

db.loadDatabase();

// Retrieve all clips from the database
exports.getClips = (cb) => {
  // Sort by timestamp in in descending order (latest to earliest)
  db.find({}).sort({timestamp: -1}).exec((err, docs) => {
    if (err) {
      return cb(err, null);
    }

    cb(null, docs);
  });
};

// Insert the given clip into the database
exports.addClip = (clip, cb) => {
  db.insert(clip, (err, doc) => {
    if (err) {
      return cb(err, null);
    }

    cb(null, doc);
  });
};

// Delete a clip in the database given its _id
exports.deleteClip = (id, cb) => {
  db.remove({_id: id}, {}, (err, count) => {
    if (err) {
      return cb(err, null);
    }

    cb(null, count);
  });
};