const axios = require("axios");

module.exports = new Object({
  config: new Object({
  name: 'mistral',
  version: '1.0.0',
  role: 0,
  usePrefix: false,
  description: "Get response from Mistral AI",
  usage: "{pn} [query]",
  author: 'Kurt',
  cooldown: 3,
}),

onRun: async function({ api, event, args }) {
  const mistralApiUrl = "https://hashier-api-groq.vercel.app/api/groq/mistral";

  try {
    const query = args.join(" ");
    if (!query) {
      api.sendMessage("❓ | Please provide a query.", event.threadID, event.messageID);
      return;
    }

    const response = await axios.get(`${mistralApiUrl}?ask=${encodeURIComponent(query)}`);
    const data = response.data.response;

    const formattedResponse = `
𝗠𝗶𝘀𝘁𝗿𝗮𝗹𝗔𝗜
━━━━━━━━━━━━━━━
𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻: ${query}
━━━━━━━━━━━━━━━
𝗔𝗻𝘀𝘄𝗲𝗿: ${data}
    `;
    api.sendMessage(formattedResponse, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage("❌ | An error occurred while processing the command. Please try again.", event.threadID);
  }
}
  });