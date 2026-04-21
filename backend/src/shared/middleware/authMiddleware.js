const jwt    = require('jsonwebtoken');
const env    = require('../config/env');
const logger = require('../utils/logger');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwt.secret);
    req.user = decoded; // { id, email, username }
    next();
  } catch (error) {
    logger.warn('Invalid token attempt:', error.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;
