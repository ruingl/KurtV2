const axios = require("axios");

module.exports = new Object({
  config: new Object({
    name: "blackbox",
    description: "blackbox api by josh 💕",
    author: "Rui | Joshua Sy",
    usePrefix: false,
    cooldown: 5,
  }),

  onRun: async function({
    message, args, fonts
  }) {
    const input = args.join(" ");

    if (!input) {
      message.reply("❌ | Please provide a query!");
    } else {
      try {
        const response = await axios.get(`https://joshweb.click/blackbox?prompt=${encodeURIComponent(input)}`);
        
        message.react("⏳");
        await new Promise((r) => setTimeout(r, 1000));
        
        message.reply(`${fonts.bold("◾ | Blackbox")}\n━━━━━━━━━━━━━━━\n${response.data.data}\n\nTime Now: [ ${new Date().toLocaleTimeString()} ]`);
        message.react("✅");
      } catch (error) {
        message.reply(`❌ | An error occurred. ${error}`);
      }
    }
  },
});