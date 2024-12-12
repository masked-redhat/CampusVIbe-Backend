import constants from "./jwt_auth";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  maxAge: constants.JWT_REFRESHTOKEN_EXPIRY,
};

export default COOKIE_OPTIONS;
