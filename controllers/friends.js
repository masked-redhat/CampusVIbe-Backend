import { chartTransaction } from "../database/connection.js";
import db from "../database/friends.js";

class Friend {
  #friends = false;
  #requestRecieved = false;
  #requestSent = false;

  constructor(userId, params = {}) {
    this.friend = params?.friendId;
    this.user = userId;
    this.type = params?.type;
  }

  checkDatabase = async () => {
    const friends = await db.checkForFriends(this.user, this.friend);
    const reqSent = await db.checkForRequests(this.user, this.friend);
    const reqRecieved = await db.checkForRequests(this.friend, this.user);

    if (friends) this.#friends = true;
    if (reqSent) this.#requestSent = true;
    if (reqRecieved) this.#requestRecieved = true;

    if (friends && (reqRecieved || reqSent)) await this.fixRedundancy();
  };

  fixRedundancy = async () => {
    return (
      (await db.deleteFriendRequest(this.user, this.friend)) ||
      (await db.deleteFriendRequest(this.friend, this.user))
    );
  };

  deleteRequest = this.fixRedundancy;

  friendsList = async () => {
    return await db.getFriends(this.user);
  };

  sendRequest = async () => {
    if (this.#friends || this.#requestRecieved) return false;

    return await db.sendFriendRequest(this.user, this.friend);
  };

  acceptRequest = async () => {
    if (this.#friends || !this.#requestRecieved || this.#requestSent)
      return false;

    return await chartTransaction(
      [db.makeFriends, db.deleteFriendRequest],
      [this.user, this.friend, this.friend, this.user]
    );
  };

  cancelRequest = async () => {
    if (!this.#requestSent && !this.#requestRecieved) return false;

    return await this.deleteRequest();
  };

  removeFriend = async () => {
    if (!this.#friends) return false;

    return await db.deleteFriend(this.user, this.friend);
  };

  getDetails = () => {
    console.log("User", this.user);
    console.log("Friend", this.friend);
    console.log("Are friends ", this.#friends);
    console.log("request sent ", this.#requestSent);
    console.log("request recieved ", this.#requestRecieved);
  };

  getRequests = async () => {
    if (this.type === "recieved")
      return await db.getRecievedRequests(this.user);
    else return await db.getSentRequests(this.user);
  };
}

export default Friend;
