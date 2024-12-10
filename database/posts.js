import Friend from "../controllers/friends.js";
import { affectedOne, isEmpty } from "../utils/utils.js";
import { getResponseDb } from "./connection.js";

const DEFAULTPOSTORDER = "order by timestamp desc";
const DEFAULTPOSTLIMIT = 10;

const insertPost = async (userId, title, content, image) => {
  let postId = null;

  try {
    let [post] = await getResponseDb(
      "insert into posts (user_id, title, content, image) values (?, ?, ?, ?)",
      [userId, title, content, image]
    );

    if (affectedOne(post)) postId = post.insertId;
  } catch (err) {
    console.log(err);
  }

  return { success: postId !== null, postId };
};

const deletePost = async (userId, postId) => {
  try {
    let [res] = await getResponseDb(
      "delete from posts where id=? and user_id=?",
      [postId, userId]
    );

    if (affectedOne(res)) return true;
  } catch (err) {
    console.log(err);
  }

  return false;
};

const like = async (userId, postId) => {
  try {
    let [res] = await getResponseDb(
      "insert into likes (user_id, post_id) values (?, ?)",
      [userId, postId]
    );

    if (affectedOne(res)) return true;
  } catch (err) {
    console.log(err);
  }

  return false;
};

const unlike = async (userId, postId) => {
  try {
    let [res] = await getResponseDb(
      "delete from likes where user_id=? and post_id=?",
      [userId, postId]
    );

    if (affectedOne(res)) return true;
  } catch (err) {
    console.log(err);
  }

  return false;
};

const increaseLikeCount = async (postId) => {
  try {
    let [res] = await getResponseDb(
      "update posts set likes = likes+1 where id=?",
      [postId]
    );

    if (affectedOne(res)) return true;
  } catch (err) {
    console.log(err);
  }

  return false;
};

const decreaseLikeCount = async (postId) => {
  try {
    let [res] = await getResponseDb(
      "update posts set likes = likes-1 where id=?",
      [postId]
    );

    if (affectedOne(res)) return true;
  } catch (err) {
    console.log(err);
  }

  return false;
};

const prepareQuery = async (userId, personal = true) => {
  let friends = [];
  if (personal) friends = await new Friend(userId).friendsList();

  let queryAddition = !isEmpty(friends)
    ? friends.map((_) => `user_id = ?`).join(" or ")
    : "";
  queryAddition = queryAddition
    ? `where (user_id <> ?) and (${queryAddition})`
    : "where user_id <> ?";

  let query = `select * from posts ${queryAddition} ${DEFAULTPOSTORDER} limit ${DEFAULTPOSTLIMIT} offset ?`;

  return { query, values: [userId, ...friends.map((f) => f.userId)] };
};

const getPosts = async (userId, offset, personal = true) => {
  let posts = [];

  let query = await prepareQuery(userId, personal);
  let values = [...query.values, offset].map((_) => `${_}`);

  try {
    let [res] = await getResponseDb(query.query, values);

    posts = res;
  } catch (err) {
    console.log(err);
  }

  return posts;
};

const db = {
  getPosts,
  insertPost,
  deletePost,
  like,
  increaseLikeCount,
  unlike,
  decreaseLikeCount,
};

export default db;
