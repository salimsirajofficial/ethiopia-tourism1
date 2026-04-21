
const express      = require('express');
const router       = express.Router();
const { register, login, google, updateProfile } = require('./auth.controller');
const verifyToken  = require('../../../shared/middleware/authMiddleware');


router.get('/profile', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Protected route accessed', user: req.user });
});

router.put('/profile', verifyToken, updateProfile);

// Public
router.post('/register', register);
router.post('/login',    login);
router.post('/google',   google);

module.exports = router;
