'use strict';

exports.createTables = `
  CREATE TABLE IF NOT EXISTS clip (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    type TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS starred_clip (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    c_id INTEGER,
    FOREIGN KEY(c_id) REFERENCES clip(id)
  );
`;

exports.deleteClip = `
  DELETE FROM clip WHERE id = $1
`;

exports.getAllClips = `
  SELECT * FROM clip ORDER BY id DESC
`;

exports.getLastInsertedClip = `
  SELECT * FROM clip
  WHERE id = (
    SELECT last_insert_rowid()
  );
`;

exports.insertClip = `
  INSERT INTO clip (text, type) VALUES ($1, $2);
`;

exports.starClip = `
  INSERT INTO starred_clip (c_id) VALUES($1);
`;