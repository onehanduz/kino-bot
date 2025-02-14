const bootstrap = require("./src/main");
const pool = require("./src/db");

try {
  pool.connect();
} catch (err) {
  console.log(err);
}
bootstrap();
