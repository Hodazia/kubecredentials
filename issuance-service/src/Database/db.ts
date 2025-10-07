import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DEFAULT_DB_DIR = process.env.DB_DIR || path.join(process.cwd(), 'data');
const DB_PATH = process.env.DB_PATH || path.join(DEFAULT_DB_DIR, 'credentials.db');
let db: import('better-sqlite3').Database;

export const initDatabase = () => {
  // Ensure the directory exists before opening the database
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  db = new Database(DB_PATH);
  
  // Create credentials table
  db.exec(`
    CREATE TABLE IF NOT EXISTS credentials (
      id TEXT PRIMARY KEY,
      credential_data TEXT NOT NULL,
      credential_hash TEXT UNIQUE NOT NULL,
      worker_id TEXT NOT NULL,
      issued_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database initialized successfully');
};

export const getDatabase = (): import('better-sqlite3').Database => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

export const closeDatabase = () => {
  if (db) {
    db.close();
  }
};
