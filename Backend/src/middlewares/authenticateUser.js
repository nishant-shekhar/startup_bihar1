


const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key'; // Make sure this is stored securely

// JWT verification middleware
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expecting 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized access, token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Attach user data to the request
    req.user = user;
    next();
  });
};

// Export the middleware
module.exports = { authenticateUser };
