const express = require('express');
const router = express.Router();
const { verifyAdminLogin, generateAdminKey } = require('../config/auth');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  const isValid = await verifyAdminLogin(username, password);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const adminKey = generateAdminKey();
  
  res.cookie('adminKey', adminKey, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
  });
  
  res.json({ 
    success: true, 
    message: 'Login successful'
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie('adminKey');
  res.json({ success: true, message: 'Logged out successfully' });
});

router.get('/verify', (req, res) => {
  const adminKey = req.cookies.adminKey;
  
  if (adminKey === generateAdminKey()) {
    res.json({ valid: true });
  } else {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;