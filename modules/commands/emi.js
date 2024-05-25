const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "emi",
    hasPrefix: false,
    author: "Vex | AkhiroDEV",
    description: "Image Generator",
    usage: "emi [prompt]",
  },
  onRun: async function ({ message, args, api, event }) {
    api.setMessageReaction("🕐", event.messageID, (err) => {}, true);
    try {
      const prompt = args.join(" ");
      const emiApiUrl = "https://deku-rest-api.replit.app/emi";

      const emiResponse = await axios.get(emiApiUrl, {
        params: {
          prompt: prompt,
        },
        responseType: "arraybuffer",
      });

      const cacheFolderPath = path.join(__dirname, "/tmp");
      if (!fs.existsSync(cacheFolderPath)) {
        fs.mkdirSync(cacheFolderPath);
      }
      const imagePath = path.join(
        cacheFolderPath,
        `${Date.now()}_generated_image.png`,
      );
      fs.writeFileSync(imagePath, Buffer.from(emiResponse.data, "binary"));

      const stream = fs.createReadStream(imagePath);
      api.sendMessage(
        {
          body: "",
          attachment: stream,
        },
        event.threadID,
        event.messageID,
      );
    } catch (error) {
      console.error("Error:", error);
      message.reply(
        "❌ | An error occurred. Please try again later." + error.message,
      );
    }
  },
};
