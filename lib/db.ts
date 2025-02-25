// lib/db.ts
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./db.sqlite');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    world_id TEXT UNIQUE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS verified_actions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT,
    signal TEXT,
    reward REAL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

export default db;