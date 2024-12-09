import Post from "../controllers/posts.js";
import codes from "../utils/status_codes.js";

const handleGetPosts = async (req) => {
  const post = new Post(req.user.uid, req.query);

  const posts = await post.getPosts();

  let statusCode = codes.get.OK,
    message = "posts for you as you requested";

  return { statusCode, message, posts };
};

const handleCreatePost = async (req) => {
  const post = new Post(req.user.uid, req.body, req.file);

  let postCreated = await post.createPost();

  let statusCode, message;

  if (postCreated) {
    statusCode = codes.post.CREATED;
    message = "post successfully created";
  } else {
    statusCode = codes.post.INTERNAL_SERVER_ERROR;
    message = "post did not get created, try again";
  }

  let postData = post.getPostData();

  return { statusCode, message, postData };
};

const handleDeletePost = async (req) => {
  const post = new Post(req.user.uid, req.query);

  let deleted = await post.deletePost();

  let statusCode, message;

  if (deleted) {
    statusCode = codes.delete.NO_CONTENT;
    message = "post deleted successfully";
  } else {
    statusCode = codes.serverError.INTERNAL_SERVER_ERROR;
    message = "please try again";
  }

  return { statusCode, message };
};

const handleLikePost = async (req) => {
  const post = new Post(req.user.uid, req.query);

  let liked = await post.like();

  let statusCode, message;

  if (liked) {
    statusCode = codes.patch.OK;
    message = "post liked";
  } else {
    statusCode = codes.serverError.INTERNAL_SERVER_ERROR;
    message = "post did not get liked, try again";
  }

  return { statusCode, message };
};

const handleUnLikePost = async (req) => {
  const post = new Post(req.user.uid, req.query);

  let liked = await post.unlike();

  let statusCode, message;

  if (liked) {
    statusCode = codes.patch.OK;
    message = "post unliked";
  } else {
    statusCode = codes.serverError.INTERNAL_SERVER_ERROR;
    message = "post did not get un-liked, try again";
  }

  return { statusCode, message };
};

const handlers = {
  handleGetPosts,
  handleCreatePost,
  handleDeletePost,
  handleLikePost,
  handleUnLikePost,
};

export default handlers;
