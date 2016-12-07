'use strict';

module.exports.createTables = `
  CREATE TABLE IF NOT EXISTS clip (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    type TEXT NOT NULL,
    timestamp INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS image (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clip_id INTEGER NOT NULL UNIQUE,
    image BLOB NOT NULL,
    FOREIGN KEY(clip_id) REFERENCES clip(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS bookmark (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clip_id INTEGER NOT NULL UNIQUE,
    FOREIGN KEY(clip_id) REFERENCES clip(id) ON DELETE CASCADE
  );

  PRAGMA foreign_keys = ON;
`;

module.exports.getAllClips = `
  SELECT C.id, B.id AS bookmark_id, C.type, C.timestamp, C.text, I.image
  FROM clip C
  LEFT JOIN bookmark B
    ON C.id = B.clip_id
  LEFT JOIN image I
    ON C.id = I.clip_id
  ORDER BY C.timestamp DESC;
`;

module.exports.findClip = `
  SELECT * FROM clip WHERE text = $1;
`;

module.exports.getLastInsertedClip = `
  SELECT * FROM clip
  WHERE id = (
    SELECT last_insert_rowid()
  );
`;

module.exports.getAllBookmarks = `
  SELECT C.id, B.id AS bookmark_id, C.type, C.timestamp, C.text, I.image
  FROM clip C
  LEFT JOIN bookmark B
    ON C.id = B.clip_id
  LEFT JOIN image I
    ON C.id = I.clip_id
  WHERE bookmark_id IS NOT NULL
  ORDER BY C.timestamp DESC;
`;

module.exports.getLastInsertedBookmark = `
  SELECT * FROM bookmark
  WHERE id = (
    SELECT last_insert_rowid()
  );
`;

module.exports.insertClip = `
  INSERT INTO clip (text, type, timestamp) VALUES ($1, $2, $3);
`;

module.exports.insertImage = `
  INSERT INTO image (clip_id, image) VALUES($1, $2);
`;

module.exports.insertBookmark = `
  INSERT INTO bookmark (clip_id) VALUES($1);
`;

module.exports.updateClip = `
  UPDATE clip SET timestamp = $1 WHERE id = $2;
`;

module.exports.updateImage = `
  UPDATE image SET image = $1 WHERE clip_id = $2;
`;

module.exports.deleteClip = `
  DELETE FROM clip WHERE id = $1;
`;

module.exports.deleteBookmark = `
  DELETE FROM bookmark WHERE id = $1;
`;