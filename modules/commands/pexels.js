const axios = require("axios");
const path = require("path");

module.exports = new Object({
  config: new Object({
    name: "pexels",
    author: "ArYAN | Kurt",
    role: 0,
    cooldown: 5,
    description: "This command allows you to search for images on pinterest based on a given query and fetch a specified number of images.",
    usage: "{pn} [query]",
  }),

  onRun: async function ({ api, event, args }) {
    try {
      const fs = require("fs-extra");
      const keySearch = args.join(" ");
      if (!keySearch.includes("-")) {
        return api.sendMessage(
          "⛔ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗨𝘀𝗲\n━━━━━━━━━━━━━━━\n\nPlease enter the search query and number of images (1-99)",
          event.threadID,
          event.messageID
        );
      }
      const keySearchs = keySearch.substr(0, keySearch.indexOf('-'))
      let numberSearch = keySearch.split("-").pop() || 99
    if (numberSearch> 99 ){
      numberSearch = 99
    }

      const apiUrl = `https://aryan-apis.onrender.com/api/pexels?query=${encodeURIComponent(keySearchs)}&keysearch=${numberSearch}&apikey=aryan`;


      const res = await axios.get(apiUrl);
      const data = res.data.result;
      const imgData = [];

      for (let i = 0; i < Math.min(numberSearch, data.length); i++) {
        const imgResponse = await axios.get(data[i], {
          responseType: "arraybuffer"
        });
        const imgPath = path.join(__dirname, "cache", `${i + 1}.jpg`);
        await fs.outputFile(imgPath, imgResponse.data);
        imgData.push(fs.createReadStream(imgPath));
      }

      await api.sendMessage({
        body: `📸 𝗣𝗲𝘅𝗲𝗹𝘀\n━━━━━━━━━━━━━━━\n\n𝖧𝖾𝗋𝖾 𝗂𝗌 𝗍𝗁𝖾 𝗍𝗈𝗉 ${numberSearch} 𝗋𝖾𝗌𝗎𝗅𝗍𝗌 𝖿𝗈𝗋 𝗒𝗈𝗎𝗋 𝗊𝗎𝖾𝗋𝗒 ${keySearchs}`,
        attachment: imgData,
      }, event.threadID, event.messageID);

      await fs.remove(path.join(__dirname, "cache"));
    } catch (error) {
      console.error(error);
      return api.sendMessage(
        `An error occurred.`,
        event.threadID,
        event.messageID
      );
    }
  }
});