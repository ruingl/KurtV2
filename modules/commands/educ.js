const axios = require("axios");

module.exports = new Object({
  config: new Object({
    name: "educ",
    author: "akhirodev",
    description: "an all in one educational command",
    usage: "{p} [ subcommand ] [ prompt ]"
  }),
  async onRun({ message, args }){
    const subcommand = args[0]?.toLowerCase();

    switch (subcommand) {
      case "akhiro":
        try {
          const response = await axios.get(`https://akhiro-rest-api.onrender.com/api/akhiro?q=${encodeURIComponent(subcommand)}`);
          const content = response.data.content;
          message.reply(content);
        } catch (error) {
          console.log(error);
          message.reply(`error: ${error.message}`)
        }
        break;
      case "gemini":
        try {
          const response = await axios.get(`https://akhiro-rest-api.onrender.com/api/gemini?q=${encodeURIComponent(subcommand)}`);
          const content = response.data.content;
          message.reply(content);
        } catch (error) {
          console.log(error);
          message.reply(`error: ${error.message}`)
        }
        break;
      default:
        message.reply(`Invalid subcommand: ${subcommand}`);
    }
  },
});