import { Router } from "express";
import authentication from "../middlewares/authentication.js";
import PSWRD from "../utils/password.js";
import checks from "../utils/checks.js";
import User from "../models/user.js";
import codes from "../utils/codes.js";

const router = Router();

router.post("/", async (req, res) => {
  const username = req.body.username;
  const passwordReq = req.body.password;

  const password = new PSWRD.HashPassword(passwordReq).getHashed();

  let statusCode = null,
    message = null;

  // Check if username or password is not blank
  if (!checks.isNotNuldefined(username) || !checks.isNotNuldefined(password)) {
    statusCode = codes.clientError.BAD_REQUEST;
    message = "Username or password blank";
  }

  const user = await User.findOne({
    username: username,
  });

  if (!checks.isNotNuldefined(user)) {
    statusCode = codes.clientError.NOT_FOUND;
    message = "No user found with that username";
  }

  const matchPasswords = new PSWRD.PasswordComparison(passwordReq, password);

  if (!checks.isTrue(matchPasswords.isMatch())) {
    statusCode = codes.clientError.UNAUTHORIZED;
    message = "Password incorrect for the user";
  }

  if (!checks.isTrue(statusCode, null)) {
    res.status(statusCode).json({ message });
    return;
  }

  let tokens = authentication.setupAuth(res, {
    id: user.id,
    username: user.username,
    blacklist: user.blacklist,
  });

  console.log(tokens);

  statusCode = codes.OK;
  message = "Authorization complete";

  res.send("gola");
});

router.post("/new", (req, res) => {});

export const LoginRouter = router;
