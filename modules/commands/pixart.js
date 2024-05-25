let url = "https://ai-tools.replit.app";
const { get } = require('axios'), fs = require('fs');
let f = __dirname+'/cache/pixart.png';

module.exports = {
  config: {
    name: "pxart",
  	role: 0,
    author: "Deku | Kurt",
	  description: "Generate image in pixart",
  	usage: "[prompt | style]",
  	cooldowns: 5,
  },
   async onRun({api, event, args}){
    function r(msg){
      api.sendMessage(msg, event.threadID, event.messageID);
    }
    let g = `•——[Style list]——•\n\n1. Cinematic
2. Photographic
3. Anime
4. Manga
5. Digital Art
6. Pixel art
7. Fantasy art
8. Neonpunk
9. 3D Model`;

    if (!args[0]) return r('Missing prompt and style\n\n'+g);
    
    const a = args.join(" ").split("|").map((item) => (item = item.trim()));

    let b = a[0], c = a[1];
    if (!b) return r('Missing prompt!');
    if (!c) return r('Missing style!\n\n'+g);
    try {
    const d = (await get(url+'/pixart?prompt='+b+'&styles='+c, {
      responseType: 'arraybuffer'
    })).data;
    fs.writeFileSync(f, Buffer.from(d, "utf8"));
    return r({attachment: fs.createReadStream(f, () => fs.unlinkSync(f))});
    } catch (e){
      return r(e.message)
    }
  }
}