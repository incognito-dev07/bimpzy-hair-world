const bcrypt = require('bcryptjs');

function verifyAdminLogin(username, password) {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (username === adminUsername && password === adminPassword) {
    return true;
  }
  return false;
}

function generateAdminKey() {
  return process.env.ADMIN_KEY;
}

module.exports = { verifyAdminLogin, generateAdminKey };