'use strict';

const nedb = require('nedb');

// Initialize and load the local database
const db = new nedb({
  filename: './.db/clipboard.db',
  autoload: true
});

db.loadDatabase();

// Retrieve all clips from the database
exports.getClips = (cb) => {
  // Sort by timestamp in in ascending order (earliest to latest)
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
  db.remove({_id: id}, (err, count) => {
    if (err) {
      return cb(err, null);
    }

    cb(null, count);
  });
};