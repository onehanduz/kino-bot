const { Pool } = require("pg");
require("dotenv").config();
const pool = new Pool({
  user: process.env.USER,
  database: process.env.DB,
  password: process.env.PW,
  host: process.env.HOST,
  port: 5432,
});
module.exports = pool;
