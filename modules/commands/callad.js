const _ = require("lodash");

module.exports = {
  config: {
    name: "callad",
    role: 0,
    description: "Notify all bot admins.",
    usePrefix: true,
    usage: "{pn} [question]",
  },
  async onRun({ cmdName, message, api, args, event }) {
    try {
      const botAdmins = global.client.config.botAdmins || [];
      if (!botAdmins.length) {
        return message.reply("Bot admins list is not available.");
      }

      if (!args.length) {
        return message.reply("Please provide a question.");
      }

      const question = args.join(" ");

      for (const adminID of botAdmins) {
        const info = await new Promise((resolve) => {
          api.sendMessage(
            `📢 | Attention! You've been called by a user with the question: "${question}"`,
            adminID,
            (_, info) => resolve(info),
          );
        });
        global.client.replies.set(info.messageID, {
          cmdName,
          userID: event.senderID,
        });
      }

      message.reply("✅ | Admins have been notified.");
    } catch (error) {
      console.error("Error in callad command:", error);
      message.reply("❌ | An error occurred while processing your request.");
    }
  },
  async onReply({ api, event, message, data }) {
    const { userID } = data;
    const u = await api.getUserInfo(userID);
    const userInfo = u[userID];

    message.reply("Sent message to user!");
    api.sendMessage(
      `To user ${userInfo.name}. The admin replied: ${event.body}`,
      userID,
    );
  },
};