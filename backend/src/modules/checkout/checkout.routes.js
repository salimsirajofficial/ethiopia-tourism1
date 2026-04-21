const express = require('express');
const checkoutController = require('./checkout.controller');
const jwt = require('jsonwebtoken');
const env = require('../../shared/config/env');

const idUpload = require('../../shared/utils/idUpload');

const router = express.Router();

/**
 * Mid-layer middleware to check for optional token.
 * This allows /checkout to be used by both logged-in and logged-out users.
 */
const optionalToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, env.jwt.secret);
      req.user = decoded;
    } catch (err) {
      // If token is invalid, we treat them as a guest or return error? 
      // For checkout, if they provided an invalid token, we might want to warn them.
    }
  }
  next();
};

/**
 * POST /api/checkout
 * Integrated booking and registration.
 */
router.post('/',
  optionalToken,
  idUpload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'passport', maxCount: 1 }
  ]),
  checkoutController.processCheckout
);

module.exports = router;
