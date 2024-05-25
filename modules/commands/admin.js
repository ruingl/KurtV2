module.exports = new Object({
  config: new Object({
    name: "admin",
    description: "admin cmd",
    usage: "{pn} [ add | remove | list ]",
    cooldown: 5,
    role: 1,
  }),

  onRun: async ({
    message, args,
    api, event,
    fonts
  }) => {
    const fs = require("fs-extra");
    const path = require("path");
    const configPath = path.join(
      process.cwd(), "json", "config.json"
    );
    const configData = fs.readFileSync(configPath);
    const config = JSON.parse(configData);
    const input = args[0]?.toLowerCase();
    
    switch (input) {
      case "list":
        const { botAdmins } = global.client;
        let listMessage = `👑 | ${fonts.bold("Bot Admins")}
━━━━━━━━━━━━━━━
`;
        for (const adminId of botAdmins) {
          const userInfo = await api.getUserInfo(adminId);
          const adminName = userInfo[adminId]?.name || "Unknown";
          listMessage += `➤ ${adminName}\n`;
        };
        message.reply(listMessage);
        break;
      case "add":
        if (!event.messageReply) {
          message.reply(`❌ | ${fonts.bold("Error")}
━━━━━━━━━━━━━━━
Reply to user that you want to add as admin!`);
        } else {
          const id = event.messageReply.senderID;
          if (id) {
            if (!config.botAdmins.includes(id)) {
              config.botAdmins.push(id);
              fs.writeJSONSync(configPath, config);
              message.reply(`✅ | ${fonts.bold("Admin Added!")}
━━━━━━━━━━━━━━━
Added admin successfully!`);
            } else {
              message.reply(`❌ | ${fonts.bold("Admin Error")}
━━━━━━━━━━━━━━━
User is already an admin!`);
            }
          }
        }
        break;
      case "remove":
        if (!event.messageReply) {
          message.reply(`❌ | ${fonts.bold("Error")}
━━━━━━━━━━━━━━━
Please reply to the message of the admin you want to remove.`);
          return;
        }

        const idToRemove = event.messageReply.senderID;
        if (idToRemove) {
          if (config.botAdmins.includes(idToRemove)) {
            const index = config.botAdmins.indexOf(idToRemove);
            config.botAdmins.splice(index, 1);
            fs.writeJSONSync(configPath, config);
            message.reply(`✅ | ${fonts.bold("Admin Removed!")}
━━━━━━━━━━━━━━━
Removed admin successfully!`);
          } else {
            message.reply(`❌ | ${fonts.bold("Admin Error")}
━━━━━━━━━━━━━━━
The specified user is not an admin.`);
          }
        } else {
          message.reply(`❌ | ${fonts.bold("Error")}
━━━━━━━━━━━━━━━
Failed to retrieve user ID from the replied message.`);
        }
        break;
      default:
        message.reply(`❌ | ${fonts.bold("Error")}
━━━━━━━━━━━━━━━
Invalid subcommand. Please use \`add\`, \`remove\`, or \`list\`.`);
        break;
    }
  },
});