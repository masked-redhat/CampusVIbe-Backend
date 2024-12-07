import { Router } from "express";
import authenticate from "../middleware/authentication.js";
import { getOffsetValue, getPostData, getPostID } from "../utils/post.js";
import {
  deletePost,
  getAllPostsExceptUser,
  getPostForUser,
  insertPost,
  likePost,
} from "../database/posts.js";
import upload from "../middleware/parser.js";

const router = Router();

// Middleware for url /posts and /posts/*
router.use(authenticate);

// Get posts
router.get("/", async (req, res) => {
  const params = req.query;
  const uid = req.user.uid,
    offset = getOffsetValue(params);
  let postsToSend = {},
    sC = 200;

  if (params.type === "personal") {
    // Personal posts
    let response = await getPostForUser(uid, offset);
    postsToSend = response.posts;
    sC = response.sC;
  } else {
    // Every other request would be considered 'global'
    let response = await getAllPostsExceptUser(uid, offset);
    postsToSend = response.posts;
    sC = response.sC;
  }

  res.status(sC).json({ posts: postsToSend });
});

// Create post
router.post("/", upload.single("image"), async (req, res) => {
  const post = getPostData(req.body, req.file);

  const result = await insertPost(req.user.uid, post);

  res.status(result.sC).json({ postID: result.pID });
});

// Delete post
router.delete("/", async (req, res) => {
  const postID = getPostID(req.query);
  if (postID) {
    let sC = await deletePost(req.user.uid, postID);
    res.sendStatus(sC);
  } else res.sendStatus(400);
});

// Like post
router.put("/like", async (req, res) => {
  const postID = getPostID(req.query);
  if (postID) {
    let sC = await likePost(req.user.uid, postID);
    res.sendStatus(sC);
  } else res.sendStatus(400);
});

router.all("/", (req, res) => {
  res.sendStatus(405);
});

router.all("/like", (req, res) => {
  res.sendStatus(405);
});

export const PostRouter = router;
