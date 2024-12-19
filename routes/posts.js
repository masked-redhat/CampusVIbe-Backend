import { Router } from "express";
import authentication from "../middlewares/authentication.js";
import userDb from "../db/user.js";
import checks from "../utils/checks.js";
import responses from "../utils/response.js";
import Post from "../models/post.js";
import codes from "../utils/codes.js";
import PostHandler from "../controllers/post.js";

const router = Router();

// middleware for authentication
router.use(authentication.validateAuth);

router.get("/", async (req, res) => {
  const handler = new PostHandler(req.user);
  if (!checks.isNull(await handler.setup(res))) return;

  return await handler.getPosts(res);
});

router.post("/", async (req, res) => {
  const handler = new PostHandler(req.user, req.body);
  if (!checks.isNull(await handler.setup(res))) return;

  return handler.createPost(res);
});

router.patch("/", async (req, res) => {
  let { statusCode, message, userId } = await userDb.getUserIdFromUsername(
    req.user.username
  );

  if (checks.isNull(userId)) return responses.serve(res, statusCode, message);

  // select what needs to patched
  const postTitle = req.body.title ?? null,
    postContent = req.body.content ?? null,
    postImage = req.body.image ?? null,
    postId = req.body.id ?? null;

  if (checks.isNull(postId)) {
    statusCode = codes.clientError.BAD_REQUEST;
    message = "Post Id missing in the request";
    return responses.serve(res, statusCode, message);
  }

  const updatingData = {
    title: postTitle,
    content: postContent,
    image: postImage,
  };

  const toBeUpdated = {};

  for (const uData in updatingData) {
    if (!checks.isNull(updatingData[uData]))
      toBeUpdated[uData] = updatingData[uData];
  }

  // update the post with the data that needs to be updated
  let post;
  try {
    post = await Post.update(toBeUpdated, {
      where: {
        id: postId,
        userId: userId,
      },
    });
  } catch (err) {
    console.log(err);

    statusCode = codes.serverError.INTERNAL_SERVER_ERROR;
    message = "couldn't handle the request right now, try again later";
    return responses.serve(res, statusCode, message);
  }

  // if update occured, send the OK and if not NOT_FOUND
  if (post[0] === 0) {
    statusCode = codes.patch.NOT_FOUND;
    message = "No post with the credentials given found";
  } else {
    statusCode = codes.patch.OK;
    message = "Post updated";
  }

  responses.serve(res, statusCode, message);
});

router.put("/", async (req, res) => {
  let { statusCode, message, userId } = await userDb.getUserIdFromUsername(
    req.user.username
  );

  if (checks.isNull(userId)) return responses.serve(res, statusCode, message);

  const postTitle = req.body.title ?? null,
    postContent = req.body.content ?? null,
    postImage = req.body.image ?? null,
    postId = req.body.id ?? null;

  if (checks.isNull(postTitle)) {
    statusCode = codes.clientError.BAD_REQUEST;
    message = "Post title cannot be set to null.";
    return responses.serve(res, statusCode, message);
  }
  if (checks.isNull(postId)) {
    statusCode = codes.clientError.BAD_REQUEST;
    message = "Post Id missing in the request";
    return responses.serve(res, statusCode, message);
  }

  const updatingData = {
    title: postTitle,
    content: postContent,
    image: postImage,
  };

  let updated;
  try {
    updated = await Post.update(updatingData, {
      where: {
        id: postId,
        userId: userId,
      },
    });
  } catch (err) {
    console.log(err);

    statusCode = codes.serverError.INTERNAL_SERVER_ERROR;
    message = "couldn't handle the request, try again later";
    return responses.serve(res, statusCode, message);
  }

  if (updated[0] === 0) {
    statusCode = codes.patch.NOT_FOUND;
    message = "No post with the credentials given found";
  } else {
    statusCode = codes.patch.OK;
    message = "Post updated";
  }

  responses.serve(res, statusCode, message);
});

router.delete("/", async (req, res) => {
  let { statusCode, message, userId } = await userDb.getUserIdFromUsername(
    req.user.username
  );

  if (checks.isNull(userId)) return responses.serve(res, statusCode, message);

  const postId = req.query.id ?? null;

  if (checks.isNull(postId)) {
    statusCode = codes.clientError.BAD_REQUEST;
    message = "Post Id missing in the request";
    return responses.serve(res, statusCode, message);
  }

  let deleted;
  try {
    deleted = await Post.destroy({
      where: {
        id: postId,
        userId: userId,
      },
    });
  } catch (err) {
    console.log(err);

    statusCode = codes.serverError.INTERNAL_SERVER_ERROR;
    message = "couldn't handle the request, try again later";
    return responses.serve(res, statusCode, message);
  }

  if (deleted === 0) {
    statusCode = codes.clientError.BAD_REQUEST;
    message = "no post with credentials given found";
  } else {
    statusCode = codes.delete.NO_CONTENT;
    message = "post deleted successfully";
  }

  responses.serve(res, statusCode, message);
});

export const PostRouter = router;
