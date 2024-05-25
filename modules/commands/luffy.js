const axios = require("axios");

module.exports = {
  config: {
    name: "luffy",
    author: "AkhiroDEV",
    hasPrefix: false,
    description: "Talk with LuffyAI",
    usage: "luffy [query]",
  },
  async onRun({ api, event, args }) {
    const behavior = "you are luffy ai";
    const prompt = args.join(" ");
    if (!prompt) {
      return api.sendMessage(
        "Is there any question? What is it?",
        event.threadID,
        event.messageID,
      );
    }
    try {
      const response = await axios.get(
        `https://personal-ai-phi.vercel.app/kshitiz?prompt=${encodeURIComponent(prompt)}&content=${encodeURIComponent(behavior)}`,
      );
      const answer = response.data.answer;
      api.sendMessage(answer, event.threadID, event.messageID);
    } catch (error) {
      console.log(error);
      api.sendMessage(
        `Error: ${error.message}`,
        event.messageID,
        event.threadID,
      );
    }
  },
};
