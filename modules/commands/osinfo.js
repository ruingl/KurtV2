const os = require("os");

module.exports = {
  config: {
    name: "osinfo",
    version: "1.0.0",
    author: "Rui",
    role: 0,
    description: "Displays basic information about the operating system.",
    usage: "osinfo",
    usePrefix: true,
    cooldown: 5,
  },

  async onRun({ api, event }) {
    try {
      const uptimeFormatted = global.client.startTime
        .toISOString()
        .substr(11, 8);

      const osInfo = {
        platform: os.platform(),
        type: os.type(),
        release: os.release(),
        architecture: os.arch(),
        hostname: os.hostname(),
        uptime: global.client.startTime,
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        cpus: os.cpus(),
      };

      const message = `
Platform: ${osInfo.platform}
Type: ${osInfo.type}
Release: ${osInfo.release}
Architecture: ${osInfo.architecture}
Hostname: ${osInfo.hostname}
Uptime: ${uptimeFormatted}
Total Memory: ${formatBytes(osInfo.totalMemory)}
Free Memory: ${formatBytes(osInfo.freeMemory)}
Number of CPUs: ${osInfo.cpus.length}
      `;

      await api.sendMessage(message, event.threadID);
    } catch (error) {
      console.error(
        `❌ | Failed to execute "osinfo" command: ${error.message}`,
      );
      const errorMessage = `❌ | An error occurred while trying to execute the command. Please try again later.`;
      api.sendMessage(errorMessage, event.threadID);
    }
  },
};

function formatBytes(bytes) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let index = 0;
  while (bytes >= 1024 && index < units.length - 1) {
    bytes /= 1024;
    index++;
  }
  return `${bytes.toFixed(2)} ${units[index]}`;
}
