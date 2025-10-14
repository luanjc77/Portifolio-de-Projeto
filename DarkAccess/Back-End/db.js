const { Pool } = require('pg');

const pool = new Pool({
  user: 'pinguin',
  host: 'localhost', 
  database: 'darkaccess',
  password: 'postgress_pinguin_77',
  port: 5432,
});

// Testa a conexão para garantir que tudo está funcionando
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