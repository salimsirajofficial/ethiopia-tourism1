const { Sequelize } = require('sequelize');
const env    = require('../config/env');
const logger = require('../utils/logger');

const sequelize = env.db.databaseUrl 
  ? new Sequelize(env.db.databaseUrl, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      define: {
        timestamps: false,
        underscored: true,
      },
    })
  : new Sequelize(
      env.db.name,
      env.db.user,
      env.db.password,
      {
        host:    env.db.host,
        dialect: 'postgres',
        port:    env.db.port,
        logging: false,
        define: {
          timestamps:  false,
          underscored: true,
        },
      }
    );

sequelize
  .authenticate()
  .then(() => logger.info('Database connected successfully.'))
  .catch((err) => logger.error('Database connection failed:', err.message));

module.exports = sequelize;
