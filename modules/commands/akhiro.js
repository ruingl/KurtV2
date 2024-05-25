const axios = require("axios");

module.exports = new Object ({
  config: new Object ({
    name: "akhiro",
    version: "1.0.0",
    author: "AkhiroDEV",
    description: "Talk to AkhiroAI",
    usage: "{p}akhiro [query]"
  }),
  async onRun({ message, args }){
    const question = args.join(" ");
    if (!question){
      return message.reply("ℹ️ | Provide a question.",)
    };
    try {
      const response = await axios.get(`https://akhiro-rest-api.onrender.com/api/akhiro?q=${encodeURIComponent(args)}`);
      const msg = response.data.content

      message.reply(`${msg}`);
      await message.send(`Please Contact The API Developer If There Would Be An Error.
      https://facebook.com/joshg101,
      https://www.facebook.com/certainly.francis,
      https://www.facebook.com/ruinaigel.reogo.5`)
    } catch (error) {
      console.log(error);
      message.send(`ERROR: ${error.message}`)
    }
  }
})