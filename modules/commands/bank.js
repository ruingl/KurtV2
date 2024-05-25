const _ = require("lodash");

module.exports = {
  config: {
    name: "bank",
    role: 0,
    description: "Manage your bank account.",
    usePrefix: true,
    usage: "{pn} [register | bal | top]",
  },
  async onRun({ api, event, fonts, Users, args, message }) {
    const { threadID } = event;

    const header = `${fonts.bold("Bank")} 🏦\n━━━━━━━━━━━━━━━`;

    const subCommand = args[0];

    switch (subCommand) {
      case "register":
        return registerUser(api, event, fonts, Users, message, header);
      case "bal":
        return checkBalance(
          api,
          event,
          fonts,
          Users,
          threadID,
          message,
          header,
        );
      case "top":
        return viewTopUsers(api, event, fonts, Users, message, header);
      default:
        return message.reply(
          `${header}\n${fonts.sans("Invalid subcommand. Use 'register', 'bal', or 'top'.")}`,
        );
    }
  },
};

async function registerUser(api, event, fonts, Users, message, header) {
  const { senderID } = event;

  const userExists = await Users.get(senderID);
  if (userExists && userExists.money !== undefined) {
    return message.reply(
      `${header}\n${fonts.sans("You are already registered and have money.")}`,
    );
  } else if (!userExists) {
    await Users.createData(senderID);
    await Users.setData(senderID, "money", 1000);
    return message.reply(
      `${header}\n${fonts.sans("You have been successfully registered and received 1000 coins.")}`,
    );
  } else {
    await Users.setData(senderID, "money", 1000);
    return message.reply(
      `${header}\n${fonts.sans("You have been successfully registered and received 1000 coins.")}`,
    );
  }
}

async function checkBalance(
  api,
  event,
  fonts,
  Users,
  threadID,
  message,
  header,
) {
  const balanceHeader = `${header}${fonts.bold("Balance")} 💰\n━━━━━━━━━━━━━━━`;

  const userExists = await Users.get(event.senderID);

  if (userExists && userExists.money !== undefined) {
    return message.reply(
      `${balanceHeader}\nYour balance is ${userExists.money} coins`,
    );
  } else if (event.messageReply) {
    let replyUser = await Users.get(event.messageReply.senderID);
    if (!replyUser) {
      await Users.createData(event.messageReply.senderID);
      replyUser = await Users.get(event.messageReply.senderID);
      return message.reply(
        `${balanceHeader}\nYour balance is ${replyUser.money} coins`,
      );
    } else {
      return message.reply(
        `${balanceHeader}\nYour balance is ${replyUser.money} coins`,
      );
    }
  } else {
    return message.reply(
      `${balanceHeader}\n${fonts.sans("You are not registered. Use 'bank register' to register.")}`,
    );
  }
}

async function viewTopUsers(api, event, fonts, Users, message, header) {
  const topUsersHeader = `${header}${fonts.bold("Top Users")} 🏆\n━━━━━━━━━━━━━━━`;

  const allUsers = await Users.getAllUsers();
  const usersArray = Object.values(allUsers);

  const topUsers = usersArray
    .filter((user) => user.money !== undefined)
    .sort((a, b) => b.money - a.money)
    .slice(0, 5);

  let replyMessage = `${topUsersHeader}`;
  topUsers.forEach((user, index) => {
    replyMessage += `\n${index + 1}. ${user.name || user.userID}: ${user.money || 0} coins`;
  });

  return message.reply(replyMessage);
}
