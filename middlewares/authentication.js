import COOKIE_OPTIONS from "../constants/cookie_op.js";
import { JwtAuth } from "../controllers/jwt_authentication.js";
import User from "../models/user.js";
import checks from "../utils/checks.js";
import responses from "../utils/response.js";

const ERROR_CALLBACK_URL = "/login";
const USER_KEY = "username";

const setupAuth = (res, userData, userKey = USER_KEY) => {
  // create tokens
  const userTokenizer = new JwtAuth.JwtTokenizer(userData, userKey);
  const tokens = userTokenizer.createTokens();

  // return the access token to be sent by http method
  return tokens;
};

const resetAuth = (userData) => {
  // create tokens
  const userTokenizer = new JwtAuth.JwtTokenizer(userData, USER_KEY);
  const accessToken = userTokenizer.createAccessToken();

  // return the access token to be sent by http method
  return accessToken;
};

const validateAuth = async (req, res, next) => {
  const userValidator = new JwtAuth.JwtValidator(async (entity) => {
    const where = {};
    where[USER_KEY] = entity[USER_KEY];
    const user = await User.findOne({ where: where });
    if (checks.isNotNuldefined(user) && checks.isTrue(!user.blacklist))
      return true;
    return false;
  });

  // check if access token is valid
  // return user value in req
  {
    const accessToken = getAccessTokenFromReq(req);

    let { verified, entity: user } = await userValidator.validate(accessToken);

    if (verified) {
      req.verified = verified;
      req.user = user;
      next();
      return;
    }
  }

  // check if refresh token is valid
  const refreshToken = getRefreshTokenFromReq(req);
  let {
    statusCode,
    verified,
    entity: user,
  } = await userValidator.validate(refreshToken);

  // if refresh is valid, reset access token for user
  if (verified) {
    const accessToken = resetAuth({ USER_KEY: user[USER_KEY] });

    req.verified = verified;
    req.accessToken = accessToken;
    next();
    return;
  }
  // if not, return bad status code
  else
    responses.serve(
      res,
      statusCode,
      "Authorization error, token validation failed"
    );
};

const setRefreshTokenInCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
};

const getAccessTokenFromReq = (req) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  return token;
};

const getRefreshTokenFromReq = (req) => {
  const cookies = req.cookies;

  return cookies["refreshToken"];
};

const authentication = {
  setupAuth,
  validateAuth,
  setRefreshTokenInCookie,
};

export default authentication;
