import {
  affectedOne,
  isEmpty,
  prepareQuerySelectValNotNull,
} from "../utils/utils.js";
import { getResponseDb } from "./connection.js";

const DEFAULTNEWSORDER = "order by timestamp desc";
const DEFAULTNEWSLIMIT = "10";

const getNews = async (offset, allNews = false) => {
  let news = [];

  try {
    let [res] = await getResponseDb(
      `select * from news ${
        allNews ? "" : "where verified=true"
      } ${DEFAULTNEWSORDER} limit ${DEFAULTNEWSLIMIT} offset ?`,
      [offset]
    );

    news = res;
  } catch (err) {
    console.log(err);
  }

  return news;
};

const getNewsByNewsId = async (newsId) => {
  let news = null;

  try {
    let [res] = await getResponseDb(`select * from news where id=?`, [newsId]);

    news = res[0];
  } catch (err) {
    console.log(err);
  }

  return news;
};

const createNews = async (userId, title, content, image, verified = false) => {
  let success = false,
    newsId = null;

  try {
    let [res] = await getResponseDb(
      "insert into news (user_id, title, content, image) values (?, ?, ?, ?)",
      [userId, title, content, image]
    );

    if (affectedOne(res)) {
      success = true;
      newsId = res.insertId;
    }
  } catch (err) {
    console.log(err);
  }

  return { success, newsId };
};

const deleteNewsByNewsId = async (userId, newsId) => {
  try {
    let [res] = await getResponseDb(
      "delete from news where id=? and user_id=?",
      [newsId, userId]
    );

    if (affectedOne(res)) return true;
  } catch (err) {
    console.log(err);
  }

  return false;
};

const updateNews = async (
  userId,
  newsId,
  title,
  content,
  image,
  verified = false,
  admin = false
) => {
  const toUpdate = prepareQuerySelectValNotNull(
    ["title", "content", "image"],
    [title, content, image],
    "set",
    true
  );

  let timestamp = new Date();
  timestamp =
    timestamp.toISOString().split("T")[0] +
    " " +
    timestamp.toTimeString().split(" ")[0];

  if (isEmpty(toUpdate) && !verified) return false;
  if (isEmpty(toUpdate)) toUpdate.queryAddition = "verified=?";

  let vals = [...toUpdate.values, timestamp, verified, newsId];
  if (!admin) vals.push(userId);

  try {
    let [res] = await getResponseDb(
      `update news ${toUpdate.queryAddition}${
        isEmpty(toUpdate.values) ? "" : ","
      } timestamp=?, verified=? where id=? ${!admin ? "and user_id=?" : ""}`,
      vals
    );

    console.log(res)

    if (affectedOne(res)) return true;
  } catch (err) {
    console.log(err);
  }

  return false;
};

const db = {
  getNews,
  getNewsByNewsId,
  createNews,
  deleteNewsByNewsId,
  updateNews,
};

export default db;
