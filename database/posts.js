import connection from "./connection.js";
import { getFriends } from "./friends.js";

const PERREQUESTPOSTLIMIT = 10;

export const getAllPostsExceptUser = async (userID, offsetValue = 0) => {
  let statusCode = 500,
    posts = [];
  try {
    let queryResponse = await connection
      .promise()
      .query(
        "select * from posts where user_id <> ? order by timestamp desc limit ? offset ?",
        [userID, PERREQUESTPOSTLIMIT, offsetValue]
      );

    posts = queryResponse[0];
    statusCode = 200;
  } catch (err) {
    console.log(err);
    statusCode = 500;
  }
  return { sC: statusCode, posts: posts };
};

export const getPostForUser = async (userID, offsetValue = 0) => {
  let statusCode = 500,
    posts = [];
  try {
    let friends = getFriendIDs((await getFriends(userID)).friends);

    if (friends.length == 0) statusCode = 200;
    else {
      let query = prepareQuery(friends);
      let result = await connection
        .promise()
        .query(query, [...friends, PERREQUESTPOSTLIMIT, offsetValue]);
      posts = result[0];
      statusCode = 200;
    }
  } catch (err) {}

  return { sC: statusCode, posts: posts };
};

export const insertPost = async (userID, postData) => {
  let statusCode = 500,
    postID = null;
  try {
    let post = await connection
      .promise()
      .query(
        "insert into posts (user_id, title, content, image) values (?, ?, ?, ?)",
        [userID, postData.title, postData.content, postData.image]
      );

    postID = post[0].insertId;
    statusCode = 201;
  } catch (err) {
    console.log(err);
    statusCode = 500;
    if (err.errno == 1048) statusCode = 422;
  }

  return { pID: postID, sC: statusCode };
};

export const deletePost = async (userID, postID) => {
  let statusCode = 500;
  try {
    let res = await connection
      .promise()
      .query("delete from posts where id = ? and user_id = ?", [
        postID,
        userID,
      ]);
    if (res[0].affectedRows == 1) statusCode = 204;
    else statusCode = 400;
  } catch (err) {
    console.log(err);
    statusCode = 500;
  }
  return statusCode;
};

export const likePost = async (userID, postID) => {
  let statusCode = 500;
  try {
    await connection.promise().beginTransaction();

    await connection
      .promise()
      .execute("insert into likes (user_id, post_id) values (?, ?)", [
        userID,
        postID,
      ]);

    const [updateResult] = await connection
      .promise()
      .execute("update posts set likes = likes +1 where id=?", [postID]);

    if (updateResult.affectedRows == 0)
      throw new Error("Post not found or update failed");

    await connection.promise().commit();
    statusCode = 204;
  } catch (err) {
    await connection.promise().rollback();
    if (err.errno == 1062 || err.errno == 1452) statusCode = 400;
  }
  return statusCode;
};

export const unlikePost = async (userID, postID) => {
  let statusCode = 500;

  try {
    await connection.promise().beginTransaction();

    let [delRequest] = await connection
      .promise()
      .execute("delete from likes where user_id=? and post_id=?", [
        userID,
        postID,
      ]);
    if (delRequest.affectedRows == 0) {
      statusCode = 400;
      throw new Error("You never liked the post");
    }

    let [updateRequest] = await connection
      .promise()
      .execute("update posts set likes = likes-1 where id=?", [postID]);

    await connection.promise().commit();
    statusCode = 204;
  } catch (err) {
    await connection.promise().rollback();
    if (err.errno == 1062 || err.errno == 1452) statusCode = 400;
  }

  return statusCode;
};

const getFriendIDs = (friends) => {
  let friendList = [];
  friends.forEach((friend) => {
    friendList.push(friend.id);
  });
  return friendList;
};

const prepareQuery = (friends) => {
  let query = "select * from posts where ";
  friends.forEach((_, index) => {
    query += "user_id=? ";
    if (index != friends.length - 1) query += "or ";
  });
  query += "order by timestamp desc limit ? offset ?";
  return query;
};

// const updateLike = async (postID) => {
//     try{
//     let request = await connection
//       .promise()
//       .query("update posts set likes = likes+1 where id = ?", [postID]);}

// }
