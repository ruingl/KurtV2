const { spawn } = require("child_process");

module.exports = new Object({
  config: new Object({
    name: "shell",
    description: "bash shell",
    author: "Rui",
    role: 1,
  }),

  onRun: async function ({ message, args, fonts }) {
    const input = args.join(" ");
    const runner = spawn(input, { shell: true });

    runner.stdout.on("data", (data) => {
      message.reply(
        `💻 | ${fonts.bold("Console")}\n━━━━━━━━━━━━━━━\n${data.toString()}`,
      );
    });

    runner.stderr.on("data", (data) => {
      message.reply(
        `💻 | ${fonts.bold("Error")}\n━━━━━━━━━━━━━━━\n${data.toString()}`,
      );
    });

    runner.on("error", (error) => {
      message.reply(
        `💻 | ${fonts.bold("Error")}\n━━━━━━━━━━━━━━━\n${error.message}`,
      );
    });

    runner.on("close", (code) => {
      if (code !== 0) {
        message.reply(
          `💻 | ${fonts.bold("Exit Code")}\n━━━━━━━━━━━━━━━\nCommand exited with code ${code}`,
        );
      }
    });
  },
});
