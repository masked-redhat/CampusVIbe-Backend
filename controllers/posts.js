import { chartTransaction } from "../database/connection.js";
import db from "../database/posts.js";
import { isNumeric } from "../utils/utils.js";

const feed = {
  PERSONAL: "personal",
  ALL: "all",
};

class Post {
  constructor(userId, params, fileObj = null) {
    this.user = userId;
    this.title = params?.title ?? null;
    this.content = params?.content ?? null;
    this.image = fileObj?.filename ?? null;
    this.offset = parseInt(params?.offset)
      ? isNumeric(params?.offset)
      : 0;
    this.postId = params?.postId ?? null;
    this.type = params?.type ?? feed.PERSONAL;
  }

  getPosts = async () => {
    return await db.getPosts(
      this.user,
      this.offset,
      this.type === feed.PERSONAL
    );
  };

  createPost = async () => {
    let res = await db.insertPost(
      this.user,
      this.title,
      this.content,
      this.image
    );

    this.postId = res.postId;

    return res.success;
  };

  deletePost = async () => {
    if (!this.isValidPostId()) return false;

    return await db.deletePost(this.user, this.postId);
  };

  like = async () => {
    if (!this.isValidPostId()) return false;

    return chartTransaction(
      [db.like, db.increaseLikeCount],
      [this.user, this.postId, this.postId]
    );
  };

  unlike = async () => {
    if (!this.isValidPostId()) return false;

    return chartTransaction(
      [db.unlike, db.decreaseLikeCount],
      [this.user, this.postId, this.postId]
    );
  };

  getPostData = () => {
    let postObj = {
      title: this.title,
      content: this.content,
      image: this.image,
      offset: this.offset,
      postId: this.postId,
    };
    return postObj;
  };

  isValidPostId = () => {
    return this.postId !== null;
  };
}

export default Post;
