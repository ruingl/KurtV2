const fs = require("fs");
const axios = require("axios");
const { PasteClient } = require("pastebin-api");
const path = require("path");

module.exports = new Object({
  config: new Object({
    name: "system",
    author: "Rui | Liane Cagara",
    usePrefix: true,
    description: "Reload, send, upload, install, or delete modules",
    usage: "{pn} [install/reload/file/bin] <filename>",
    role: 1,
    version: "1.2.0",
  }),
  onRun: async function ({ args, message, fonts }) {
    const system = `⚙️ | ${fonts.bold("System")}
━━━━━━━━━━━━━━━`;

    const utils = global.utils;

    async function handleLoad() {
      const i = await message.reply(`${system}
⚙️ | ${fonts.sans("Getting started..")}`);
      await new Promise((r) => setTimeout(r, 1000));
      await message.edit(
        `${system}
🔃 | ${fonts.sans("Reloading the latest edited codes.")}`,
        i.messageID,
      );
      const errs = await utils.loadAll();

      let res = `${system}
❌ | Failed to reload ${errs && typeof errs === "object" ? Object.keys(errs).length : 0} modules:\n\n`;
      await new Promise((r) => setTimeout(r, 1000));
      let num = 1;
      if (errs) {
        for (const [file, error] of Object.entries(errs)) {
          res += `${num}. ${file}\n--> ${error.message}\n`;
          num++;
        }
        await message.edit(res, i.messageID);
        return false;
      }

      await new Promise((r) => setTimeout(r, 1000));
      await message.edit(
        `${system}
📥 | ${fonts.sans("Updating the system..")}`,
        i.messageID,
      );
      await new Promise((r) => setTimeout(r, 1000));
      await message.edit(
        `${system}
📥 | ${fonts.sans("Almost there...")}`,
        i.messageID,
      );
      await new Promise((r) => setTimeout(r, 1000));
      await message.edit(
        `${system}
🟢 | ${fonts.sans("Loaded all modules!")}`,
        i.messageID,
      );
      return true;
    }

    const commandsDir = path.join(process.cwd(), "modules", "commands");

    if (args[0] === "reload") {
      return await handleLoad();
    } else if (args[0] === "install" && args[1] && args[2]) {
      const fileName = args[1];
      const filePath = path.join(commandsDir, fileName);

      if (fs.existsSync(filePath)) {
        await message.waitForReaction(
          `⚠️ ${fonts.sans(`The file ${fileName} already exists, please react with any emoji to proceed, this will replace the file and this action cannot be undone.`)}`,
          `✅ ${fonts.sans("Proceeding...")}`,
        );
      }

      let code = args.slice(2).join(" ");

      if (args[2].startsWith(`https://`) || args[2].startsWith(`http://`)) {
        try {
          const response = await axios.get(args[2]);
          code = response.data;
        } catch (err) {
          await message.reply(
            `❌ | Failed to download the file from the given URL.`,
          );
          return false;
        }
      }

      fs.writeFileSync(filePath, code);
      await message.reply(`✅ | Successfully installed ${fileName}!`);
      return await handleLoad();
    } else if (args[0] === "file") {
      const fileName = args[1];
      const filePath = path.join(commandsDir, fileName);
      if (!fs.existsSync(filePath)) {
        await message.reply(`❌ | The file ${fileName} does not exist.`);
        return false;
      }
      const content = fs.readFileSync(filePath, "utf-8");
      await message.reply(`//file: ${fileName}\n\n${content}`);
      return true;
    } else if (args[0] === "delete") {
      const fileName = args[1];
      const filePath = path.join(commandsDir, fileName);
      if (!fs.existsSync(filePath)) {
        await message.reply(`❌ | The file ${fileName} does not exist.`);
        return false;
      }
      await message.waitForReaction(
        `⚠️ Are you sure you want to delete ${fileName}? You cannot undo this action.\nPlease react to this message to confirm!`,
        `✅ Proceeding to deletion...`,
      );
      fs.unlinkSync(filePath);
      await message.reply(`✅ Successfully deleted ${fileName}!`);
      return true;
    } else if (args[0] === "bin") {
      const fileName = args[1];
      const filePath = path.join(commandsDir, fileName);
      if (!fs.existsSync(filePath)) {
        await message.reply(`❌ | The file ${fileName} does not exist.`);
        return false;
      }
      const data = fs.readFileSync(filePath, "utf-8");
      const client = new PasteClient("R02n6-lNPJqKQCd5VtL4bKPjuK6ARhHb");
      const url = await client.createPaste({
        code: data,
        expireDate: "N",
        format: "javascript",
        name: fileName,
        publicity: 1,
      });
      if (!url) {
        await message.reply(
          `❌ | Failed to upload the file to pastebin, please check if the API key is working.`,
        );
        return false;
      }
      const id = url.split("/")[3];
      const rawPaste = "https://pastebin.com/raw/" + id;
      await message.reply(
        `✅ | Successfully uploaded ${fileName} to pastebin!\nUrl: ${rawPaste}`,
      );
    } else {
      await message.reply(`${system}
${fonts.sans(`install <filename> <link|code>
file <filename>
delete <filename>
bin <filename>
reload`)}`);
      return false;
    }
  },
});
