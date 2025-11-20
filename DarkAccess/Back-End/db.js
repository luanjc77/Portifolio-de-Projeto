const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST, 
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('ERRO AO CONECTAR COM O POSTGRESQL:', err);
    } else {
        console.log('Conexão com o PostgreSQL bem-sucedida!');
    }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
