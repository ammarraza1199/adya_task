const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'hrms_v3.db'), { verbose: console.log });
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS policies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = db;
