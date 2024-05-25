const axios = require("axios");

module.exports = new Object({
  config: new Object({
    name: "box",
 version: "9.0.1",
    description: "chat with blackbox api",
role: 0,
    author: "kurt",
    usePrefix: false,
    usage: "{pn} <ask>",
    cooldown2: 0,
}),
onRun: async function({api, event ,args }) {
try {
const ask = args.join(" ");
if(!ask){
return api.sendMessage(`❌ | please provide a question.`, event.threadID, event.messageID);
}
   const processingMessage = await api.sendMessage(
          `🕕 | Answering...`,
          event.threadID,
        );
const response = await axios.get(`https://boxgptapi.replit.app/api/chatgpt?msg=${encodeURIComponent(ask)}`);
const t = response.data.message;
api.sendMessage(`
𝗕𝗹𝗮𝗰𝗸𝗯𝗼𝘅𝗔𝗜
━━━━━━━━━━━━━━━
 ${t}`, event.threadID, event.messageID);
} catch (error) {
api.sendMessage(`❌ | error fetching blackbox api`, event.threadID, event.messageID);
console.log(error);
}
}
});