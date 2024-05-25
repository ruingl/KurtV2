const { spawn } = require("child_process");
const log = require("./includes/log");

function start() {
  const bot = spawn("node", ["main.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
  });

  bot.on("close", (code) => {
    if (code === 2) {
      log.info("Bot is restarting.");
      start();
    }
  });

  bot.on("error", (err) => {
    log.error(`Error starting bot: ${err.message}`);
  });
}

start();
