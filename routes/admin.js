const express = require('express');
const router = express.Router();
const { verifyAdminLogin, generateAdminKey } = require('../config/auth');

// POST admin login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  const isValid = await verifyAdminLogin(username, password);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json({ 
    success: true, 
    message: 'Login successful',
    adminKey: generateAdminKey()
  });
});

// GET verify admin token
router.get('/verify', (req, res) => {
  const adminKey = req.headers['x-admin-key'];
  
  if (adminKey === generateAdminKey()) {
    res.json({ valid: true });
  } else {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;