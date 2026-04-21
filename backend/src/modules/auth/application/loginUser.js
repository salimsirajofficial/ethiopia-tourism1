/**
 * APPLICATION LAYER — Auth Module
 * Use-case: Log in with email/username + password.
 */
const bcrypt = require('bcrypt');
const UserRepository = require('../infrastructure/user.repository');
const JwtService = require('../infrastructure/jwt.service');
const UserEntity = require('../domain/user.entity');

/**
 * @param {{ identifier: string, password: string }} input
 * @returns {{ token: string, user: object }}
 * @throws {{ status: number, message: string }}
 */
const loginUser = async ({ identifier, password }) => {
  // 1. Input guard
  if (!identifier || !password) {
    throw { status: 400, message: 'Please provide identifier and password' };
  }

  // 2. Find user (returns DTO including password hash)
  const rawUser = await UserRepository.findByIdentifier(identifier);
  if (!rawUser) {
    throw { status: 400, message: 'Invalid identifier or password' };
  }

  // 3. Check auth method
  if (!rawUser.password) {
    throw { status: 400, message: 'Please log in using Google' };
  }

  // 4. Validate password
  const isValid = await bcrypt.compare(password, rawUser.password);
  if (!isValid) {
    throw { status: 400, message: 'Invalid identifier or password' };
  }

  // 5. Build domain entity & issue token
  const user = new UserEntity(rawUser);
  const token = JwtService.sign({
    id: user.id,
    email: user.email,
    username: user.username,
  });

  return { token, user: user.toPublicProfile() };
};

module.exports = loginUser;
