module.exports = new Object({
  config: new Object({
    name: "eval",
    description: "eval cmd lol",
    author: "Rui",
    role: 1,
  }),

  onRun: async function (context) {
    const input = context.args.join(" ");
    try {
      const runner = await eval(input);
      context.message.reply(
        `💫 | ${context.fonts.bold("Eval")}\n${JSON.stringify(runner, null, 2)}`,
      );
    } catch (error) {
      context.message.reply(
        `💫 | ${context.fonts.bold("Eval Error")}\n${error.message}`,
      );
    }
  },
});
