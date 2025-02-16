const pool = require("./db");
async function checker(bot, chatId) {
  const member = (await pool.query("SELECT * FROM channels;")).rows;
  let res = true;
  for (const member1 of member) {
    let getChatMember = await bot.getChatMember(member1.telegram_id, chatId);
    let status = getChatMember.status;
    if (status == "left" || status == "restricted" || status == "kicked") {
      res = false;
      return;
    }
  }
  return res;
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

async function addChannel(code, link) {
  const added = await pool.query(
    "INSERT INTO channels VALUES(DEFAULT,$1, $2)",
    [code, link]
  );
}

async function deleteChannel(code) {
  const deleted = await pool.query("DELETE FROM channels WHERE id =$1;", [
    code,
  ]);
}

async function deleteCode(code) {
  const deleted = await pool.query("DELETE FROM code WHERE id =$1;", [code]);
}
async function getChannel(code, link) {
  const channels = (await pool.query("SELECT * FROM channels")).rows;
  let key = [];
  let num = 1;
  channels.forEach((channel) => {
    key.push([{ text: num + "-kanal", url: channel.link }]);
    num++;
  });
  key.push([
    {
      text: "✅ Obuna bo'ldim",
      callback_data: "done",
    },
  ]);
  return key;
}

module.exports = {
  checker,
  userChecker,
  isAdmin,
  loadAllCode,
  addCode,
  addChannel,
  getChannel,
  deleteChannel,
  deleteCode,
};
