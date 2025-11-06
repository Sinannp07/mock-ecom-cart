const Database = require("better-sqlite3");

// Create / open database file
const db = new Database("database.db");

// Create products table
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT,
    price REAL
  );
`);

// Create cart table
db.exec(`
  CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER,
    qty INTEGER
  );
`);

module.exports = db;
