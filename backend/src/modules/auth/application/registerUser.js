
const bcrypt         = require('bcrypt');
const UserRepository = require('../infrastructure/user.repository');
const JwtService     = require('../infrastructure/jwt.service');
const UserEntity     = require('../domain/user.entity');


const registerUser = async ({ name, username, email, password }) => {
  // 1. Guard — check uniqueness
  const existing = await UserRepository.findByEmailOrUsername(email, username);
  if (existing) {
    if (existing.email === email) {
      throw { status: 400, message: 'Email already in use' };
    }
    if (existing.username === username) {
      throw { status: 400, message: 'Username already in use' };
    }
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Persist
  const user = await UserRepository.create({
    full_name: name,
    username,
    email,
    password: hashedPassword,
  });

  // 4. Issue token
  const token = JwtService.sign({
    id:       user.id,
    email:    user.email,
    username: user.username,
  });

  return { token, user: user.toPublicProfile() };
};

module.exports = registerUser;
