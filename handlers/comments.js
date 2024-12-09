import Comment from "../controllers/comments.js";
import codes from "../utils/status_codes.js";

const handleGetComments = async (req) => {
  const comment = new Comment(req.user.uid, req.query);

  const comments = await comment.getComments();

  let statusCode = codes.get.OK,
    message = "got comments for you";

  return { statusCode, message, comments };
};

const handleWriteComment = async (req) => {
  const comment = new Comment(req.user.uid, req.body);

  let written = await comment.writeComment();

  let statusCode, message;

  if (written.success) {
    statusCode = codes.post.CREATED;
    message = "comment successfull";
  } else {
    statusCode = codes.post.INTERNAL_SERVER_ERROR;
    message = "comment did not get placed, try again";
  }

  return { statusCode, message, commentId: written.commentId };
};

const handleDeleteComment = async (req) => {
  const comment = new Comment(req.user.uid, req.query);
  await comment.getComment();

  let deleted = await comment.deleteComment();

  let statusCode, message;

  if (deleted) {
    statusCode = codes.delete.NO_CONTENT;
    message = "delete successfull";
  } else {
    statusCode = codes.serverError.INTERNAL_SERVER_ERROR;
    message = "delete unsuccessfull";
  }

  return { statusCode, message };
};

const handleVoting = async (req) => {
  const comment = new Comment(req.user.uid, req.body);
  await comment.getComment();

  let voted = await comment.vote();

  let statusCode, message;

  if (voted) {
    (statusCode = codes.put.OK), (message = "voted/vote updated");
  } else {
    statusCode = codes.serverError.INTERNAL_SERVER_ERROR;
    message = "update unsuccessful";
  }

  return { statusCode, message };
};

const handleGetReplies = async (req) => {
  const comment = new Comment(req.user.uid, req.query);

  const replies = await comment.getReplies();

  let statusCode = codes.get.OK,
    message = "got replies for you";

  return { statusCode, message, replies };
};

const handleWriteReply = async (req) => {
  const comment = new Comment(req.user.uid, req.body);
  await comment.getComment();

  let written = await comment.writeReply();

  let statusCode, message;

  if (written.success) {
    statusCode = codes.post.CREATED;
    message = "reply successfull";
  } else {
    statusCode = codes.post.INTERNAL_SERVER_ERROR;
    message = "reply did not get placed, try again";
  }

  return { statusCode, message, replyId: written.replyId };
};

const handlers = {
  handleGetComments,
  handleWriteComment,
  handleDeleteComment,
  handleVoting,
  handleGetReplies,
  handleWriteReply,
};

export default handlers;
