import { Router } from "express";
import authentication from "../middlewares/authentication.js";
import userDb from "../db/user.js";
import checks from "../utils/checks.js";
import responses from "../utils/response.js";
import Post from "../models/post.js";
import codes from "../utils/codes.js";

const router = Router();

// middleware for authentication
router.use(authentication.validateAuth);

router.get("/", async (req, res) => {
  let { statusCode, message, userId } = await userDb.getUserIdFromUsername(
    req.user.username
  );

  if (checks.isNull(userId)) responses.serve(res, statusCode, message);
  const offsetAmt = req.query.offset ?? 0;

  console.log(userId);

  let posts = await Post.findAll({
    where: { userId: userId },
    offset: offsetAmt,
    limit: 10,
  });

  posts = posts.map((p) => {
    let x = p.dataValues;
    delete x.userId;
    return p.dataValues;
  });

  statusCode = codes.OK;
  message = "Found all the posts for you";

  responses.serve(res, statusCode, message, { posts });
});

router.post("/", async (req, res) => {
  let { statusCode, message, userId } = await userDb.getUserIdFromUsername(
    req.user.username
  );

  if (checks.isNull(userId)) responses.serve(res, statusCode, message);

  const postTitle = req.body.title ?? null,
    postContent = req.body.content ?? null,
    postImage = req.body.image ?? null;

  if (checks.isNull(postTitle)) {
    statusCode = codes.clientError.BAD_REQUEST;
    message = "No post title given";
    responses.serve(res, statusCode, message);
    return;
  }

  let post = null;
  try {
    post = await Post.create({
      userId: userId,
      title: postTitle,
      content: postContent,
      image: postImage,
    });
  } catch (err) {
    console.log(err);

    statusCode = codes.serverError.INTERNAL_SERVER_ERROR;
    message = "Couldn't process request, try again later";
    responses.serve(res, statusCode, message);
    return;
  }

  statusCode = codes.post.CREATED;
  message = "Post successfully created";

  console.log(post);

  responses.serve(res, statusCode, message);
});

export const PostRouter = router;
