import { Router } from "express";
import { getPostID } from "../utils/post.js";
import {
  getCommentData,
  getCommentId,
  getCommentType,
} from "../utils/comment.js";
import {
  deleteComment,
  getCommentsForPost,
  writeComment,
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

// Delete Comment
router.delete("/", async (req, res) => {
  const commentId = getCommentId(req.query);

  let sC = await deleteComment(req.user.uid, commentId);

  res.sendStatus(sC);
});

export const CommentRouter = router;
