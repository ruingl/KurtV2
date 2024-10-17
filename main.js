process.on("unhandledRejection", (error) => console.log(error));
process.on("uncaughtException", (error) => console.log(error));

const fs = require("fs-extra");
const path = require("path");
const express = require("express");
const figlet = require("figlet");
const chalk = require("chalk");
const login = require("./includes/login");
const log = require("./includes/log");
const configPath = path.join(__dirname, "json", "config.json");
const configData = fs.readFileSync(configPath);
const config = JSON.parse(configData);
const app = new express();
const port = process.env.PORT || 3000;

global.client = new Object({
  startTime: new Date(),
  config: config,
  botPrefix: config.botPrefix,
  botAdmins: config.botAdmins,
  commands: new Map(),
  events: new Map(),
  replies: new Map(),
  cooldowns: new Map(),
  reactions: {},
});

global.data = new Object({
  allUsers: null,
  allThreads: null,
});

async function start() {
  app.use(express.static("./includes/web"));
  app.listen(port);
  
  const appState = fs.readJSONSync(
    path.join(__dirname, "json", "cookies.json"),
  );
  const utils = require("./utils");
  global.utils = utils;

  figlet.text("KurtV2", (err, data) => {
    if (err) return log.error(err);

    utils.loadAll();
    console.log(chalk.cyan(data));
    console.log(chalk.blue(`› Bot Name: ${config.botName}`));
    console.log(chalk.blue(`› Bot Owner: ${config.botOwner}`));
    console.log(chalk.blue(`› Time: ${new Date().toLocaleString()}`));
    console.log(chalk.blue(`› KurtV2 is running on port: ${port}`));
    console.log();

    app.get("/", (req, res) => {
      res.send("Online!");
    });

    app.listen(port);

    login(
      {
        appState,
      },
      (err, api) => {
        if (err) return log.error(err);

        fs.writeFileSync(
          "./json/cookies.json",
          JSON.stringify(api.getAppState()),
        );
        api.setOptions(config.fcaOptions);

        api.listen(async (err, event) => {
          if (err) return log.error(err);
          const listen = require("./includes/listen");
          listen({ api, event });
        });
      },
    );
  });
}

start();
