const { Pool } = require("pg");
require("dotenv").config();
const pool = new Pool({
  user: process.env.USER,
  password: process.env.PW,
  database: process.env.DB,
  host: process.env.HOST,
  port: 5432,
});
module.exports = pool;
