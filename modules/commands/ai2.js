module.exports = new Object({
  config: new Object({
    name: "ai2",
    usePrefix: false,
    description: "ai but conversational",
    usage: "{pn} [query]",
    cooldown: 5,
    role: 0,
  }),

  onRun: async function ({ message, args, cmdName, fonts, event }) {
    const input = args.join(" ");
    const { Hercai } = require("hercai");
    const herc = new Hercai();

    if (!args) {
      message.reply("❌ | Please provide a query!");
    } else {
      const onReply = global.client.replies;
      const response = await herc.question({
        model: "v3",
        content: input,
      });

      const info = await message.reply(
        `${response.reply}\n\n${fonts.sans("Reply to continue conversation!")}`,
      );
      onReply.set(info.messageID, {
        cmdName,
        author: event.senderID,
      });
    }
  },

  onReply: async function ({ message, args, data, cmdName, fonts, event }) {
    const { Hercai } = require("hercai");
    const herc = new Hercai();

    if (data.author === event.senderID) {
      const onReply = global.client.replies;
      const response = await herc.question({
        model: "v3",
        content: event.body,
      });

      const info = await message.reply(
        `${response.reply}\n\n${fonts.sans("Reply to continue conversation!")}`,
      );
      onReply.set(info.messageID, {
        cmdName,
        author: event.senderID,
      });
    } else {
      message.reply("why u replyin");
    }
  },
});