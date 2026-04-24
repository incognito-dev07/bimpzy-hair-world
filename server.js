const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

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
    console.log(`🚀 Bimpzy Hair World running on http://localhost:${PORT}`);
    console.log(`📦 Database: storage.db`);
    console.log(`🔑 Admin: admin / admin123`);
  });
}

startServer();