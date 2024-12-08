import Friend from "../controllers/friends.js";
import codes from "../utils/status_codes.js";

const handleGetFriends = async (req) => {
  const friend = new Friend(req.user.uid);

  let friends = await friend.friendsList();

  let statusCode = codes.get.OK;
  let message = "got friends for you";

  return { statusCode, message, friends };
};

const handleGetRequests = async (req) => {
  const friend = new Friend(req.user.uid, req.query);

  let requests = await friend.getRequests();

  let statusCode = codes.get.OK;
  let message = "got requests for you";

  return { statusCode, message, requests };
};

const handleSendRequest = async (req) => {
  const friend = new Friend(req.user.uid, req.body);
  await friend.checkDatabase();

  let requestSent = await friend.sendRequest();

  let statusCode, message;

  if (requestSent) {
    statusCode = codes.post.CREATED;
    message = "request sent to the user";
  } else {
    statusCode = codes.clientError.BAD_REQUEST;
    message = "try again later";
  }

  return { statusCode, message };
};

const handleAcceptRequest = async (req) => {
  const friend = new Friend(req.user.uid, req.body);
  await friend.checkDatabase();

  let requestAccepted = await friend.acceptRequest();

  let statusCode, message;

  if (requestAccepted) {
    statusCode = codes.put.OK;
    message = "request accepted";
  } else {
    statusCode = codes.clientError.BAD_REQUEST;
    message = "try again";
  }

  return { statusCode, message };
};

const handleCancelRequest = async (req) => {
  const friend = new Friend(req.user.uid, req.query);
  await friend.checkDatabase();

  let requestCancel = await friend.cancelRequest();

  let statusCode, message;

  if (requestCancel) {
    statusCode = codes.delete.NO_CONTENT;
    message = "request cancelled";
  } else {
    statusCode = codes.clientError.BAD_REQUEST;
    message = "try again";
  }

  return { statusCode, message };
};

const handleUnfriend = async (req) => {
  const friend = new Friend(req.user.uid, req.query);
  await friend.checkDatabase();

  let removeFriend = await friend.removeFriend();

  let statusCode, message;

  if (removeFriend) {
    statusCode = codes.delete.NO_CONTENT;
    message = "request cancelled";
  } else {
    statusCode = codes.clientError.BAD_REQUEST;
    message = "try again";
  }

  return { statusCode, message };
};

const handlers = {
  handleGetFriends,
  handleGetRequests,
  handleAcceptRequest,
  handleCancelRequest,
  handleSendRequest,
  handleUnfriend,
};

export default handlers;
