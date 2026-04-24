const bcrypt = require('bcryptjs');
const { get } = require('./database');

async function verifyAdminLogin(username, password) {
  const admin = get('SELECT * FROM admin WHERE username = ?', [username]);
  if (!admin) return false;
  return bcrypt.compareSync(password, admin.password_hash);
}

function generateAdminKey() {
  return process.env.ADMIN_KEY;
}

module.exports = { verifyAdminLogin, generateAdminKey };