import { Router } from "express";
import authenticate from "../middleware/authentication.js";
import upload from "../middleware/parser.js";
import codes from "../utils/status_codes.js";
import handlers from "../handlers/posts.js";

const router = Router();

// Middleware for url /posts and /posts/*
router.use(authenticate);

// Get posts
router.get("/", async (req, res) => {
  const { statusCode, message, posts } = await handlers.handleGetPosts(req);

  res.status(statusCode).json({ message, posts });
});

// Create post
router.post("/", upload.single("image"), async (req, res) => {
  const { statusCode, message, postData } = await handlers.handleCreatePost(
    req
  );

  res.status(statusCode).json({ message, post: postData });
});

// Delete post
router.delete("/", async (req, res) => {
  const { statusCode, message } = await handlers.handleDeletePost(req);

  res.status(statusCode).json({ message });
});

// Like post
router.patch("/like", async (req, res) => {
  const { statusCode, message } = await handlers.handleLikePost(req);

  res.status(statusCode).json({ message });
});

// Unlike post
router.delete("/like", async (req, res) => {
  const { statusCode, message } = await handlers.handleUnLikePost(req);

  res.status(statusCode).json({ message });
});

router.all("/", (_, res) => {
  res.sendStatus(codes.clientError.METHOD_NOT_ALLOWED);
});

router.all("/like", (_, res) => {
  res.sendStatus(codes.clientError.METHOD_NOT_ALLOWED);
});

export const PostRouter = router;
