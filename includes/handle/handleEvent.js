module.exports = async function ({
  api,
  message,
  event,
  log,
  fonts,
  Users,
  Threads,
}) {
  const { events } = global.client;

  try {
    for (const { config, onEvent } of events.values()) {
      if (event && config.name) {
        const args = event.body?.split("");
        await onEvent({
          Users,
          Threads,
          api,
          message,
          event,
          log,
          fonts,
          args,
        });
      }
    }
  } catch (error) {
    log.error(error.stack);
    message.reply(
      `❌ | ${error.message}\n${error.stack}\n${error.name}\n${error.code}\n${error.path}`,
    );
  }
};
