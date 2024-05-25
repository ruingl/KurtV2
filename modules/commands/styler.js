module.exports = new Object({
  config: new Object({
    name: "style",
    description: "style text lol",
    author: "Rui",
    cooldown: 5,
    usage: "{pn} - title input",
    role: 0,
  }),

  onRun: async function ({ message, args, fonts }) {
    const title = args.shift(" ");
    const input = args.join(" ");

    if (!title || !input) {
      message.reply("❌ | Fill title and input!");
    } else {
      message.reply(`${fonts.bold(title)}\n━━━━━━━━━━━━━━━\n${input}`);
    }
  },
});
