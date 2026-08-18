const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'mediyatra_secret_key_2026';

// Middleware to verify JWT token and attach user identity
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.headers['x-auth-token']) {
    token = req.headers['x-auth-token'];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized - No authentication token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, name, email, role }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized - Invalid or expired token'
    });
  }
};

// Middleware to enforce role-based authorization (e.g. authorize('Admin'))
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized - User identity missing'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden - Role '${req.user.role}' is not authorized to access this resource`
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
  JWT_SECRET
};
