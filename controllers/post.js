import userDb from "../db/user.js";
import Post from "../models/post.js";
import checks from "../utils/checks.js";
import codes from "../utils/codes.js";
import responses from "../utils/response.js";
import { REQ_TYPE } from "../utils/request.js";

const SERVER_ERROR_CODE = codes.serverError.INTERNAL_SERVER_ERROR;
const SERVER_ERROR_MESSAGE =
  "Server couldn't handle the request, try again later";

const POST_UPDATION_CODE = codes.patch.OK;
const POST_UPDATION_MESSAGE = "Post updated";

const POST_CREATION_CODE = codes.post.CREATED;
const POST_CREATION_MESSAGE = "Post created successfully";

const POST_DELETION_CODE = codes.delete.NO_CONTENT;
const POST_DELETION_MESSAGE = "Post deleted successfully";

const BAD_REQUEST_CODE = codes.clientError.BAD_REQUEST;
const TITLE_NOT_GIVEN_MESSAGE = "No title given";
const POST_ID_NOT_GIVEN_MESSAGE = "No post Id given";

const NOT_FOUND_CODE = codes.clientError.NOT_FOUND;
const POST_NOT_FOUND_MESSAGE = "No post with the credentials given";

const SUCCESS_CODE = codes.OK;
const POSTS_FOUND_MESSAGE = "Got posts for you";

class PostHandler {
  #postId;
  #userId;
  #limit = 10;

  constructor(user, reqBody = null, reqFile = null) {
    this.username = user?.username ?? null;
    this.title = reqBody?.title ?? null;
    this.content = reqBody?.content ?? null;
    this.image = reqFile?.filename ?? null;
    this.offsetAmt = reqBody?.offset ?? 0;
    this.#postId = reqBody?.id ?? null;
  }

  setup = async (res) => {
    const { statusCode, message, userId } = await userDb.getUserIdFromUsername(
      this.username
    );

    if (checks.isNull(userId)) return responses.serve(res, statusCode, message);
    else this.#userId = userId;

    return null;
  };

  // Only for GET requests
  getPosts = async (res) => {
    let posts = [];
    try {
      posts = await Post.findAll({
        where: { userId: this.#userId },
        offset: this.offsetAmt,
        limit: this.#limit,
      });
    } catch (err) {
      console.log(err);

      return responses.serve(res, SERVER_ERROR_CODE, SERVER_ERROR_MESSAGE);
    }

    posts = posts.map((p) => {
      let x = p.dataValues;
      delete x.userId;
      return x;
    });

    return responses.serve(res, SUCCESS_CODE, POSTS_FOUND_MESSAGE, { posts });
  };

  // Create post POST requests
  createPost = async (res) => {
    if (checks.isNull(this.title))
      return responses.serve(res, BAD_REQUEST_CODE, TITLE_NOT_GIVEN_MESSAGE);

    let post = null;
    try {
      post = await Post.create({
        userId: this.#userId,
        title: this.title,
        content: this.content,
        image: this.image,
      });
    } catch (err) {
      console.log(err);

      return responses.serve(res, SERVER_ERROR_CODE, SERVER_ERROR_MESSAGE);
    }

    return responses.serve(res, POST_CREATION_CODE, POST_CREATION_MESSAGE, {
      postId: post.id,
    });
  };

  // updating as per PATCH or PUT requests
  updatePost = async (res, type = REQ_TYPE.PUT) => {
    if (checks.isNull(this.title))
      return responses.serve(res, BAD_REQUEST_CODE, TITLE_NOT_GIVEN_MESSAGE);
    if (checks.isNull(this.#postId))
      return responses.serve(res, NOT_FOUND_CODE, POST_ID_NOT_GIVEN_MESSAGE);

    let updatingData = {
      title: this.title,
      content: this.content,
      image: this.image,
    };

    if (type === REQ_TYPE.PATCH)
      for (const uData in updatingData)
        if (checks.isNull(updatingData[uData])) delete updatingData[uData];

    let post;
  try {
    post = await Post.update(toBeUpdated, {
      where: {
        id: this.#postId,
        userId: this.#userId,
      },
    });
  } catch (err) {
    console.log(err);

    return responses.serve(res, SERVER_ERROR_CODE, SERVER_ERROR_MESSAGE);
  }

  // if update occured, send the OK and if not NOT_FOUND
  if (post[0] === 0) {
    statusCode = codes.patch.NOT_FOUND;
    message = "No post with the credentials given found";
    return responses.serve(res, NOT_FOUND_CODE, message);
  } else {
    statusCode = codes.patch.OK;
    message = "Post updated";
    return responses.serve(res, SERVER_ERROR_CODE, SERVER_ERROR_MESSAGE);
  }

  responses.serve(res, statusCode, message);
  };
}

export default PostHandler;
