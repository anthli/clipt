'use strict';

exports.createTables = `
  CREATE TABLE IF NOT EXISTS clip (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    type TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS starred_clip (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clip_id INTEGER NOT NULL UNIQUE,
    FOREIGN KEY(clip_id) REFERENCES clip(id) ON DELETE CASCADE
  );

  PRAGMA foreign_keys = ON;
`;

exports.getAllClips = `
  SELECT C.id, C.text, C.type, S.id AS starred_clip_id
  FROM clip C
  LEFT JOIN starred_clip S
    ON C.id = S.clip_id
  ORDER BY C.id DESC;
`;

exports.getLastInsertedClip = `
  SELECT * FROM clip
  WHERE id = (
    SELECT last_insert_rowid()
  );
`;

exports.getLastStarredClip = `
  SELECT * FROM starred_clip
  WHERE id = (
    SELECT last_insert_rowid()
  );
`;

exports.insertClip = `
  INSERT INTO clip (text, type) VALUES ($1, $2);
`;

exports.starClip = `
  INSERT INTO starred_clip (clip_id) VALUES($1);
`;

exports.deleteClip = `
  DELETE FROM clip WHERE id = $1;
`;

exports.unstarClip = `
  DELETE FROM starred_clip WHERE id = $1;
`;