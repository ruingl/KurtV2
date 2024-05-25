module.exports = new Object({
  config: new Object({
    name: "out",
    role: 1,
    usePrefix: false,
    author: "kurt",
    description: "Bot leaves the thread",
    usage: "{pn} [ out ]",
    cooldown: 10,
  }),

  onRun: async function({ api, event, args }) {
    try {
      if (!args[0])
        return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
      if (!isNaN(args[0]))
        return api.removeUserFromGroup(api.getCurrentUserID(), args.join(" "));
    } catch (error) {
      api.sendMessage(error.message, event.threadID, event.messageID);
    }
  },
});