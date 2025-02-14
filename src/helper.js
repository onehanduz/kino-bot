const pool = require("./db");
const member1 = "-1002367043482";
async function checker(bot, chatId) {
  let getChatMember = await bot.getChatMember(member1, chatId);
  let status = getChatMember.status;
  if (status == "creator" || status == "member" || status == "admin") {
    return true;
  } else {
    return false;
  }
}

async function userChecker(chatId) {
  const user = await pool.query("SELECT * FROM users WHERE telegram_id = $1", [
    chatId,
  ]);
  if (user.rowCount == 0) {
    const userAdd = await pool.query(
      "INSERT INTO users VALUES(DEFAULT,$1, FALSE)",
      [chatId]
    );
  }
}
async function isAdmin(chatId) {
  const user = await pool.query("SELECT * FROM users WHERE telegram_id = $1", [
    chatId,
  ]);
  if (user.rows[0].isadmin == 1) {
    return true;
  } else {
    return false;
  }
}

async function loadAllCode() {
  const code = await pool.query("SELECT * FROM code");
  return code.rows;
}

async function addCode(code, msg_id) {
  const added = await pool.query("INSERT INTO code VALUES(DEFAULT,$1, $2)", [
    code,
    msg_id,
  ]);
}

module.exports = {
  checker,
  userChecker,
  isAdmin,
  loadAllCode,
  addCode,
};
