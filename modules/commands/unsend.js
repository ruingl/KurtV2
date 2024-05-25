module.exports = new Object({
  config: new Object({
    name: "unsend",
    role: 0,
    usage: "{pn} [reply]",
    description: "Unsend bot's message",
    author: "Rui",
    cooldown: 0,
  }),

  onRun: async function ({ api, event, message }) {
    if (!event.messageReply) {
      message.react("❓")
      message.reply("❌ | Reply to the message that you want to unsend!");
    } else {
      api.unsendMessage(event.messageReply.messageID);
    }
  },
});