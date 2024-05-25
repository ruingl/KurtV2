module.exports = new Object({
  config: new Object({
    name: "shoti",
    description: "shoti api ni idol liby 🔥",
    author: "Rui | Liby",
    cooldown: 5,
    role: 0,
  }),
 
  onRun: async ({
    message, api, event
  }) => {
    try {
      const fs = require("fs-extra");
      const axios = require("axios");
      const path = require("path");
      const res = await axios.post(
        "https://shoti-srv1.onrender.com/api/v1/get",
        {
          apikey: "$shoti-1hn634vu67edaqv02qo",
        },
      );

      if (res.data.code === 200) {
        const videoData = res.data.data;
        const videoURL = videoData.url;
        const videoFilename = `${Date.now()}_shoti.mp4`;

        const videoBuffer = await axios.get(videoURL, { responseType: 'arraybuffer' });
        const videoPath = path.join(__dirname, 'videos', videoFilename);
        fs.writeFileSync(videoPath, Buffer.from(videoBuffer.data, 'utf-8'));

        const fileStream = fs.createReadStream(videoPath);
        await api.sendMessage({ attachment: fileStream, body: `@${videoData.user.nickname}` }, event.threadID);

        setTimeout(() => {
          fs.unlinkSync(videoPath);
        }, 5500);
      } else {
        api.sendMessage(`❌ | API Error: ${res.data}`, event.threadID);
      };
    } catch (error) {
      message.reply(`❌ | An error occured!, ${error}`);
    };
  },
});