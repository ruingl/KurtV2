const _ = require("lodash");

module.exports = async function ({
  message,
  fonts,
  api,
  event,
  log,
  Users,
  Threads,
}) {
  const { botPrefix, botAdmins, commands, cooldowns } = global.client;

  try {
    if (!event.body) return; // fixed the mf bug - Liane
    let [command, ...args] = event.body?.trim().split(" ");

    if (command.startsWith(botPrefix)) {
      command = command.slice(botPrefix.length);
    }

    if (event.body.toLowerCase() === "prefix") {
      message.reply(`My prefix is: ${botPrefix}`);
    } else if (event.body) {
      const cmdFile = commands.get(command.toLowerCase());

      if (cmdFile) {
        try {
          if (cmdFile.config.role === 1) {
            if (!_.includes(botAdmins, Number(event.senderID))) {
              return message.reply(
                "❌ | You don't have permission to use this command.",
              );
            }
          }

          const now = Date.now();
          const cooldownKey = `${event.senderID}_${command.toLowerCase()}`;
          const cooldownTime = cmdFile.config.cooldown || 0;
          const cooldownExpiration = cooldowns[cooldownKey] || 0;
          const secondsLeft = Math.ceil((cooldownExpiration - now) / 1000);

          if (cooldownExpiration && now < cooldownExpiration) {
            return message.reply(
              `❌ | Please wait ${secondsLeft}s to use this command!`,
            );
          }

          cooldowns[cooldownKey] = now + cooldownTime * 1000;

          const usePrefix = cmdFile.config.usePrefix !== false;

          if (usePrefix && !event.body.toLowerCase().startsWith(botPrefix)) {
            return;
          }

          await cmdFile.onRun({
            Users,
            Threads,
            cmdName: command && command.toLowerCase(),
            message,
            fonts,
            api,
            event,
            args,
            log,
          });
        } catch (error) {
          log.error(error.stack);
          message.reply(
            `❌ | ${error.message}\n${error.stack}\n${error.name}\n${error.code}\n${error.path}`,
          );
        }
      } else if (event.body?.startsWith(botPrefix)) {
        message.reply(
          `❌ | The command ${command ? `"${command}"` : "that you are using"} doesn't exist, use ${botPrefix}help to view available commands`,
        );
      }
    }
  } catch (error) {
    log.error(error.stack);
    message.reply(
      `❌ | ${error.message}\n${error.stack}\n${error.name}\n${error.code}\n${error.path}`,
    );
  }
};