import { Router } from "express";
import authentication from "../middlewares/authentication.js";
import checks from "../utils/checks.js";
import PostHandler from "../controllers/post.js";
import { REQ_TYPE } from "../utils/request.js";

const router = Router();

// middleware for authentication
router.use(authentication.validateAuth);

// Get the user posts
router.get("/", async (req, res) => {
  const handler = new PostHandler(req.user, req.query);
  if (!checks.isNull(await handler.setup(res))) return;

  return await handler.getPosts(res);
});

// Create post
router.post("/", async (req, res) => {
  const handler = new PostHandler(req.user, req.body);
  if (!checks.isNull(await handler.setup(res))) return;

  return handler.createPost(res);
});

// Update post
router.patch("/", async (req, res) => {
  const handler = new PostHandler(req.user, req.body);
  if (!checks.isNull(await handler.setup(res))) return;

  return handler.updatePost(res, REQ_TYPE.PATCH);
});

router.put("/", async (req, res) => {
  const handler = new PostHandler(req.user, req.body);
  if (!checks.isNull(await handler.setup(res))) return;

  return handler.updatePost(res, REQ_TYPE.PUT);
});

// Delete post
router.delete("/", async (req, res) => {
  const handler = new PostHandler(req.user, req.query);
  if (!checks.isNull(await handler.setup(res))) return;

  return handler.deletePost(res);
});

export const PostRouter = router;
