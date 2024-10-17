const { spawn } = require("child_process");

function start() {
  const bot = spawn("node", ["main.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
  });

  bot.on("close", (code) => {
    if (code === 2) start();
  });
}

start();