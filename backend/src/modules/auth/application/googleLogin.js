const axios = require('axios');
const UserRepository = require('../infrastructure/user.repository');
const JwtService = require('../infrastructure/jwt.service');
const UserEntity = require('../domain/user.entity');

const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';


const googleLogin = async ({ access_token, username: providedUsername }) => {
  // 1. Guard
  if (!access_token) {
    throw { status: 400, message: 'Google access token is required' };
  }

  // 2. Fetch verified user info from Google
  const { data } = await axios.get(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const { email, name, sub: googleId } = data;

  // 3. Find or create account
  const rawUser = await UserRepository.findByEmailOrGoogleId(email, googleId);

  let user;
  if (!rawUser) {
    // New Google user — generate a username if not provided
    const username =
      providedUsername ||
      `${email.split('@')[0]}${Math.floor(Math.random() * 1000)}`;

    user = await UserRepository.create({
      full_name: name,
      username,
      email,
      google_id: googleId,
    });
  } else {
    // Existing user — link Google ID if first time signing in via Google
    if (!rawUser.googleId) {
      await UserRepository.updateGoogleId(rawUser.id, googleId);
    }
    user = new UserEntity(rawUser);
  }

  // 4. Issue token
  const token = JwtService.sign({
    id: user.id,
    email: user.email,
    username: user.username,
  });

  return { token, user: user.toPublicProfile() };
};

module.exports = googleLogin;
