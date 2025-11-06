const sqlite3 = require('sqlite3').verbose();

// ✅ Create and open database
const db = new sqlite3.Database('store.db', (err) => {
  if (err) {
    console.error("❌ DB Error:", err.message);
  } else {
    console.log("✅ Connected to SQLite database.");
  }
});

// ✅ Initialize tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT,
      price REAL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER,
      qty INTEGER
    )
  `);
});

// ✅ Export the db instance
module.exports = db;
