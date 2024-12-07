export const getCommentType = (params) => {
  return params?.type;
};

export const getCommentId = (params) => {
  return params?.id;
};

export const getCommentContent = (params) => {
  return params?.content;
};

export const getCommentOffset = (params) => {
  return parseInt(params?.offset ?? 0);
};

export const getCommentData = (params) => {
  const commentObj = {};

  commentObj.type = getCommentType(params);
  commentObj.id = getCommentId(params);
  commentObj.comment = getCommentContent(params);
  commentObj.offset = getCommentOffset(params);

  return commentObj;
};

export const getVoteValue = (params) => {
  return parseInt(params?.val);
};

export const getEntityId = (params) => {
  return params?.entityId;
};
