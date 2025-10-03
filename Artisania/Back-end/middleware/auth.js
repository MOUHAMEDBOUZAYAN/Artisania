const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('Auth middleware: Authorization header:', authHeader);
    
    const token = authHeader?.replace('Bearer ', '');
    console.log('Auth middleware: Extracted token:', token ? 'Token present' : 'No token');
    
    if (!token) {
      console.log('Auth middleware: No token provided');
      return res.status(401).json({ 
        message: 'Access denied. No token provided.' 
      });
    }

    const secret = process.env.JWT_SECRET || 'Mouhamed12@';
    console.log('Auth middleware: Using secret:', secret.substring(0, 10) + '...');
    
    const decoded = jwt.verify(token, secret);
    console.log('Auth middleware: Decoded token:', decoded);
    
    const user = await User.findById(decoded.userId).select('-password');
    console.log('Auth middleware: Found user:', user ? user.email : 'No user found');
    
    if (!user || !user.isActive) {
      console.log('Auth middleware: User not found or inactive');
      return res.status(401).json({ 
        message: 'Token is not valid or user is inactive.' 
      });
    }

    req.user = user;
    console.log('Auth middleware: Token verified successfully for user:', user.email);
    next();
  } catch (error) {
    console.log('Auth middleware: Error:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired.' 
      });
    }
    res.status(500).json({ 
      message: 'Server error during token verification.' 
    });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required.' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

const requireVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({ 
      message: 'Account verification required.' 
    });
  }
  next();
};

module.exports = {
  verifyToken,
  requireRole,
  requireVerified
};
