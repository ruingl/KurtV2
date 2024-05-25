const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function uploadImgbb(file /* stream or image url */) {
  let type = "file";
  try {
    if (!file)
      throw new Error(
        "The first argument (file) must be a stream or a image url",
      );
    const regCheckURL = /^((http|https):\/\/)/;
    if (regCheckURL.test(file) === true) type = "url";
    if (
      (type !== "url" &&
        !(
          typeof file._read === "function" &&
          typeof file._readableState === "object"
        )) ||
      (type === "url" && !regCheckURL.test(file))
    )
      throw new Error(
        "The first argument (file) must be a stream or an image URL",
      );

    const res_ = await axios({
      method: "GET",
      url: "https://imgbb.com",
    });

    const auth_token = res_.data.match(/auth_token="([^"]+)"/)[1];
    const timestamp = Date.now();

    const res = await axios({
      method: "POST",
      url: "https://imgbb.com/json",
      headers: {
        "content-type": "multipart/form-data",
      },
      data: {
        source: file,
        type: type,
        action: "upload",
        timestamp: timestamp,
        auth_token: auth_token,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

module.exports = {
  config: {
    name: "genimg",
    author: "Samir Œ | AkhiroDEV",
    hasPrefix: false,
    description: "Generates an image",
    usage: "genimg [prompt]",
  },
  async onRun({ api, event, args }) {
    let searchQuery = args.join(" ");

    if (searchQuery) {
      try {
        const response = await axios.get(
          `https://apis-samir.onrender.com/google/imagesearch?q=${encodeURIComponent(searchQuery)}`,
        );
        const data = response.data.data;
        const imgData = [];

        for (let i = 0; i < Math.min(6, data.length); i++) {
          const imgResponse = await axios.get(data[i], {
            responseType: "arraybuffer",
          });
          const imgPath = path.join(__dirname, "cache", `${i + 1}.jpg`);
          await fs.promises.writeFile(imgPath, imgResponse.data);
          imgData.push(fs.createReadStream(imgPath));
        }

        await api.sendMessage(
          {
            attachment: imgData,
            body: `Here are some images for "${searchQuery}"`,
          },
          event.threadID,
          event.messageID,
        );
      } catch (error) {
        console.error("Failed to fetch or send images:", error.message);
        api.sendMessage(
          { body: "Failed to get random images." },
          event.threadID,
        );
      }
    } else {
      let links = [];

      for (let attachment of event.messageReply.attachments) {
        links.push(attachment.url);
      }

      try {
        const shortLink1 = await uploadImgbb(links[0]);
        const imageUrl = shortLink1.image.url;
        const response = await axios.get(
          `https://apis-samir.onrender.com/find?imageUrl=${imageUrl}`,
        );
        const data = response.data.data;
        const imgData = [];

        for (let i = 0; i < Math.min(6, data.length); i++) {
          const imgResponse = await axios.get(data[i], {
            responseType: "arraybuffer",
          });
          const imgPath = path.join(__dirname, "cache", `${i + 1}.jpg`);
          await fs.promises.writeFile(imgPath, imgResponse.data);
          imgData.push(fs.createReadStream(imgPath));
        }

        await api.sendMessage(
          {
            attachment: imgData,
            body: `Here are some similar images`,
          },
          event.threadID,
          event.messageID,
        );
      } catch (error) {
        console.error("Failed to fetch or send images:", error.message);
        api.sendMessage(
          { body: "Failed to get random images." },
          event.threadID,
        );
      }
    }
  },
};
