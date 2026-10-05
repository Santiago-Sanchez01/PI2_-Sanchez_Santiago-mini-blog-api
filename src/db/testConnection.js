require('dotenv').config();

const pool = require('./index');

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');

    console.log('Conexión exitosa a PostgreSQL');
    console.log('Hora de PostgreSQL:', result.rows[0].now);
  } catch (error) {
    console.error('Error al conectar con PostgreSQL:', error.message);
  } finally {
    await pool.end();
  }
}

testConnection();