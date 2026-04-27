const ADMIN_KEY = process.env.ADMIN_KEY;

function verifyAdmin(req, res, next) {
  const adminKey = req.headers['x-admin-key'];
  
  if (!adminKey || adminKey !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }
  
  next();
}

module.exports = { verifyAdmin };