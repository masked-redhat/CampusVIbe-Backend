import { isNumeric } from "./utils.js";

export const getTitle = (post) => {
  return post?.title
};

export const getContent = (post) => {
  return post?.content
};

export const getImage = (fileObj) => {
  return fileObj?.filename
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
  return params?.postID
};
