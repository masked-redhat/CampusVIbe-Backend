import connection from "./connection.js";

export const getProfile = async (userID, business) => {
  let statusCode = 500,
    profile = {};

  try {
    let profileLoc = "user";
    if (business) {
      let [user] = await connection
        .promise()
        .query("select * from users where id=?", [userID]);
      if (user.business) profileLoc = "business";
      else {
        statusCode = 400;
        throw new Error(
          "No business profile for this account has been registered"
        );
      }
    }

    let [user] = await connection
      .promise()
      .query(`select * from ${profileLoc}_profile where user_id=?`, [userID]);

    profile = user;
    statusCode = 200;
  } catch (err) {
    // console.log(err);
  }

  return { sC: statusCode, profile };
};


export const setProfile = async (userID, userInfo, buisness) => {
    
}