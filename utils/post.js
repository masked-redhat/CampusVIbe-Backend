import { isNumeric } from "./utils.js";

class PostParams {
  constructor(params, fileObj=null) {
    this.title = params?.title;
    this.content = params?.content;
    this.image = fileObj?.filename ?? null;
    this.offsetValue = parseInt(params?.offsetValue)
      ? isNumeric(params?.offsetValue)
      : 0;
    this.postId = params?.postId;
  }

  getPostData = () => {
    let postObj = {title: this.title, content: this.content, image: this.image, offsetVal: this.offsetValue, postId: this.postId}
    return postObj
  };
}

export default PostParams;