import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DEFAULT_DB_DIR = process.env.DB_DIR || path.join(process.cwd(), 'data');
const DB_PATH = process.env.DB_PATH || path.join(DEFAULT_DB_DIR, 'verifications.db');

let db: import('better-sqlite3').Database;

export const initDatabase = () => {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  db = new Database(DB_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS verification_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      credential_hash TEXT NOT NULL,
      verified BOOLEAN NOT NULL,
      worker_id TEXT NOT NULL,
      verified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      credential_data TEXT
    );
  `);
  console.log('Verification DB initialized');
};

export const getDatabase = (): import('better-sqlite3').Database => {
  if (!db) throw new Error('Database not initialized');
  return db;
};

export const closeDatabase = () => {
  if (db) db.close();
};


