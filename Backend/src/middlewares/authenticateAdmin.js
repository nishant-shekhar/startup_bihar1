

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your'; // Store securely in environment variables

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expecting 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized access, admin token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Verify if the token has admin privileges
    if (!decodedToken.admin_id) {
      return res.status(403).json({ error: 'Access denied: Admin privileges required' });
    }

    // Attach admin data to the request for use in subsequent routes
    req.admin = decodedToken;
    next();
  });
};

// Export the middleware
module.exports = { authenticateAdmin };
