const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../data/storage.db');
let db = null;

async function initDatabase() {
  const SQL = await initSqlJs();
  
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
    console.log('✅ Loaded existing database');
  } else {
    db = new SQL.Database();
    console.log('✅ Created new database');
  }
  
  // Products table with image_data (base64) instead of image_filename
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT,
      image_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Bookings table
  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT,
      booking_date TEXT NOT NULL,
      booking_time TEXT NOT NULL,
      service_type TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Admin table
  db.run(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);
  
  // Insert default admin if empty
  const adminCount = db.exec('SELECT COUNT(*) as count FROM admin');
  if (adminCount[0].values[0][0] === 0) {
    const hashed = bcrypt.hashSync('admin123', 10);
    db.run(`INSERT INTO admin (username, password_hash) VALUES (?, ?)`, ['admin', hashed]);
    console.log('✅ Created admin: admin / admin123');
  }
  
  saveDatabase();
  return db;
}

function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

function query(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

function run(sql, params = []) {
  try {
    db.run(sql, params);
    saveDatabase();
    const lastId = db.exec('SELECT last_insert_rowid() as id');
    return { 
      changes: db.getRowsModified(), 
      lastInsertRowid: lastId[0]?.values[0][0] || null 
    };
  } catch (error) {
    console.error('Run error:', error);
    throw error;
  }
}

function get(sql, params = []) {
  const results = query(sql, params);
  return results[0] || null;
}

module.exports = { initDatabase, query, run, get, saveDatabase };