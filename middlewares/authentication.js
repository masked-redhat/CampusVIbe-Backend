import COOKIE_OPTIONS from "../constants/cookie_op.js";
import { JwtAuth } from "../controllers/jwt_authentication.js";

const ERROR_CALLBACK_URL = "/login";
const USER_KEY = "id";

const setupAuth = (res, userData) => {
  // create tokens
  const userTokenizer = new JwtAuth.JwtTokenizer(userData, USER_KEY);
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

const validateAuth = async (req, next) => {
  const userValidator = new JwtAuth.JwtValidator();

  // check if access token is valid
  // return user value in req
  {
    const accessToken = getAccessTokenFromReq(req);

    let { verified, entity: user } = await userValidator.validate(accessToken);

    if (verified) {
      req.user = user;
      next();
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
    const accessToken = resetAuthForUser({ id: user.id });

    return { verified, accessToken };
  }

  // if not, return bad status code
  return { statusCode, verified };
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
