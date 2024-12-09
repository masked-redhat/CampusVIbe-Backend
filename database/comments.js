import { affected, affectedOne, isEmpty } from "../utils/utils.js";
import { getResponseDb } from "./connection.js";

const DEFAULTCOMMENTSORDER = "order by votes desc, timestamp desc";
const DEFAULTCOMMENTLIMIT = "10";
const commentType = {
  POST: "post",
  ANSWER: "answer",
};

const getComments = async (type, entityId, offset) => {
  let comments = [];

  try {
    const query = prepareReadQuery(type);
    let [res] = await getResponseDb(query, [entityId, offset]);

    comments = res;
  } catch (err) {
    console.log(err);
  }

  return comments;
};

const writeComment = async (userId, type, entityId, comment) => {
  let success = false,
    commentId = null;

  try {
    const query = prepareWriteQuery(type);
    let [res] = await getResponseDb(query, [entityId, userId, comment]);

    if (affectedOne(res)) {
      success = true;
      commentId = res.insertId;
    }
  } catch (err) {
    console.log(err);
  }

  return { success, commentId };
};

const haveUserCommented = async (userId, id) => {
  try {
    let [res] = await getResponseDb(
      "select * from comments where user_id=? and id=?",
      [userId, id]
    );

    if (!isEmpty(res)) return true;
  } catch (err) {
    console.log(err);
  }

  return false;
};

const deleteComment = async (id) => {
  try {
    let [res] = await getResponseDb(
      "delete from comments where reply_id=? or id=?",
      [id]
    );

    if (affected(res)) return true;
  } catch (err) {
    console.log(err);
  }

  return false;
};

const haveUserVoted = async (userId, id) => {
  let success = false,
    voteVal = null;

  try {
    let [res] = await getResponseDb(
      "select * from commentvotes where user_id=? and comment_id=?",
      [userId, id]
    );

    if (!isEmpty(res)) {
      success = true;
      voteVal = res[0]["vote_value"];
    }
  } catch (err) {
    console.log(err);
  }

  return { success, voteVal };
};

const vote = async (userId, id, voteVal, updating = false) => {
  let query =
    "insert into commentvotes (vote_value, user_id, comment_id) values (?, ?, ?)";
  if (updating)
    query =
      "update commentvotes set vote_value=? where user_id=? and comment_id=?";

  try {
    let [res] = await getResponseDb(query, [voteVal, userId, id]);

    if (affectedOne(res)) return true;
  } catch (err) {
    console.log(err);
  }

  return false;
};

const updateCommentVotes = async (
  voteVal,
  newVoteVal,
  id,
  updating = false
) => {
  const change = updating ? newVoteVal - voteVal : newVoteVal;

  try {
    let [res] = await getResponseDb(
      "update comments set votes = votes + ? where id=?",
      [change, id]
    );

    if (affectedOne(res)) return true;
  } catch (err) {
    console.log(err);
  }

  return false;
};

const getReplies = async (id, offset) => {
  let replies = [];

  try {
    let [res] = await getResponseDb(
      `select * from comments where reply_id=? ${DEFAULTCOMMENTSORDER} limit ${DEFAULTCOMMENTLIMIT} offset ?`,
      [id, offset]
    );

    replies = res;
  } catch (err) {
    console.log(err);
  }

  return replies;
};

const isAComment = async (type, entityId, id) => {
  try {
    let [res] = await getResponseDb(
      `select * from comments where ${type}_id=? and id=?`,
      [entityId, id]
    );

    if (!isEmpty(res)) return true;
  } catch (err) {
    console.log(err);
  }

  return false;
};

const writeReply = async (userId, type, entityId, id, comment) => {
  let success = false,
    replyId = null;

  try {
    let [res] = await getResponseDb(
      `insert into comments (user_id, comment, ${type}_id, reply_id) values (?, ?, ?, ?)`,
      [userId, comment, entityId, id]
    );

    if (affectedOne(res)) {
      success = true;
      replyId = res.insertId;
    }
  } catch (err) {
    console.log(err);
  }

  return { success, replyId };
};

const prepareWriteQuery = (type) => {
  if (type === commentType.POST || type === commentType.ANSWER)
    return `insert into comments (${type}_id, user_id, comment) values (?, ?, ?)`;
  else {
    let error = new Error("Type not valid");
    throw error;
  }
};

const prepareReadQuery = (type) => {
  if (type === commentType.POST || type === commentType.ANSWER)
    return `select * from comments where (${type}_id = ? and reply_id is null) ${DEFAULTCOMMENTSORDER} limit ${DEFAULTCOMMENTLIMIT} offset ?`;
  else {
    let error = new Error("Type not valid");
    throw error;
  }
};

const db = {
  getComments,
  writeComment,
  haveUserCommented,
  haveUserVoted,
  deleteComment,
  vote,
  updateCommentVotes,
  isAComment,
  getReplies,
  writeReply,
};

export default db;
