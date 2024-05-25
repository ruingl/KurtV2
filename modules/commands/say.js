const fs = require("fs-extra");
const path = require("path");
const gtts = require("node-gtts")("en");

module.exports = new Object({
  config: new Object({
    name: "say",
    version: "1.0.0",
    author: "Rui",
    role: 0,
    usage: "say [message]",
    usePrefix: false,
    cooldown: 5,
  }),

  async onRun({ api, event, args }) {
    try {
      const message = args.join(" ");
      if (!message) {
        throw new Error("Please provide a message to say.");
      }

      const audioFilePath = path.join(__dirname, "tmp", "tts.mp3");
      gtts.save(audioFilePath, message, async function (err, result) {
        if (err) {
          console.error("Error occurred while generating TTS:", err);
          const errorMessage = `❌ | An error occurred while trying to generate TTS audio: ${err.message}`;
          api.sendMessage(errorMessage, event.threadID);
          return;
        }
        console.log("TTS audio file created successfully");
        await api.sendMessage(
          {
            body: `Sayed: ${message}`,
            attachment: fs.createReadStream(audioFilePath),
          },
          event.threadID,
        );
        fs.unlinkSync(audioFilePath);
      });
    } catch (error) {
      console.error(`❌ | Failed to execute "say" command: ${error.message}`);
      const errorMessage = `❌ | An error occurred while trying to execute the command. Please try again later.`;
      api.sendMessage(errorMessage, event.threadID);
    }
  },
});
