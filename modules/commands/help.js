module.exports = {
  config: {
    name: "help",
    version: "1.0.0",
    description: "Show available commands",
    usage: "{pn} [cmd]",
    usePrefix: false,
    author: "Rui",
    role: 0,
  },
  async onRun({ message, args }) {
    const { botPrefix, commands } = global.client;

    if (!args.length) {
      args.push("1");
    }

    const page = parseInt(args[0]);
    if (!isNaN(page)) {
      const commandKeys = [...commands.keys()];
      const totalPages = Math.ceil(commandKeys.length / 10);
      const startIdx = (page - 1) * 10;
      const pageCommands = commandKeys.slice(startIdx, startIdx + 10);

      let reply = `╭─────────────⭓\n`;
      if (pageCommands.length > 0) {
        pageCommands.forEach((command, index) => {
          const config = commands.get(command).config;
          if (config) {
            const { name } = config;
            const num = startIdx + index + 1;
            reply += ` | ${num < 10 ? "0" + num : num}. ${name}\n`;
          }
        });
        reply += `├─────────────⭓\n | [ 🔥 | KurtV2 ]\n`;
      } else {
        reply +=
          " | No commands available.\n├─────────────⭓\n | [ 🔥 | KurtV2 ]\n";
      }
      reply += ` | 𝗣𝗮𝗴𝗲𝘀  ${page < 10 ? "0" + page : page} 𝗼𝗳 ${totalPages < 10 ? "0" + totalPages : totalPages}\n╰─────────────⭓`;
      message.reply(reply);
    } else {
      const cmd = args.join(" ");
      const command = commands.get(cmd);
      if (command) {
        const { name, description, role, author } = command.config;
        const formattedUsage = command.config.usage
          ? command.config.usage
              .replace("{p}", botPrefix)
              .replace("{pn}", `${botPrefix}${cmd}`)
          : "";
        const formattedRole = role === 0 ? "Everyone" : "Admin";
        const reply = `
╭─────────────⭓
 | Command: ${name}
 | Author: ${author}
 | Description: ${description}
 | Usage: ${formattedUsage}
 | Role: ${role === undefined ? "Everyone" : formattedRole}
├─────────────⭓
 | [ 🔥 | 𝗞𝘂𝗿𝘁𝗩2 ]
╰─────────────⭓
        `.trim();
        message.reply(reply);
      } else {
        message.reply(`Command "${cmd}" not found.`);
      }
    }
  },
};