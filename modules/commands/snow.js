const axios = require('axios');
const moment = require('moment-timezone');

module.exports = new Object({
  config: new Object({
    name: 'snow',
    version: '1.0.0',
    role: 0,
    usePrefix: false,
    description: "An AI command powered by Snowflakes AI",
    usage: "{pn} [prompt]",
    author: ' joshua | yaki',
    cooldown: 3,
  }),

  onRun: async function({
    message, args, event, fonts
  }) {
    const input = args.join(' ');
    const timeString = moment.tz('Asia/Manila').format('LLL');

    if (!input) {
      message.react("❓")
      message.reply(`❓ | Please provide a question/query.`);
      return;
    }

    const i = await message.reply(`🔍Searching for Snowflakes AI response....`);

    try {
      const { data } = await axios.get(`https://hashier-api-snowflake.vercel.app/api/snowflake?ask=${encodeURIComponent(input)}`);
      if (data.response) {
        message.edit(`❄️ ${fonts.mono("Snowflake")}\n━━━━━━━━━━━━━━━\n${data.response}\n\n${timeString}\n\n𝒄𝒓𝒆𝒅𝒊𝒕𝒔: https://www.facebook.com/yakiro.wyatt`, i.messageID);
      } else {
        message.reply('❌ | No response found.');
      }
    } catch (error) {
      message.reply('❌ | An error occurred while processing your request.');
    }
  }
});