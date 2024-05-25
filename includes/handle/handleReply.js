module.exports = async function ({
  api,
  fonts,
  event,
  message,
  log,
  Users,
  Threads,
}) {
  const { replies, commands } = global.client;
  const args = event.body.split(" ");

  if (event.messageReply) {
    try {
      const { messageReply: replier = {} } = event;

      if (replies.has(replier.messageID)) {
        const { cmdName, ...data } = replies.get(replier.messageID);
        const cmdFile = commands.get(cmdName);

        await cmdFile.onReply({
          Users,
          Threads,
          api,
          event,
          fonts,
          args,
          message,
          log,
          data: data,
          cmdName,
        });
      }
    } catch (error) {
      log.error(error.stack);
      message.reply(
        `❌ | ${error.message}\n${error.stack}\n${error.name}\n${error.code}\n${error.path}`,
      );
    }
  }
};
