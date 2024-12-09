import { affectedOne, capitalize, isEmpty } from "../utils/utils.js";
import { getResponseDb } from "./connection.js";

const DEFAULTPFP = "usericon.png";

const getUserByUserId = async (id) => {
  let user = null;

  try {
    let [res] = await getResponseDb("select * from users where id=?", [id]);

    if (!isEmpty(res)) user = res[0];
  } catch (err) {
    console.log(err);
  }

  return user;
};

const getUserProfileByUserId = async (id) => {
  let profile = null;

  try {
    let [res] = await getResponseDb(
      "select * from user_profile where user_id=?",
      [id]
    );

    if (!isEmpty(res)) profile = res[0];
  } catch (err) {
    console.log(err);
  }

  return profile;
};

const createUserProfile = async (
  userId,
  firstName,
  lastName = null,
  pfp = DEFAULTPFP
) => {
  if (pfp === null) pfp = DEFAULTPFP;

  let profileId = null,
    profile = null;

  try {
    let [res] = await getResponseDb(
      "insert into user_profile (user_id, first_name, last_name, pfp) values (?, ?, ?, ?)",
      [userId, firstName, lastName, pfp]
    );

    if (affectedOne(res)) profileId = res.insertId;
  } catch (err) {
    console.log(err);
  }

  if (profileId !== null)
    profile = {
      id: profileId,
      user_id: userId,
      first_name: firstName,
      last_name: lastName,
      pfp: pfp,
    };

  return { created: profileId !== null, profile };
};

const db = {
  getUserByUserId,
  getUserProfileByUserId,
  createUserProfile,
};

export default db;
