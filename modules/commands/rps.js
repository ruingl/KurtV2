const _ = require("lodash");

module.exports = {
  config: {
    name: "rps",
    role: 0,
    description: "Play Rock-Paper-Scissors with the bot.",
    usePrefix: true,
    usage: "{pn} [choice] [money]",
    author: "Rui",
  },
  async onRun({ api, event, Users, args, fonts }) {
    const { senderID, threadID } = event;

    const header = `${fonts.bold("RPS")} 🪨 📜 ✂️ 
━━━━━━━━━━━━━━━`;

    const choice = args.shift();
    const gambled = args.join(" ");

    if (!choice || !gambled || isNaN(gambled) || gambled <= 0) {
      return api.sendMessage(
        `${header}\n${fonts.sans("Invalid syntax. Usage: {pn} [choice] [money]")}`,
        threadID,
      );
    }

    let user = await Users.get(senderID);
    if (!user) {
      await Users.createData(senderID);
      user = await Users.get(senderID);
    }

    const availableMoney = user.money || 0;
    if (gambled > availableMoney) {
      return api.sendMessage(
        `${header}\n${fonts.sans("You don't have enough money.")}`,
        threadID,
      );
    }

    const result = getResult(choice);

    const newMoney =
      availableMoney +
      (result === "win"
        ? Number(gambled)
        : result === "lose"
          ? -Number(gambled)
          : 0);
    await Users.setData(senderID, "money", newMoney);

    return api.sendMessage(
      `${header}\n${fonts.sans(`You chose: ${choice}\nBot chose: ${result}\nYou ${result} ${gambled} coins.`)}`,
      threadID,
    );
  },
};

function getResult(userChoice) {
  const choices = ["rock", "paper", "scissors"];
  const botChoice = choices[Math.floor(Math.random() * 3)];

  if (userChoice === botChoice) {
    return "tie";
  } else if (
    (userChoice === "rock" && botChoice === "scissors") ||
    (userChoice === "paper" && botChoice === "rock") ||
    (userChoice === "scissors" && botChoice === "paper")
  ) {
    return "win";
  } else {
    return "lose";
  }
}
