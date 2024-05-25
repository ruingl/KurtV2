const fs = require("fs-extra");
const path = require("path");
const _ = require("lodash");

module.exports = function ({ api }) {
  const usersDataPath = path.join(__dirname, "json", "usersData.json");
  let usersData;

  try {
    usersData = fs.readJSONSync(usersDataPath);
  } catch (error) {
    console.error(error);
    usersData = {};
  }

  async function getInfo(uid) {
    try {
      const userInfo = await api.getUserInfo(uid);
      return userInfo[uid];
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function createData(uid) {
    try {
      const userInfo = await getInfo(uid);
      const data = {
        [uid]: {
          userID: uid,
          name: userInfo.name,
          vanity: _.get(userInfo, "vanity", uid),
          gender: userInfo.gender,
          money: 0,
          createTime: { timestamp: Date.now() },
          data: { timestamp: Date.now() },
          lastUpdate: Date.now(),
        },
      };

      _.merge(usersData, data);
      await saveData(usersData);
    } catch (error) {
      console.error(error);
    }
  }

  async function getAllUsers() {
    return usersData;
  }

  async function get(uid) {
    return _.get(usersData, uid, null);
  }

  async function deleteData(uid) {
    if (_.has(usersData, uid)) {
      delete usersData[uid];
      await saveData(usersData);
      return true;
    } else {
      return false;
    }
  }

  async function setData(userID, options, callback) {
    try {
      if (!userID) throw new Error("UserID cant be empty!");
      if (isNaN(userID)) throw new Error("UserID must be a Number!");

      if (!usersData.hasOwnProperty(userID))
        throw new Error(
          `User with ID: ${userID} does not exist in the database`,
        );
      if (typeof options !== "object")
        throw new Error("Options parameter must be an object");

      usersData[userID] = { ...usersData[userID], ...options };
      await saveData(usersData);
      if (callback && typeof callback === "function")
        callback(null, usersData[userID]);
      return usersData[userID];
    } catch (error) {
      if (callback && typeof callback === "function") callback(error, null);
      return false;
    }
  }

  async function saveData(data) {
    try {
      await fs.writeJSONSync(usersDataPath, data, { spaces: 2 });
    } catch (error) {
      console.error(error);
    }
  }

  return {
    get: get,
    createData: createData,
    getAllUsers: getAllUsers,
    getInfo: getInfo,
    deleteData: deleteData,
    setData: setData,
  };
};
