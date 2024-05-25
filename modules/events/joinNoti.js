module.exports = {
  config: {
    name: "joinNoti",
    version: "1.0.0",
    description: "Join notifications",
    author: "Rui",
  },
  async onEvent({ message, api, event, fonts }) {
    const { botName, botPrefix, botAdmins } = global.client.config;

    if (
      event.logMessageType === "log:subscribe" &&
      event.logMessageData.addedParticipants?.some(
        (i) => i.userFbId == api.getCurrentUserID(),
      )
    ) {
      api.changeNickname(
        `[ ${botPrefix} ]: ${botName}`,
        event.threadID,
        api.getCurrentUserID(),
      );

      const threadInfo = await api.getThreadInfo(event.threadID);

      message.send(
        `› ${fonts.bold(`${botName}`)} ${fonts.sans(`connected successfully!\n\nUse ${botPrefix}help to see available commands!`)}`,
      );

      const adminMsg = `✅ | ${botName} joined the group: ${threadInfo.name} (${event.threadID})`;
      botAdmins.forEach((adminID) => {
        api.sendMessage(adminMsg, adminID);
      });
    } else if (
      event.logMessageType === "log:subscribe" &&
      event.logMessageData.addedParticipants?.some(
        (i) => i.userFbId !== api.getCurrentUserID(),
      )
    ) {
      const { addedParticipants } = event.logMessageData;
      const { threadID, author } = event;

      const authorInfo = await api.getUserInfo(author);

      const threadInfo = await api.getThreadInfo(threadID);
      const msg = `› Welcome ${addedParticipants.map((i) => i.fullName).join(", ")} to ${threadInfo.name}!

Added by: ${authorInfo.name} (${author})`;

      message.send(msg);
    }
  },
};
