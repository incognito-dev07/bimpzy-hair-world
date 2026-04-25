const bcrypt = require('bcryptjs');
const { get } = require('./database');

async function verifyAdminLogin(username, password) {
  var adminUsername = process.env.ADMIN_USERNAME || 'admin';
  var adminPasswordHash = process.env.ADMIN_PASSWORD ? bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10) : null;
  
  if (username === adminUsername) {
    if (adminPasswordHash) {
      return bcrypt.compareSync(password, adminPasswordHash);
    }
  }
  
  var admin = get('SELECT * FROM admin WHERE username = ?', [username]);
  if (!admin) return false;
  return bcrypt.compareSync(password, admin.password_hash);
}

function generateAdminKey() {
  return process.env.ADMIN_KEY;
}

module.exports = { verifyAdminLogin, generateAdminKey };