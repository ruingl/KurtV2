const fs = require("fs-extra");
const log = require("./includes/log");
const path = require("path");

async function loadAll() {
  const errs = {};
  const commandsPath = path.join(__dirname, "modules", "commands");
  const eventsPath = path.join(__dirname, "modules", "events");

  try {
    Object.keys(require.cache).forEach((key) => delete require.cache[key]);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js")) || file.endsWith(".ts");

    commandFiles.forEach((file) => {
      try {
        let cmdFile = require(path.join(commandsPath, file));
        if (cmdFile && cmdFile.default) {
          cmdFile = cmdFile.default;
        };

        if (!cmdFile) {
          throw new Error(`Error: ${file} does not export anything!`);
        } else if (!cmdFile.config) {
          throw new Error(`Error: ${file} does not export config!`);
        } else if (!cmdFile.onRun) {
          throw new Error(`Error: ${file} does not export onRun!`);
        } else {
          global.client.commands.set(cmdFile.config.name, cmdFile);
        }
      } catch (error) {
        log.error(`Error loading command ${file}: ${error.message}`);
        errs[file] = error;
      }
    });

    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith(".js")) || file.endsWith(".ts");

    eventFiles.forEach((file) => {
      try {
        let evntFile = require(path.join(eventsPath, file));
        if (evntFile && evntFile.default) {
          evntFile = evntFile.default;
        };
        
        if (!evntFile) {
          throw new Error(`Error: ${file} does not export anything!`);
        } else if (!evntFile.config) {
          throw new Error(`Error: ${file} does not export config!`);
        } else if (!evntFile.onEvent) {
          throw new Error(`Error: ${file} does not export onEvent!`);
        } else {
          global.client.events.set(evntFile.config.name, evntFile);
        }
      } catch (error) {
        log.error(`Error loading event ${file}: ${error.message}`);
        errs[file] = error;
      }
    });
  } catch (error) {
    log.error(error.stack);
    errs[file] = error;
  }
  return Object.keys(errs).length === 0 ? false : errs;
}

module.exports = { loadAll };
