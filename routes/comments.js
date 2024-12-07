import { Router } from "express";
import { getPostID } from "../utils/post.js";
import {
  getCommentData,
  getCommentId,
  getCommentType,
  getEntityId,
  getVoteValue,
} from "../utils/comment.js";
import {
  deleteComment,
  getCommentsForPost,
  getReplies,
  updateCommentVotes,
  writeComment,
  writeReply,
} from "../database/comments.js";
import authenticate from "../middleware/authentication.js";
import upload from "../middleware/parser.js";

const router = Router();

// Middleware for /comments and /comments/*
router.use(authenticate);
router.use(upload.none());

// Get Comments
router.get("/", async (req, res) => {
  const comment = getCommentData(req.query);

  let result = await getCommentsForPost(comment);

  res.status(result.sC).json({ comments: result.comments });
});

// Post Comment
router.post("/", async (req, res) => {
  const comment = getCommentData(req.body);
  console.log(comment);

  let result = await writeComment(req.user.uid, comment);

  res.status(result.sC).json({ id: result.commentId });
});

// Delete Comment/Reply
router.delete(["/", "/reply"], async (req, res) => {
  const commentId = getCommentId(req.query);

  let sC = await deleteComment(req.user.uid, commentId);

  res.sendStatus(sC);
});

// Upvote, Unvote, Downvote Comment
router.put("/vote", async (req, res) => {
  const commentId = getCommentId(req.query);
  const voteVal = getVoteValue(req.query);

  if ([0, 1, -1].includes(voteVal)) {
    let result = await updateCommentVotes(req.user.uid, commentId, voteVal);

    res.sendStatus(result);
  } else res.sendStatus(400);
});

// Get replies to a comment
router.get("/reply", async (req, res) => {
  const comment = getCommentData(req.query);
  if (comment.id) {
    let result = await getReplies(comment);

    res.status(result.sC).json(result.replies);
  } else res.sendStatus(400);
});

// post a reply to comment
router.post("/reply", async (req, res) => {
  const comment = getCommentData(req.body);
  const entityId = getEntityId(req.body);

  let result = await writeReply(req.user.uid, comment, entityId);

  res.status(result.sC).json({ id: result.replyId });
});

router.all("/", (req, res) => {
  res.sendStatus(405);
});

router.all("/vote", (req, res) => {
  res.sendStatus(405);
});

router.all("/reply", (req, res) => {
  res.sendStatus(405);
});

export const CommentRouter = router;
