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
    // console.log(err);
  }
  return statusCode;
};

export const updateCommentVotes = async (userID, commentID, voteVal) => {
  let statusCode = 500;

  try {
    let updatedVal = voteVal;
    await connection.promise().beginTransaction();

    let [currValue] = await connection
      .promise()
      .execute("select * from commentvotes where user_id=? and comment_id=?", [
        userID,
        commentID,
      ]);

    if (currValue.length == 0) {
      if (voteVal == 0) {
        statusCode = 422;
        throw new Error("No action can be done");
      }
      updatedVal = voteVal;
      let [request] = await connection
        .promise()
        .execute(
          "insert into commentvotes (vote_value, user_id, comment_id) values (?, ?, ?)",
          [voteVal, userID, commentID]
        );

      if (request.affectedRows == 0) throw new Error("Couldn't Insert");
    } else {
      let currVote = currValue[0].vote_value;
      switch (currVote) {
        case 0:
          updatedVal = voteVal;
          break;
        case 1:
          updatedVal = voteVal - 1;
          break;
        case -1:
          updatedVal = voteVal + 1;
          break;
      }
      let [request] = await connection
        .promise()
        .execute(
          "update commentvotes set vote_value =? where user_id=? and comment_id=?",
          [voteVal, userID, commentID]
        );

      if (request.affectedRows == 0) throw new Error("Couldn't Insert");
    }

    let [request] = await connection
      .promise()
      .execute("update comments set votes = votes + ? where id=?", [
        updatedVal,
        commentID,
      ]);

    if (request.affectedRows == 1) statusCode = 204;
    else statusCode = 400;

    await connection.promise().commit();
  } catch (err) {
    await connection.promise().rollback();
    if (err.errno == 1062) statusCode = 400;
    console.log(err);
  }

  return statusCode;
};

export const getReplies = async (comment) => {
  let statusCode = 500,
    replies = [];
  try {
    let [result] = await connection
      .promise()
      .query(
        "select * from comments where reply_id=? order by votes desc, timestamp desc limit 10 offset ?",
        [comment.id, comment.offset]
      );
    replies = result;
    statusCode = 200;
  } catch (err) {
    // console.log(err);
  }

  return { sC: statusCode, replies };
};

export const writeReply = async (userId, commentObj, entityId) => {
  let statusCode = 500,
    replyId = null;
  try {
    await connection.promise().beginTransaction();

    let [validReq] = await connection
      .promise()
      .query(`select * from comments where ${commentObj.type}_id=? and id=?`, [
        entityId,
        commentObj.id,
      ]);

    if (validReq.length == 0) {
      statusCode = 400;
      throw new Error("No comment like that with that post/answer");
    }

    let [result] = await connection
      .promise()
      .query(
        `insert into comments (user_id, comment, ${commentObj.type}_id, reply_id) values (?, ?, ?, ?)`,
        [userId, commentObj.comment, entityId, commentObj.id]
      );

    replyId = result.insertId;
    statusCode = 201;
    await connection.promise().commit();
  } catch (err) {
    await connection.promise().rollback();
    // console.log(err)
  }

  return { sC: statusCode, replyId };
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
    return `select * from comments where (${type}_id = ? and reply_id is null) order by votes desc, timestamp desc limit 10 offset ?`;
  else {
    let error = new Error("Type not valid");
    error.errno = 450;
    throw error;
  }
};
