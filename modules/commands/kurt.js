const { Hercai } = require("hercai");

module.exports = {
  config: {
    name: "kurt",
    version: "1.0.0",
    description: "ask kurt",
    usage: "{pn} [message]",
    author: "Rui",
    cooldown: 5,
    usePrefix: false,
    role: 0,
  },
  async onRun({ fonts, api, message, args }) {
    const query = args.join(" ");

    if (!query) {
      message.reply("❌ | Please provide a query!");
    } else {
      const herc = new Hercai();
      const info = await message.reply(`🔍 | ${query}`);

      const response = await herc.question({
        model: "v3",
        content: `Act like Kurt, the owner of KurtV2, you are a boy from the phillipines, speak tagalog. user asked: ${query}`,
      });
      api.editMessage(
        `${fonts.bold("Kurt")}\n━━━━━━━━━━━━━━━\n${response.reply}`,
        info.messageID,
      );
    }
  },
};
