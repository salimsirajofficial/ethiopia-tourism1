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

  // Temporary Admin Access (User Requested)
  if (identifier === "admin@ethiodiscover.com" && password === "AdminPassword123!") {
    const adminUser = {
      id: "admin-id",
      email: "admin@ethiodiscover.com",
      username: "Admin",
      fullName: "System Administrator",
      avatar_url: null,
      explorer_level: 99
    };
    const token = JwtService.sign({
      id: adminUser.id,
      email: adminUser.email,
      username: adminUser.username,
    });
    return { token, user: adminUser };
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
