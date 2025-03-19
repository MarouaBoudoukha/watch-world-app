// lib/db.js

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// lib/db.ts
//import sqlite3 from 'sqlite3';
var sqlite3 = require("sqlite3");
var db = new sqlite3.Database('./db.sqlite');
db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS users (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    world_id TEXT UNIQUE,\n    role TEXT DEFAULT 'user'  -- Added role field\n  )");
    db.run("CREATE TABLE IF NOT EXISTS verified_actions (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    user_id INTEGER,\n    action TEXT,\n    signal TEXT,\n    reward REAL,\n    FOREIGN KEY(user_id) REFERENCES users(id)\n  )");
    db.run("CREATE TABLE IF NOT EXISTS videos (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    company_id INTEGER,\n    title TEXT,\n    description TEXT,\n    url TEXT,\n    reward REAL,\n    status TEXT DEFAULT 'pending',\n    FOREIGN KEY(company_id) REFERENCES users(id)\n  )");
});
exports.default = db;
