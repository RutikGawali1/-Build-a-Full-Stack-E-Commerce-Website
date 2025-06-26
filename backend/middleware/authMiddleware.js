// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers.token;
  if (!token) return res.status(403).json('Access denied');
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json('Invalid token');
    req.user = user;
    next();
  });
}

module.exports = verifyToken;