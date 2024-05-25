const fs = require("fs-extra");
const path = require("path");
const _ = require("lodash");
const log = require("../log");

module.exports = function ({ api }) {
  const threadsDataPath = path.join(__dirname, "json", "threadsData.json");
  let threadsData;

  try {
    threadsData = fs.readJSONSync(threadsDataPath);
  } catch (error) {
    log.error(error);
    threadsData = {};
  }

  async function getInfo(tid) {
    try {
      const threadInfo = await api.getThreadInfo(tid);
      return threadInfo;
    } catch (error) {
      log.error(error);
      return null;
    }
  }

  async function createData(tid) {
    try {
      const threadInfo = await getInfo(tid);
      const data = {
        [tid]: {
          threadID: tid,
          name: threadInfo.threadName,
          emoji: threadInfo.emoji,
          adminIDs: threadInfo.adminIDs,
          participantIDs: threadInfo.participantIDs,
          isGroup: threadInfo.isGroup,
          createTime: { timestamp: Date.now() },
          data: { timestamp: Date.now() },
          lastUpdate: Date.now(),
        },
      };

      _.merge(threadsData, data);
      fs.writeJSONSync(threadsDataPath, threadsData, { spaces: 2 });
    } catch (error) {
      log.error(error);
    }
  }

  function getAllThreads() {
    return threadsData;
  }

  function get(tid) {
    return _.get(threadsData, tid, null);
  }

  function deleteData(tid) {
    if (_.has(threadsData, tid)) {
      delete threadsData[tid];
      fs.writeJSONSync(threadsDataPath, threadsData, { spaces: 2 });
      return true;
    } else {
      return false;
    }
  }

  function setData(tid, dataKey, value) {
    if (_.has(threadsData, tid)) {
      _.set(threadsData, `${tid}.${dataKey}`, value);
      fs.writeJSONSync(threadsDataPath, threadsData, { spaces: 2 });
      return true;
    } else {
      return false;
    }
  }

  return {
    createData: createData,
    getAllThreads: getAllThreads,
    get: get,
    deleteData: deleteData,
    setData: setData,
  };
};
