const axios = require("axios");

module.exports = {
  config: {
    name: "zoro",
    author: "AkhiroDEV",
    description: "Talk with ZoroAI",
    usage: "zoro [query]",
    role: 0,
  },
  async onRun({ api, event, args }) {
    const behavior = "you are zoro ai, a king of hell and a great swordsman on one piece that always protects his captain no matter what happens";
    const prompt = args.join(" ");
    if (!prompt) {
      return api.sendMessage(
        "Oy... What's your question?",
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