const registerUser = require('../application/registerUser');
const loginUser    = require('../application/loginUser');
const googleLogin  = require('../application/googleLogin');
const logger       = require('../../../shared/utils/logger');

const handleError = (res, err) => {
  const isProd = process.env.NODE_ENV === 'production';

  if (err && err.status && err.message) {
    return res.status(err.status).json({ message: err.message });
  }

  logger.error('Unhandled controller error:', err?.stack || err);
  if (!isProd && err?.message) {
    return res.status(500).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Internal server error' });
};

const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json({ message: 'User registered successfully', ...result });
  } catch (err) {
    handleError(res, err);
  }
};

const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json({ message: 'Login successful', ...result });
  } catch (err) {
    handleError(res, err);
  }
};

const google = async (req, res) => {
  try {
    const result = await googleLogin(req.body);
    res.status(200).json({ message: 'Google login successful', ...result });
  } catch (err) {
    handleError(res, err);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await require('../infrastructure/user.repository').updateProfile(id, req.body);
    if (!result) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'Profile updated successfully', user: result });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = { register, login, google, updateProfile };
