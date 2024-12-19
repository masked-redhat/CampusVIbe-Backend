import { Router } from "express";
import authentication from "../middlewares/authentication.js";
import userDb from "../db/user.js";
import checks from "../utils/checks.js";
import responses from "../utils/response.js";
import Post from "../models/post.js";
import codes from "../utils/codes.js";
import PostHandler from "../controllers/post.js";
import { REQ_TYPE } from "../utils/request.js";

const router = Router();

// middleware for authentication
router.use(authentication.validateAuth);

router.get("/", async (req, res) => {
  const handler = new PostHandler(req.user, req.query);
  if (!checks.isNull(await handler.setup(res))) return;

  return await handler.getPosts(res);
});

router.post("/", async (req, res) => {
  const handler = new PostHandler(req.user, req.body);
  if (!checks.isNull(await handler.setup(res))) return;

  return handler.createPost(res);
});

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

router.delete("/", async (req, res) => {
  const handler = new PostHandler(req.user, req.query);
  if (!checks.isNull(await handler.setup(res))) return;

  return handler.deletePost(res);
});

export const PostRouter = router;
