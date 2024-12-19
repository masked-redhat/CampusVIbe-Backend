import { Router } from "express";
import authentication from "../middlewares/authentication.js";
import PSWRD from "../utils/password.js";
import checks from "../utils/checks.js";
import User from "../models/user.js";
import codes from "../utils/codes.js";
import responses from "../utils/response.js";

const router = Router();

// Login
router.post("/", async (req, res) => {
  // get the username and password from the body that may have come
  // in json format
  const username = req.body.username;
  const passwordReq = req.body.password;

  // get the hashed password
  const password = new PSWRD.HashPassword(passwordReq).getHashed();

  let statusCode = null,
    message = null;

  // Check if username or password is not blank
  if (!checks.isNotNuldefined(username) || !checks.isNotNuldefined(password)) {
    statusCode = codes.clientError.BAD_REQUEST;
    message = "Username or password blank";
    return responses.serve(res, statusCode, message);
  }

  // find the user
  const user = await User.findOne({
    where: {
      username: username,
    },
  });

  // if user is null or undefined
  if (!checks.isNotNuldefined(user)) {
    statusCode = codes.clientError.NOT_FOUND;
    message = "No user found with that username";
    return responses.serve(res, statusCode, message);
  }

  // match if passwords are same
  const matchPasswords = new PSWRD.PasswordComparison(
    passwordReq,
    user.password
  );

  // if not same
  if (!checks.isTrue(matchPasswords.isMatch())) {
    statusCode = codes.clientError.UNAUTHORIZED;
    message = "Password incorrect for the user";
    return responses.serve(res, statusCode, message);
  }

  // if user is blacklisted
  if (checks.isTrue(user.blacklist)) {
    statusCode = codes.FORBIDDEN;
    message = "User is blacklisted, appeal to remove ban on this user";
    return responses.serve(res, statusCode, message);
  }

  // create tokens for the user for further authentication during
  // using the application
  let tokens = authentication.setupAuth(res, {
    username: user.username,
  });

  // refresh tokens in cookies
  authentication.setRefreshTokenInCookie(res, tokens.refreshToken);

  statusCode = codes.OK;
  message = "Authorization complete";

  // serve the response with the access token
  responses.serve(res, statusCode, message, {
    accessToken: tokens.accessToken,
  });
});

// Signup
router.post("/new", async (req, res) => {
  const username = req.body.username;
  const passwordReq = req.body.password;

  const password = new PSWRD.HashPassword(passwordReq).getHashed();

  let statusCode = null,
    message = null;

  // Check if username or password is not blank
  if (!checks.isNotNuldefined(username) || !checks.isNotNuldefined(password)) {
    statusCode = codes.clientError.BAD_REQUEST;
    message = "Username or password blank";
    return responses.serve(res, statusCode, message);
  }

  // create new user in database
  let user = null;
  try {
    user = await User.create({
      username: username,
      password: password,
    });
  } catch (err) {
    console.log(err);

    if (checks.isErrorCode(err, 1062)) {
      statusCode = codes.clientError.CONFLICT;
      message = "A user with that username already exists";
    } else {
      statusCode = codes.serverError.INTERNAL_SERVER_ERROR;
      message = "Server is having issues processing requests like these";
    }
    return responses.serve(res, statusCode, message);
  }

  // create tokens for the user for further authentication during
  // using the application
  let tokens = authentication.setupAuth(res, {
    username: user.username,
  });

  // refresh tokens in cookies
  authentication.setRefreshTokenInCookie(res, tokens.refreshToken);

  statusCode = codes.post.CREATED;
  message = `New user created with username: ${username}`;

  // serve the response with the access token
  responses.serve(res, statusCode, message, {
    accessToken: tokens.accessToken,
  });
});

export const LoginRouter = router;
