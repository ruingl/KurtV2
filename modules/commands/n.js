module.exports = new Object(
  class {
    static get config() {
      return new Object({
        name: "nigga",
        description: "",
        author: "Rui",
        usePrefix: false,
        cooldown: 0,
        role: 0,
      });
    }

    static get onRun() {
      return async ({ message, args, api, event, cmdName }) => {
        const onReply = global.client.replies;
        const i = message.reply("bat ka racist?");
        onReply.set(i.messageID, {
          cmdName,
        });
      };
    }

    static get onReply() {
      return async ({ message, args, api, event, cmdName }) => {
        message.reply("bakit, palag ka?");
      };
    }
  },
);
