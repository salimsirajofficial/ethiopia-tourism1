require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

async function check() {
  try {
    await sequelize.authenticate();
    const [counts] = await sequelize.query(`
      SELECT 
        (SELECT COUNT(*) FROM destinations) as dest_count,
        (SELECT COUNT(*) FROM tours) as tour_count
    `);
    console.log('Database Stats:', counts[0]);
    
    const [dests] = await sequelize.query('SELECT name FROM destinations LIMIT 3');
    console.log('Sample Destinations:', dests);
  } catch (err) {
    console.error('Check failed:', err.message);
  } finally {
    process.exit();
  }
}
check();
