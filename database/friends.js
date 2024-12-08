import { affectedOne, getMinMax, isEmpty } from "../utils/utils.js";
import { getResponseDb } from "./connection.js";

const tables = { FRIENDS: "friends", REQUESTS: "requests" };
const types = { SENT: "user_1", RECIEVED: "user_2" };

const checkForFriends = async (userId, friendId) => {
  return (
    (await runSearchFor(userId, friendId, tables.FRIENDS)) ||
    (await runSearchFor(friendId, userId, tables.FRIENDS))
  );
};

const checkForRequests = async (userId, friendId) => {
  return await runSearchFor(userId, friendId, tables.REQUESTS);
};

const runSearchFor = async (userId, friendId, searchTable) => {
  const sqlQuery = `select * from ${searchTable} where user_1=? and user_2=?`;

  try {
    let [found] = await getResponseDb(sqlQuery, [userId, friendId]);

    if (isEmpty(found)) return false;
  } catch (err) {
    console.log(err);
    return false;
  }

  return true;
};

const deleteFriendRequest = async (userId, requestedFriendId) => {
  const { minVal: usrMin, maxVal: usrMax } = getMinMax(
    userId,
    requestedFriendId
  );

  try {
    let [res] = await getResponseDb(
      "delete from requests where user_min=? and user_max=?",
      [usrMin, usrMax]
    );

    if (affectedOne(res)) return true;
  } catch (err) {
    console.log(err);
  }

  return false;
};

const makeFriends = async (userId, friendId) => {
  try {
    let [res] = await getResponseDb(
      "insert into friends (user_1, user_2) values (?, ?)",
      [userId, friendId]
    );

    if (affectedOne(res)) return true;
  } catch (err) {
    console.log(err);
  }

  return false;
};

const deleteFriend = async (userId, friendId) => {
  const { minVal: usrMin, maxVal: usrMax } = getMinMax(userId, friendId);

  try {
    let [res] = await getResponseDb(
      "delete from friends where user_min=? and user_max=?",
      [usrMin, usrMax]
    );

    if (affectedOne(res)) return true;
  } catch (err) {
    console.log(err);
  }

  return false;
};

const sendFriendRequest = async (userId, friendId) => {
  try {
    let [res] = await getResponseDb(
      "insert into requests(user_1, user_2) values (?, ?)",
      [userId, friendId]
    );

    if (affectedOne(res)) return true;
  } catch (err) {
    console.log(err);
  }

  return false;
};

const getFriends = async (userId) => {
  let friends = [];

  try {
    let [res] = await getResponseDb(
      "select * from friends where user_1=? or user_2=?",
      [userId, userId]
    );

    res.forEach((friendObj) => {
      friendObj.friend = friendObj.user_2
        ? friendObj.user_1 === userId
        : friendObj.user_1;
      delete friendObj.user_1;
      delete friendObj.user_2;

      friends.push(friendObj);
    });
  } catch (err) {
    console.log(err);
  }

  return friends;
};

const getRequests = async (userId, requestType) => {
  let requests = [];

  try {
    let [res] = await getResponseDb(
      `select * from requests where ${requestType}=?`,
      [userId]
    );

    requests = res;
  } catch (err) {
    console.log(err);
  }

  return requests;
};

const getSentRequests = async (userId) => {
  return await getRequests(userId, types.SENT);
};

const getRecievedRequests = async (userId) => {
  return await getRequests(userId, types.RECIEVED);
};

const db = {
  checkForFriends,
  checkForRequests,
  deleteFriendRequest,
  makeFriends,
  deleteFriend,
  sendFriendRequest,
  getFriends,
  getRecievedRequests,
  getSentRequests,
};

export default db;
