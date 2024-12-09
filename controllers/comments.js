import db from "../database/comments.js";
import { chartTransaction } from "../database/connection.js";

const acceptedVoteValues = ["0", "1", "-1"];

class Comment {
  #voted = false;
  #valid = false;
  #commented = false;

  constructor(userId, params = null) {
    this.userId = userId ?? null;
    this.type = params?.type ?? null;
    this.entityId = params?.entityId ?? null;
    this.offset = params?.offset ?? "0";
    this.comment = params?.comment ?? null;
    this.id = params?.commentId ?? params?.id ?? null;
    this.voteVal = params?.voteVal ?? null;
  }

  getComment = async () => {
    this.#valid = await db.isAComment(this.type, this.entityId, this.id);
    this.#voted = await db.haveUserVoted(this.userId, this.id);
    this.#commented = await db.haveUserCommented(this.userId, this.id);
  };

  getComments = async () => {
    return await db.getComments(this.type, this.entityId, this.offset);
  };

  writeComment = async () => {
    return await db.writeComment(
      this.userId,
      this.type,
      this.entityId,
      this.comment
    );
  };

  deleteComment = async () => {
    if (!this.#commented) return false;

    return await db.deleteComment(this.id);
  };

  vote = async () => {
    if (!acceptedVoteValues.includes(this.voteVal)) return false;

    const updating = this.#voted;

    return await chartTransaction(
      [db.vote, db.updateCommentVotes],
      [
        this.userId,
        this.id,
        this.voteVal,
        updating.success,
        updating.voteVal,
        this.voteVal,
        this.id,
        updating.success,
      ]
    );
  };

  getReplies = async () => {
    return await db.getReplies(this.id, this.offset);
  };

  writeReply = async () => {
    if (!this.#valid) return false;

    return await db.writeReply(
      this.userId,
      this.type,
      this.entityId,
      this.id,
      this.comment
    );
  };

  getCommentDetails = () => {
    console.log("User ID:", this.userId);
    console.log("Type:", this.type);
    console.log("Entity ID:", this.entityId);
    console.log("Offset:", this.offset);
    console.log("Comment:", this.comment);
    console.log("ID:", this.id);
    console.log("Vote Value:", this.voteVal);
    console.log("Voted:", this.#voted);
    console.log("Valid:", this.#valid);
    console.log("Commented:", this.#commented);
  };
}

export default Comment;
