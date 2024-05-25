module.exports = new Object({
  config: new Object({
    name: "pinterest",
    description: "pinterest api ni josh 🔥",
    author: "Rui | Josh",
    usePrefix: false,
    cooldown: 5,
    role: 0,
  }),

  onRun: async ({
    message, args,
    api, event
  }) => {
    const url = "https://joshweb.click/api/pinterest";
    const axios = require("axios");
    const fs = require("fs-extra");
    const path = require("path");

    const input = args.join(" ");

    if (!input) {
      message.reply("❌ | Please provide a query!");
    } else {
      const res = axios.get(`${url}?q=${encodeURIComponent(input)}`);
      message.reply(`${res.data.data}`);
    };
  },
});