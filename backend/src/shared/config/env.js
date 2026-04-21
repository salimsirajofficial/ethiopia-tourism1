/**
 * Centralized environment configuration.
 * All process.env access is isolated here — never read process.env elsewhere.
 */
module.exports = {
  port: parseInt(process.env.PORT, 10) || 5000,

  db: {
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    databaseUrl: process.env.DATABASE_URL,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
  },
};
