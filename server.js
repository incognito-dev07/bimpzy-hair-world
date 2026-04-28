const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

dotenv.config();

const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

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
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));

// Start server
async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`Bimpzy Hair World running on http://localhost:${PORT}`);
    console.log(`Database: storage.db`);
  });
}

startServer();