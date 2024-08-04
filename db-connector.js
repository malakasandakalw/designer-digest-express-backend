const { Pool } = require("pg")

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'designer_digest_db',
    password: 'bandarawela',
    port: 5432
});

module.exports = pool;