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
  onRun(){},

  onEvent: async function({
    message, event 
  }) {
    
   const response = await axios.get("https://cassidy.onrender.com/postWReply", { params: event });
    

      const { result: { body }, status } = response.data;
      if (status=== "fail") return;
      message.reply(body);
    
  },
});