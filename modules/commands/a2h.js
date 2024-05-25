module.exports = new Object({
  config: new Object({
    name: "a2h",
    description: "Angry to Happy!",
    usage: "{pn}",
    role: 0,
  }),

  onRun: async function({
    message, args
  }) {
    let tries = 1;
    const needed = Math.floor(Math.random() * 24);
    while (tries < needed) {
  await message.waitForReaction(`Score Needed: ${needed}
Current Score: ${tries}
😡 PENGE MWAMWA`, `Score Needed: ${needed}
Current Score: ${tries + 1}
🥺 LABYOY`);
  tries++;
}
  message.reply(`U win!`);
  },
});