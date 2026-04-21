/**
 * INFRASTRUCTURE LAYER — Auth Module
 * Isolates all JWT operations so the rest of the codebase
 * never imports `jsonwebtoken` directly.
 */
const jwt = require('jsonwebtoken');
const env = require('../../../shared/config/env');

const JwtService = {
  
  sign(payload) {
    return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
  },

 
  verify(token) {
    return jwt.verify(token, env.jwt.secret);
  },
};

module.exports = JwtService;
