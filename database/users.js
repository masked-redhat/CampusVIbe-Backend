import connection from "./connection.js";

export const getUser = async (username, password) => {
  let userObj = null,
    statusCode=500;

  try {
    let user = await connection
      .promise()
      .query("select * from users where username = ? and password = ?", [
        username,
        password,
      ]);

    if (user[0][0] != undefined) {
      userObj = user[0][0];
      statusCode = userObj.blacklist ? 403 : 200;
    } else {
      statusCode = 404;
    }
  } catch (err) {
    // console.log(err);
    statusCode = 500;
  }

  return { user: userObj, sC: statusCode };
};

export const insertUser = async (username, password) => {
  let statusCode=500,
    uID = null;
  try {
    let result = await connection
      .promise()
      .query("insert into users (username, password) values (?, ?)", [
        username,
        password,
      ]);

    uID = result[0].insertId;
    statusCode = 201;
  } catch (err) {
    if (err.errno == 1062) statusCode = 409;
    else statusCode = 500;
  }
  return { uid: uID, sC: statusCode };
};
