module.exports = {
  config: {
    name: "uid",
    role: 0,
    description: "Get the user's Facebook UID.",
    usage: "{p}uid\n {p}uid @mention",
    author: "Rui",
  },
  async onRun({ api, event }) {
    try {
      if (Object.keys(event.mentions).length === 0) {
        if (event.messageReply) {
          const senderID = event.messageReply.senderID;
          await api.sendMessage(`UID: ${senderID}`, event.threadID);
        } else {
          await api.sendMessage(`Your UID: ${event.senderID}`, event.threadID);
        }
      } else {
        for (const mentionID in event.mentions) {
          const mentionName = event.mentions[mentionID];
          await api.sendMessage(
            `${mentionName.replace("@", "")}'s UID: ${mentionID}`,
            event.threadID,
          );
        }
      }
    } catch (error) {
      console.error("Error in uid command:", error);
      await api.sendMessage(
        "An error occurred while processing your request.",
        event.threadID,
      );
    }
  },
};
