const axios = require("axios");

module.exports = {
  config: {
    name: "horoscope",
    version: "1.0.0",
    author: "Rui",
    role: 0,
    usage: "horoscope [sign]",
    description: "Get daily horoscope for a specific zodiac sign.",
    usePrefix: true,
    cooldown: 5,
  },

  async onRun({ api, event, args }) {
    try {
      const sign = args[0] || "aries";
      const response = await axios.get(
        `https://horoscope-astrology.p.rapidapi.com/zodiac_sign_get?sign=${sign}`,
        {
          headers: {
            "x-rapidapi-host": "horoscope-astrology.p.rapidapi.com",
          },
        },
      );
      const horoscope = response.data.horoscope;
      api.sendMessage(
        `Horoscope for ${sign.toUpperCase()}: ${horoscope}`,
        event.threadID,
      );
    } catch (error) {
      console.error(`❌ | Failed to fetch horoscope: ${error.message}`);
      api.sendMessage(
        `❌ | An error occurred while fetching the horoscope. Please try again later.`,
        event.threadID,
      );
    }
  },
};
