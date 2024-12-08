import User from "../controllers/login.js";
import codes from "../utils/status_codes.js";

const handleLoginRequest = async (req) => {
  const user = new User(req.body);
  await user.getUser();

  let statusCode,
    message,
    token = null;

  if (!user.serverProcessedRequest) {
    statusCode = codes.serverError.INTERNAL_SERVER_ERROR;
    message = "sorry for the inconvenience caused by our engineers";
  } else if (!user.isUser()) {
    statusCode = codes.clientError.NOT_FOUND;
    message = "invalid username or password";
  } else if (user.isBlacklisted()) {
    statusCode = codes.clientError.FORBIDDEN;
    message = "blacklisted user";
  } else {
    token = user.getJwtToken();
    statusCode = codes.post.OK;
    message = "login success";
  }

  return { statusCode, message, token };
};

const handleSignupRequest = async (req) => {
  const user = new User(req.body);
  await user.createUser();

  let statusCode,
    message,
    token = null;

  if (!user.serverProcessedRequest) {
    statusCode = codes.serverError.INTERNAL_SERVER_ERROR;
    message = "sorry for the inconvenience caused by our engineers";
  } else if (!user.isUser()) {
    statusCode = codes.clientError.BAD_REQUEST;
    message = "try again with a new username";
  } else if (user.isBlacklisted()) {
    statusCode = codes.clientError.FORBIDDEN;
    message = "blacklisted user";
  } else {
    token = user.getJwtToken();
    statusCode = codes.post.CREATED;
    message = "signup success";
  }

  return { statusCode, message, token };
};

const handlers = {
  handleLoginRequest,
  handleSignupRequest,
};

export default handlers;
