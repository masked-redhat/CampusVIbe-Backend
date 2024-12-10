import { affectedOne, isEmpty } from "../utils/utils.js";
import { getResponseDb } from "./connection.js";

const DEFAULTPFP = "usericon.png";
const businessDefault = {
  BUSINESS: "business",
  ABOUT: null,
  MISSIONSTATEMENT: null,
  CONTACTEMAIL: null,
  CONTACTPHONE: null,
  PFP: DEFAULTPFP,
};

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

const getUserProfileByUserId = async (id, business = false) => {
  let profile = null;

  const profileType = `${business ? "business" : "user"}_profile`;

  try {
    let [res] = await getResponseDb(
      `select * from ${profileType} where user_id=?`,
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

const updateUserProfile = async (
  userId,
  firstName,
  lastName = null,
  pfp = DEFAULTPFP
) => {
  let toUpdate = 0,
    queryAddition = [],
    values = [];
  const updateable = [
    [firstName, "first_name"],
    [lastName, "last_name"],
    [pfp, "pfp"],
  ];
  updateable.forEach((item) => {
    if (item[0] !== null) {
      queryAddition.push(`${item[1]}=?`);
      values.push(item[0]);
      toUpdate++;
    }
  });

  if (toUpdate === 0) return true;

  const query = `update user_profile set ${queryAddition.join(
    ", "
  )} where user_id=?`;

  try {
    let [res] = await getResponseDb(query, [...values, userId]);

    if (affectedOne(res)) return true;
  } catch (err) {
    console.log(err);
  }

  return false;
};

// TODO Business Profiling
// const createBusinessProfile = async (
//   username,
//   businessName,
//   businessType = businessDefault.BUSINESS,
//   about = businessDefault.ABOUT,
//   missionStatement = businessDefault.MISSIONSTATEMENT,
//   location = null,
//   contactEmail = null,
//   contactPhone = null,
//   pfp = businessDefault.PFP
// ) => {


// };

const db = {
  DEFAULTPFP,
  getUserByUserId,
  getUserProfileByUserId,
  createUserProfile,
  updateUserProfile,
//   createBusinessProfile,
};

export default db;
