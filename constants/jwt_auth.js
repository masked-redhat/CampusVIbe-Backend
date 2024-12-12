import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET_KEY = process.env.TOKENSECRETKEY;
const JWT_ACCESSTOKEN_EXPIRY = 24 * 60 * 60 * 1000;
const JWT_REFRESHTOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

const constants = {
  JWT_ACCESSTOKEN_EXPIRY,
  JWT_REFRESHTOKEN_EXPIRY,
  JWT_SECRET_KEY,
};

export default constants;
