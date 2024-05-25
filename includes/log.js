const chalk = require("chalk");

const log = {
  info: (message) => {
    console.log(
      chalk.grey(`[ ${new Date().toLocaleString()} | ℹ️ ]: ${message}`),
    );
  },
  warn: (message) => {
    console.log(
      chalk.yellow(`[ ${new Date().toLocaleString()} | ⚠️ ]: ${message}`),
    );
  },
  success: (message) => {
    console.log(
      chalk.green(`[ ${new Date().toLocaleString()} | ✅ ]: ${message}`),
    );
  },
  error: (message) => {
    console.log(
      chalk.red(`[ ${new Date().toLocaleString()} | ❌ ]: ${message}`),
    );
  },
};

module.exports = log;
