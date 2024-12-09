import { Router } from "express";
import authenticate from "../middleware/authentication.js";
import upload from "../middleware/parser.js";
import codes from "../utils/status_codes.js";
import handlers from "../handlers/comments.js";

const router = Router();

// Middleware for /comments and /comments/*
router.use(authenticate);
router.use(upload.none());

// Get Comments
router.get("/", async (req, res) => {
  const { statusCode, message, comments } = await handlers.handleGetComments(
    req
  );

  res.status(statusCode).json({ message, comments });
});

// Post Comment
router.post("/", async (req, res) => {
  const { statusCode, message, commentId } = await handlers.handleWriteComment(
    req
  );

  res.status(statusCode).json({ message, commentId });
});

// Delete Comment/Reply
router.delete(["/", "/reply"], async (req, res) => {
  const { statusCode, message } = await handlers.handleDeleteComment(req);

  res.status(statusCode).json({ message });
});

// Upvote, Unvote, Downvote Comment
router.put("/vote", async (req, res) => {
  const { statusCode, message } = await handlers.handleVoting(req);

  res.status(statusCode).json({ message });
});

// Get replies to a comment
router.get("/reply", async (req, res) => {
  const { statusCode, message, replies } = handlers.handleGetReplies(req);

  res.status(statusCode).json({ message, replies });
});

// post a reply to comment
router.post("/reply", async (req, res) => {
  const { statusCode, message, replyId } = handlers.handleWriteReply(req);

  res.status(statusCode).json({ message, replyId });
});

router.all("/", (_, res) => {
  res.sendStatus(codes.clientError.METHOD_NOT_ALLOWED);
});

router.all("/vote", (_, res) => {
  res.sendStatus(codes.clientError.METHOD_NOT_ALLOWED);
});

router.all("/reply", (_, res) => {
  res.sendStatus(codes.clientError.METHOD_NOT_ALLOWED);
});

export const CommentRouter = router;
