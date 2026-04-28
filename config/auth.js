const bcrypt = require('bcryptjs');

function verifyAdminLogin(username, password) {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  
  if (!adminUsername || !adminPasswordHash) {
    console.error('Admin credentials not configured in .env file');
    return false;
  }
  
  if (username === adminUsername && bcrypt.compareSync(password, adminPasswordHash)) {
    return true;
  }
  return false;
}

function generateAdminKey() {
  return process.env.ADMIN_KEY;
}

module.exports = { verifyAdminLogin, generateAdminKey };