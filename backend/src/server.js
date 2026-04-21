
require('dotenv').config();

const app = require('./app');
const env = require('./shared/config/env');
const logger = require('./shared/utils/logger');
const sequelize = require('./shared/db/sequelize');

// Ensure all models are loaded for sync
require('./modules/auth/infrastructure/user.model');
require('./modules/dashboard/infrastructure/booking.model');
require('./modules/tourism/infrastructure/destination.model');
require('./modules/tourism/infrastructure/favorite.model');

const PORT = env.port;

const backfillUserTimestamps = async () => {
  try {
    const [result] = await sequelize.query(`
      UPDATE "users"
      SET
        "created_at" = COALESCE("created_at", NOW()),
        "updated_at" = COALESCE("updated_at", NOW())
      WHERE "created_at" IS NULL OR "updated_at" IS NULL;
    `);
    const updatedRows = result?.rowCount ?? result;
    if (updatedRows) {
      logger.info(`Backfilled ${updatedRows} user timestamp(s).`);
    }
  } catch (err) {
    logger.warn('Skipping user timestamp backfill:', err.message);
  }
};

(async () => {
  try {
    await backfillUserTimestamps();
    await sequelize.sync(); // Simple sync without slow schema alterations
    logger.info('Database synchronized (tourism).');
    app.listen(PORT, () => {
      logger.info(`Auth server running on http://localhost:${PORT}`);
      logger.info('Modules: auth (/api/auth), dashboard (/api/dashboard)');
    });
  } catch (err) {
    logger.error('Failed to sync database:', err.message);
    process.exit(1);
  }
})();
