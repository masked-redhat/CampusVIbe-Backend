import jwt from "jsonwebtoken";
import checks from "../utils/checks.js";
import codes from "../utils/codes.js";
import constants from "../constants/jwt_auth.js";

const JWT_SECRET_KEY = constants.JWT_SECRET_KEY;

class JwtTokenizer {
  #accessOptions = {
    expiresIn: constants.JWT_ACCESSTOKEN_EXPIRY,
  };
  #refreshOptions = {
    expiresIn: constants.JWT_REFRESHTOKEN_EXPIRY,
  };

  constructor(entity, key = "id", accessOptions = null, refreshOptions = null) {
    this.entity = entity;
    this.key = key;
    this.#accessOptions = accessOptions ?? this.#accessOptions;
    this.#refreshOptions = refreshOptions ?? this.#refreshOptions;
  }

  createTokens = () => {
    const tokens = {
      accessToken: this.createAccessToken(),
      refreshToken: this.createRefreshToken(),
    };

    return tokens;
  };

  createAccessToken = () => {
    const accessToken = jwt.sign(
      this.entity,
      JWT_SECRET_KEY,
      this.#accessOptions
    );

    return accessToken;
  };

  createRefreshToken = () => {
    const key = this.key;
    const entity = { key: this.entity[key] };

    const refreshToken = jwt.sign(entity, JWT_SECRET_KEY, this.#refreshOptions);

    return refreshToken;
  };
}

class JwtValidator {
  constructor(verifyFn) {
    this.verifyEntity = verifyFn ?? ((entity) => true);
  }

  validate = async (token) => {
    let statusCode = codes.DEFAULT,
      verified = false,
      entity = null;

    if (checks.isNull()) statusCode = codes.UNAUTHORIZED;

    try {
      entity = jwt.verify(token, JWT_SECRET_KEY);

      verified = checks.isTrue(await this.verifyEntity(entity));

      statusCode = verified ? codes.OK : codes.FORBIDDEN;
    } catch (err) {
      statusCode = codes.FORBIDDEN;

      console.log(err);
    }

    return { statusCode, verified, entity };
  };
}

export const JwtAuth = { JwtTokenizer, JwtValidator };
