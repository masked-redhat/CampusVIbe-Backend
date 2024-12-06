import connection from "./connection.js";

export const friendRequest = async (userID, friendID) => {
  let statusCode = 500;
  try {
    let friends = await checkFriends(userID, friendID);
    let requestRepeat = await requestAlreadySent(userID, friendID);

    if (friends || requestRepeat) statusCode = 400;
    else {
      let request = await connection
        .promise()
        .query("insert into requests(user_1, user_2) values (?, ?)", [
          userID,
          friendID,
        ]);

      if (request[0].affectedRows == 1) statusCode = 204;
      else statusCode = 304;
    }
  } catch (err) {
    // console.log(err);
    statusCode = 500;
    if ((err.errno = 1062)) statusCode = 400;
  }

  return statusCode;
};

export const acceptFriendRequest = async (userID, friendID) => {
  let statusCode = 500;
  try {
    let friends = await checkFriends(userID, friendID);
    let request = await requestAlreadySent(friendID, userID);

    if (friends || !request) statusCode = 400;
    else {
      if (
        (await createFriend(userID, friendID)) &&
        (await deleteRequest(friendID, userID))
      )
        statusCode = 204;
      else statusCode = 304;
    }
  } catch (err) {
    console.log(err);
  }

  return statusCode;
};

export const getFriends = async (userID) => {
  let statusCode = 500,
    friends = [];
  try {
    let result = await connection
      .promise()
      .query("select * from friends where user_1=? or user_2=?", [
        userID,
        userID,
      ]);

    result[0].forEach((item) => {
      let friend = {};
      if (item.user_1 == userID) friend.id = item.user_2;
      else friend.id = item.user_1;
      friend.timestamp = item.timestamp;
      friends.push(friend);
    });

    statusCode = 200;
  } catch (err) {}
  return { sC: statusCode, friends: friends };
};

export const deleteFriend = async (userID, friendID) => {
  let statusCode = 500;
  const userMin = Math.min(userID, friendID),
    userMax = Math.max(userID, friendID);
  try {
    let request = await connection
      .promise()
      .query("delete from friends where user_min=? and user_max=?", [
        userMin,
        userMax,
      ]);
    if (request[0].affectedRows == 1) statusCode = 204;
    else statusCode = 304;
  } catch (err) {}

  return statusCode;
};

const checkFriends = async (userID, friendID, table = "friends") => {
  const userMin = Math.min(userID, friendID),
    userMax = Math.max(userID, friendID);
  const query = `select * from ${table} where user_min = ? and user_max = ?`;
  try {
    let request = await connection.promise().query(query, [userMin, userMax]);

    if (request[0].length != 0) return true;
    return false;
  } catch (err) {
    // console.log(err);
    return false;
  }
};

const requestAlreadySent = async (userId, friendID) => {
  return await checkFriends(userId, friendID, "requests");
};

const createFriend = async (userID, friendID) => {
  try {
    let request = await connection
      .promise()
      .query("insert into friends (user_1, user_2) values (?, ?)", [
        userID,
        friendID,
      ]);
    if (request[0].affectedRows == 1) return true;
  } catch (err) {
    console.log(err);
  }
  return false;
};

const deleteRequest = async (userID, friendID) => {
  try {
    let request = await connection
      .promise()
      .query("delete from requests where user_1 = ? and user_2 = ?", [
        userID,
        friendID,
      ]);
    if (request[0].affectedRows == 1) return true;
  } catch (err) {
    console.log(err);
  }
  return false;
};
