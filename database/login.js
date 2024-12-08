import secure from "../utils/password.js";
import { affected, isEmpty } from "../utils/utils.js";
import { getResponseDb } from "./connection.js";

const getUserByUsernamePassword = async (username, password) => {
  let serverResponded = false;

  let user = {};

  try {
    let [userResult] = await getResponseDb(
      "select * from users where username = ?",
      [username]
    );

    user = userResult[0];

    if (isEmpty(user) || !secure.comparePassword(password, user.password))
      throw new Error("User is empty or password is wrong");
  } catch (err) {
    console.log(err);
    return [{}, serverResponded];
  }

  serverResponded = true;
  return [user, serverResponded];
};

const createUser = async (username, password) => {
  let serverResponded = false;

  password = secure.hashPassword(password);

  const user = {};

  try {
    let [res] = await getResponseDb(
      "insert into users (username, password) values (?, ?)",
      [username, password]
    );

    if (!affected(res))
      throw new Error("User did not get created, but the query ran");

    user.id = res?.insertId;
    user.blacklist = false;

    serverResponded = true;
  } catch (err) {
    console.log(err);

    user.id = null;
    user.blacklist = null;
  }

  user.username = username;
  user.password = password;

  return [user, serverResponded];
};

const db = {
  getUserByUsernamePassword,
  createUser,
};

export default db;
