import User from "../models/user.js";
import codes from "../utils/codes.js";

const getUserIdFromUsername = async (username) => {
  let statusCode,
    message,
    userId = null;
  try {
    userId = (await User.findOne({ where: { username: username } })).id;
    statusCode = codes.OK;
    message = "Username matched";
  } catch (err) {
    console.log(err);

    statusCode = codes.serverError.INTERNAL_SERVER_ERROR;
    message = "Server is having trouble right now, try again later";
  }

  return { statusCode, message, userId };
};

const userDb = {
  getUserIdFromUsername,
};

export default userDb;
