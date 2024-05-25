const axios = require("axios");
const { createReadStream } = require("fs");
const { resolve } = require("path");

module.exports = {
  config: {
    name: "announce",
    author: "AkhiroDEV | LiANE | Rui",
    description: "Announce a message to all groups",
    role: 1,
    usage: "announce [ message ]",
  },
  async onRun({ api, event, args }) {
    const threadList = await api.getThreadList(25, null, ["INBOX"]);
    let sentCount = 0;
    const custom = args.join(" ");

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    async function sendMessage(thread) {
      try {
        await api.sendMessage(
          {
            body: `✱:｡✧𝗔𝗡𝗡𝗢𝗨𝗡𝗖𝗘𝗠𝗘𝗡𝗧✧｡:✱
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 💬 | 𝗠𝗘𝗦𝗦𝗔𝗚𝗘:
╰┈➤ ${custom}
━━━━━━━━━━━━━━━━━━━
📅 | 𝗗𝗔𝗧𝗘: ${currentDate}
⏰ | 𝗧𝗜𝗠𝗘: ${currentTime}`,
          },
          thread.threadID,
        );
        sentCount++;
      } catch (error) {
        console.error("Error sending  message:", error);
      }
    }

    for (const thread of threadList) {
      if (sentCount >= 20) {
        break;
      }
      if (
        thread.isGroup &&
        thread.name !== thread.threadID &&
        thread.threadID !== event.threadID
      ) {
        await sendMessage(thread);
      }
    }

    if (sentCount > 0) {
      api.sendMessage(`› Sent the notification successfully.`, event.threadID);
    } else {
      api.sendMessage(
        "› No eligible group threads found to send the message to.",
        event.threadID,
      );
    }
  },
};
