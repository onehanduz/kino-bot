const TelegramBot = require("node-telegram-bot-api");
const {
  checker,
  userChecker,
  isAdmin,
  loadAllCode,
  addCode,
  addChannel,
  getChannel,
  deleteChannel,
  deleteCode,
} = require("./helper");
const pool = require("./db");
require("dotenv").config();
const token = process.env.TOKEN;
const generalChannel = "-1002367043482";

const bootstrap = () => {
  const bot = new TelegramBot(token, { polling: true });
  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data == "done") {
      if (await checker(bot, chatId)) {
        userChecker(chatId);
        const resp = "✅ *Kino kodini yuboring*";
        bot.sendMessage(chatId, resp, {
          parse_mode: "Markdown",
        });
      } else {
        const resp =
          "*⚠️Botdan foydalanish uchun\n ‼️Iltimos quyidagi kanallarga obuna bo'ling*";
        const inline = await getChannel();
        bot.sendMessage(chatId, resp, {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: inline,
          },
        });
      }
    }
  });
  bot.onText(":x:", async (msg) => {
    const chatId = msg.chat.id;
    if (await isAdmin(chatId)) {
      const user = await pool.query("SELECT * FROM users;");
      const text = msg.text.split(":")[2];
      user.rows.forEach((element) => {
        bot.sendMessage(element.telegram_id, text, {
          parse_mode: "Markdown",
        });
      });
    }
  });
  bot.onText(":c:", async (msg) => {
    const chatId = msg.chat.id;
    if (await isAdmin(chatId)) {
      const code = msg.text.split(":")[2];
      const link = msg.text.split(":")[3] + ":" + msg.text.split(":")[4];
      await addChannel(code, link);
      bot.sendMessage(chatId, "Qo'shildi", {
        parse_mode: "Markdown",
      });
    }
  });
  bot.onText(":d:", async (msg) => {
    const chatId = msg.chat.id;
    if (await isAdmin(chatId)) {
      const code = msg.text.split(":")[2];
      await deleteChannel(code);
      bot.sendMessage(chatId, "O'chirildi", {
        parse_mode: "Markdown",
      });
    }
  });
  bot.onText(":o:", async (msg) => {
    const chatId = msg.chat.id;
    if (await isAdmin(chatId)) {
      const code = msg.text.split(":")[2];
      await deleteCode(code);
      bot.sendMessage(chatId, "O'chirildi", {
        parse_mode: "Markdown",
      });
    }
  });
  bot.onText(":k:", async (msg) => {
    const chatId = msg.chat.id;
    if (await isAdmin(chatId)) {
      const code = msg.text.split(":")[2];
      const msg_id = msg.text.split(":")[3];
      addCode(code, msg_id);
    }
  });
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (await checker(bot, chatId)) {
      if (text == "/start") {
        userChecker(chatId);
        const resp = "✅ *Kino kodini yuboring*";
        bot.sendMessage(chatId, resp, {
          parse_mode: "Markdown",
        });
      } else if (text == "/admin") {
        if (await isAdmin(chatId)) {
          const resp = "*Siz Admin munyusiga kirdingiz*";
          bot.sendMessage(chatId, resp, {
            parse_mode: "Markdown",
            reply_markup: {
              resize_keyboard: true,
              one_time_keyboard: true,
              keyboard: [
                ["Kino qo'shish", "Kino o'chirish"],
                ["Kanal qo'shish", "Kanal o'chirish"],
                ["Xabar yuborish"],
                ["Bot stastikasi"],
              ],
            },
          });
        }
      } else if (text == "Kino qo'shish" && (await isAdmin(chatId))) {
        const resp = "*Kino qo'shmoqchi bo'lsangiz*: `:k:kodi:msg_id`";
        bot.sendMessage(chatId, resp, {
          parse_mode: "Markdown",
        });
      } else if (text == "Kino o'chirish" && (await isAdmin(chatId))) {
        let channel = (await pool.query("SELECT * FROM code")).rows;
        let respose = "*Kanal o'chirmoqchi bo'lsangiz*: `:o:kod idsi`";
        for (const iterator of channel) {
          respose = `${respose} \n ${iterator.id} - kod: ${iterator.code}`;
        }
        bot.sendMessage(chatId, respose, {
          parse_mode: "Markdown",
        });
      } else if (text == "Kanal qo'shish" && (await isAdmin(chatId))) {
        let resp =
          "*Kanal qo'shmoqchi bo'lsangiz*: `:c:kanal idsi:kanal linki`";
        bot.sendMessage(chatId, resp, {
          parse_mode: "Markdown",
        });
      } else if (text == "Kanal o'chirish" && (await isAdmin(chatId))) {
        let channel = (await pool.query("SELECT * FROM channels")).rows;
        let respose = "*Kanal o'chirmoqchi bo'lsangiz*: `:d:kanal idsi`";
        for (const iterator of channel) {
          respose = `${respose} \n ${iterator.id} - [link](${iterator.link})`;
        }
        bot.sendMessage(chatId, respose, {
          parse_mode: "Markdown",
        });
      } else if (text == "Xabar yuborish" && (await isAdmin(chatId))) {
        const resp =
          "*Foydalanuvchilarga xabar yubormoqchi bo'lsangiz* \n`:x:xabarning matni`";
        bot.sendMessage(chatId, resp, {
          parse_mode: "Markdown",
        });
      } else if (text == "Bot stastikasi" && (await isAdmin(chatId))) {
        const user = await pool.query("SELECT * FROM users;");
        const resp = "*Foydalanuvchilar soni: *" + user.rowCount;
        bot.sendMessage(chatId, resp, {
          parse_mode: "Markdown",
        });
      } else {
        const codes = await loadAllCode();
        let done = 1;
        codes.forEach((code) => {
          if (text == code.code) {
            bot.forwardMessage(chatId, generalChannel, code.msg_id);
            done = 0;
          }
        });
        if (done) {
          bot.sendMessage(chatId, "*❌ Xato xabar yuborildi*", {
            parse_mode: "Markdown",
          });
        }
      }
    } else {
      userChecker(chatId);
      const resp =
        "*⚠️Botdan foydalanish uchun\n ‼️Iltimos quyidagi kanallarga obuna bo'ling*";
      const inline = await getChannel();
      bot.sendMessage(chatId, resp, {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: inline,
        },
      });
    }
  });
};
module.exports = bootstrap;
