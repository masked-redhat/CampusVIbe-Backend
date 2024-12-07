import secure from "../utils/password.js";
import { isEmpty } from "../utils/utils.js";
import { getResponseDb } from "./connection.js";

const getUserByUsernamePassword = async (username, password) => {
  let [userResult] = await getResponseDb(
    "select * from users where username = ?",
    [username]
  );

  const user = userResult[0];

  if (isEmpty(user) || !secure.comparePassword(password, user.password))
    return {};

  return user;
};

const createUser = async (username, password) => {
  password = secure.hashPassword(password);

  const user = {};

  try {
    let [response] = await getResponseDb(
      "insert into users (username, password) values (?, ?)",
      [username, password]
    );

    if (response.affectedRows === 0)
      throw new Error("User did not get created, but the query ran");

    user.id = response?.insertId;
    user.blacklist = false;
  } catch (err) {
    console.log(err);

    user.id = null;
    user.blacklist = null;
  }

  user.username = username;
  user.password = password;

  return user;
};

const db = {
  getUserByUsernamePassword,
  createUser,
};

export default db;
