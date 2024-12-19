import User from "../models/user.js";
import checks from "../utils/checks.js";
import codes from "../utils/codes.js";
import PSWRD from "../utils/password.js";
import { REQ_TYPE } from "../utils/request.js";
import responses from "../utils/response.js";

const SERVER_ERROR_CODE = codes.serverError.INTERNAL_SERVER_ERROR;
const SERVER_ERROR_MESSAGE =
  "Server couldn't handle the request, try again later";

const BAD_REQUEST_CODE = codes.clientError.BAD_REQUEST;
const USERNAME_OR_PASSWORD_NOT_GIVEN_MESSAGE =
  "Username or password cannot be empty";

const CONFLICT_CODE = codes.clientError.CONFLICT;
const CONFLICT_MESSAGE = "A user with that username already exists";

const CONFLICT_DB_ERROR_CODE = 1062;

class UserAccount {
  #username;
  #password;
  #passwordHashed;

  constructor(reqBody = null) {
    this.#username = reqBody?.username ?? null;
    this.#password = reqBody?.password ?? null;
  }

  setup = (res) => {
    if (
      !checks.isNotNuldefined(this.#username) ||
      !checks.isNotNuldefined(this.#password)
    )
      return responses.serve(
        res,
        BAD_REQUEST_CODE,
        USERNAME_OR_PASSWORD_NOT_GIVEN_MESSAGE
      );

    this.#passwordHashed = new PSWRD.HashPassword(this.#password).getHashed();

    return null;
  };

  createNewUser = async (res) => {
    let user = null;
    try {
      user = await User.create({
        username: this.#username,
        password: this.#passwordHashed,
      });
    } catch (err) {
      console.log(err);

      if (checks.isErrorCode(err, CONFLICT_DB_ERROR_CODE))
        return responses.serve(res, CONFLICT_CODE, CONFLICT_MESSAGE);

      return responses.serve(res, SERVER_ERROR_CODE, SERVER_ERROR_MESSAGE);
    }
  };

  setupTokenAuthorization = (res, type = REQ_TYPE.POST) => {
    let tokens = authentication.setupAuth(res, {
      username: this.#username,
    });

    // refresh tokens in cookies
    authentication.setRefreshTokenInCookie(res, tokens.refreshToken);

    statusCode = codes.post.CREATED;
    message = `New user created with username: ${this.#username}`;

    // serve the response with the access token
    return responses.serve(res, statusCode, message, {
      accessToken: tokens.accessToken,
    });
  };
}
