const axios = require('axios');

module.exports = new Object({
  config: new Object({
    name: "cass",
    description: "cassidy",
    usage: "cass [query]",
    author: "Rui | Liane",
    usePrefix: false,
    role: 0,
  }),

  onRun: async function({
    message, args, event 
  }) {
    const input = args.join(" ");
    if (!input) {
      message.reply('no query lol');
    } else {
      const response = await axios.get("https://cassidy.onrender.com/postWReply", { params: { messageReply: event.messageReply , body: input }});
    

      const { result: { body } } = response.data;
      message.reply(body);
    };
  },
});