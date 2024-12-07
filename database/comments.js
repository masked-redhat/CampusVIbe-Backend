import connection from "./connection.js";

export const getCommentsForPost = async (commentObj) => {
  let statusCode = 500,
    comments = [];
  try {
    let [request] = await connection
      .promise()
      .query(prepareQueryRead(commentObj.type), [
        commentObj.id,
        commentObj.offset,
      ]);

    if (request.length != 0) {
      statusCode = 200;
      comments = request;
    } else statusCode = 400;
  } catch (err) {
    if (err.errno == 450) statusCode = 400;
    // console.log(err);
  }
  return { sC: statusCode, comments: comments };
};

export const writeComment = async (userID, commentObj) => {
  let statusCode = 500,
    commentId = null;

  try {
    let [request] = await connection
      .promise()
      .query(prepareQueryWrite(commentObj.type), [
        commentObj.id,
        userID,
        commentObj.comment,
      ]);

    if (request.affectedRows === 1) {
      statusCode = 201;
      commentId = request.insertId;
    } else statusCode = 400;
  } catch (err) {
    if (err.errno == 1048 || err.errno == 1452 || err.errno == 450)
      statusCode = 400;
    // console.log(err);
  }

  return { sC: statusCode, commentId: commentId };
};

export const deleteComment = async (userID, commentId) => {
  let statusCode = 500;
  try {
    let [validComment] = await connection
      .promise()
      .query("select * from comments where user_id=? and id=?", [
        userID,
        commentId,
      ]);
    if (validComment.length == 1) {
      let [request] = await connection
        .promise()
        .query("delete from comments where reply_id=? or id=?", [
          commentId,
          commentId,
        ]);
      if (request.affectedRows >= 1) statusCode = 204;
    } else statusCode = 400;
  } catch (err) {
    console.log(err);
  }
  return statusCode;
};

const prepareQueryWrite = (type) => {
  if (type === "post" || type === "answer")
    return `insert into comments (${type}_id, user_id, comment) values (?, ?, ?)`;
  else {
    let error = new Error("Type not valid");
    error.errno = 450;
    throw error;
  }
};

const prepareQueryRead = (type) => {
  if (type === "post" || type === "answer")
    return `select * from comments where ${type}_id = ? order by timestamp desc limit 10 offset ?`;
  else {
    let error = new Error("Type not valid");
    error.errno = 450;
    throw error;
  }
};
