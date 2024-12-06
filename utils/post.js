import { isNumeric } from "./utils.js";

export const getTitle = (post) => {
  if (post.title) return post.title;
  return null;
};

export const getContent = (post) => {
  if (post.content) return post.content;
  return null;
};

export const getImage = (fileObj) => {
  if (fileObj != undefined) return fileObj.filename;
  return null;
};

export const getPostData = (post, fileObj) => {
  let postObj = {};

  postObj.title = getTitle(post);
  postObj.content = getContent(post);
  postObj.image = getImage(fileObj);

  return postObj;
};

export const getOffsetValue = (params) => {
  if (isNumeric(params.offsetValue)) return parseInt(params.offsetValue);
  return 0;
};

export const getPostID = (params) => {
  if (params.postID) return params.postID;
  else return null;
};
