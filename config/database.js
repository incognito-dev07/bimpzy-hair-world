const { Pool } = require('pg');

let pool = null;

async function initDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not set in environment variables');
    throw new Error('DATABASE_URL is required');
  }
  
  console.log('📡 Connecting to Supabase via Session Pooler...');
  
  pool = new Pool({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000,
    keepAlive: true,
    // Session pooler specific settings
    max: 10,
    idleTimeoutMillis: 30000,
  });
  
  // Test connection
  try {
    const client = await pool.connect();
    console.log('✅ Connected to Supabase PostgreSQL (Session Pooler)');
    client.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
  
  // Create tables
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image_data TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT,
      image_data TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('✅ Tables created/verified');
  return pool;
}

async function query(sql, params = []) {
  try {
    const result = await pool.query(sql, params);
    return result.rows;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

async function run(sql, params = []) {
  try {
    const result = await pool.query(sql, params);
    return { 
      changes: result.rowCount, 
      lastInsertRowid: result.rows[0]?.id || null 
    };
  } catch (error) {
    console.error('Run error:', error);
    throw error;
  }
}

async function get(sql, params = []) {
  const result = await pool.query(sql, params);
  return result.rows[0] || null;
}

module.exports = { 
  initDatabase, 
  query, 
  run, 
  get
};