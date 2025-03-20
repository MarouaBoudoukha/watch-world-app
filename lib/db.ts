// lib/db.ts
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export interface Database {
  all: (sql: string, params: any[], callback: (err: Error | null, rows: any[]) => void) => void;
  get: (sql: string, params: any[], callback: (err: Error | null, row: any) => void) => void;
  run: (sql: string, params: any[], callback: (err: Error | null) => void) => void;
}

async function initializeDatabase() {
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });

  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      world_id TEXT UNIQUE,
      role TEXT DEFAULT 'user',
      company_name TEXT,
      budget REAL DEFAULT 0,
      logo_url TEXT,
      is_registered BOOLEAN DEFAULT 0,
      username TEXT,
      profile_picture_url TEXT,
      total_views INTEGER DEFAULT 0,
      total_earnings REAL DEFAULT 0,
      videos_watched INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS verified_actions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      action TEXT,
      signal TEXT,
      reward REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(world_id)
    );

    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id TEXT,
      title TEXT,
      description TEXT,
      url TEXT,
      reward REAL,
      status TEXT DEFAULT 'pending',
      views INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(company_id) REFERENCES users(world_id)
    );
  `);

  return db;
}

const db = await initializeDatabase();

export default db;