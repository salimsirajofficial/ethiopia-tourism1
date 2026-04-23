require('dotenv').config();
const sequelize = require('./src/shared/db/sequelize');
require('./src/modules/auth/infrastructure/user.model');
require('./src/modules/tourism/infrastructure/destination.model');
require('./src/modules/tourism/infrastructure/favorite.model');
require('./src/modules/tourism/infrastructure/tour.model');
require('./src/modules/tourism/infrastructure/culture.model');

async function syncDb() {
  try {
    console.log('Synchronizing database schema...');
    await sequelize.sync({ alter: true });
    console.log('Database synchronization complete.');
    process.exit(0);
  } catch (err) {
    console.error('Synchronization failed:', err);
    process.exit(1);
  }
}

syncDb();
