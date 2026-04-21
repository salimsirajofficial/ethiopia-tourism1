require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log('Testing connection with URL:', process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@'));

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Success!');
    const [results] = await sequelize.query('SELECT current_user;');
    console.log('Current user:', results);
  } catch (err) {
    console.error('Failed:', err.message);
  } finally {
    process.exit();
  }
}

run();
