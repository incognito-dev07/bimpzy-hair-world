const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

dotenv.config();

const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;
let pool = null;

// Health check endpoint for uptime monitoring
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Disable caching for HTML responses - users always see latest changes
app.use((req, res, next) => {
  if (req.path.endsWith('.html') || req.path === '/' || req.path === '/products' || req.path === '/booking' || req.path === '/admin/login' || req.path === '/admin/dashboard') {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

// Cache static assets (CSS, JS, images) for 1 day with version query param
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

// Rate limiting for API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// Stricter rate limit for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts, please try again later.' }
});
app.use('/api/admin/login', loginLimiter);

// CORS - allow all origins (same as original)
app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/', require('./routes/index'));

// Start server
async function startServer() {
  pool = await initDatabase();
  const server = app.listen(PORT, () => {
    console.log(`Bimpzy Hair World running on http://localhost:${PORT}`);
  });
  
  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing gracefully...');
    server.close(async () => {
      if (pool && pool.end) {
        await pool.end();
        console.log('Database connection closed');
      }
      process.exit(0);
    });
  });
  
  process.on('SIGINT', async () => {
    console.log('SIGINT received, closing gracefully...');
    server.close(async () => {
      if (pool && pool.end) {
        await pool.end();
        console.log('Database connection closed');
      }
      process.exit(0);
    });
  });
}

startServer();