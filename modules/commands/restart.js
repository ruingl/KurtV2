module.exports = new Object({
  config: new Object({
    name: "restart",
    description: "restart lol",
    author: "Rui",
    role: 1,
  }),

  onRun: async function ({ message }) {
    await message.reply("Restarting...");
    process.exit(2);
  },
});
