const _ = require("lodash");

module.exports = {
  config: {
    name: "flip",
    role: 0,
    description: "Flip a coin for a chance to win money.",
    usePrefix: true,
    usage: "{pn} [head/tail] [amount]",
    author: "Rui",
  },
  async onRun({ api, event, fonts, Users, args }) {
    const { senderID, threadID } = event;

    const header = `${fonts.bold("Coin Flip")} 🪙 
━━━━━━━━━━━━━━━`;

    const choice = args.shift();
    const gambled = args.join(" ");

    if (!choice || !gambled) {
      return api.sendMessage(
        `${header}\n${fonts.sans("Please provide both a choice (head or tail) and the amount of money to gamble.")}`,
        threadID,
      );
    }

    if (!isValidChoice(choice)) {
      return api.sendMessage(
        `${header}\n${fonts.sans("Invalid choice. Please choose either 'head' or 'tail'.")}`,
        threadID,
      );
    }

    let user = await Users.get(senderID);
    if (!user) {
      await Users.createData(senderID);
      user = await Users.getInfo(senderID);
    }

    const userMoney = user.money || 0;

    if (userMoney < gambled) {
      return api.sendMessage(
        `${header}\n${fonts.sans("You don't have enough money to gamble.")}`,
        threadID,
      );
    }

    const result = flipCoin();
    const outcome = determineOutcome(result, choice, gambled);

    const newMoney = updateMoney(userMoney, gambled, outcome);

    await Users.setData(senderID, "money", newMoney);

    return api.sendMessage(`${header}\n${fonts.sans(outcome)}`, threadID);
  },
};

function flipCoin() {
  return _.sample(["head", "tail"]);
}

function isValidChoice(choice) {
  return choice === "head" || choice === "tail";
}

function determineOutcome(result, choice, gambled) {
  if (result === choice) {
    return `You guessed correctly! You won ${gambled} coins.`;
  } else {
    return `You guessed incorrectly. You lost ${gambled} coins.`;
  }
}

function updateMoney(currentMoney, gambled, outcome) {
  if (outcome.startsWith("You guessed correctly!")) {
    return currentMoney + parseInt(gambled);
  } else {
    return currentMoney - parseInt(gambled);
  }
}
