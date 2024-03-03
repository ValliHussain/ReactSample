// server/db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "valli",
  host: "localhost",
  database: "postgres",
  password: "Valli",
  port: 5432,
});

module.exports = pool;
