import db from "../database/profile.js";
import { capitalize } from "../utils/utils.js";

class User {
  #username;
  #blacklist = false;
  #businessProfile = false;
  #profileId;
  #currUserProfile;
  #isCurrProfile;

  constructor(userId, params = null) {
    this.id = userId;
    this.firstName = params?.firstName ?? null;
    this.lastName = params?.lastName ?? null;
    this.pfp = params?.pfp ?? null;
  }

  getUser = async () => {
    let user = await db.getUserByUserId(this.id);

    this.#username = user?.username ?? null;
    this.#blacklist = user?.blacklist ?? null;
    this.#businessProfile = user?.business ?? null;

    const profile = await this.getUserProfile();
    this.#isCurrProfile = profile.success;
    this.#currUserProfile = profile.profile;
  };

  getUserProfile = async () => {
    let profile = await db.getUserProfileByUserId(this.id),
      success = false;

    if (profile === null) {
      profile = (await this.createProfile()).profile;
    }

    success = profile !== null;
    this.#profileId = this.#profileId ?? profile?.id ?? null;
    profile.username = this.getUsername();

    delete profile.id;
    delete profile.user_id;

    return { success, profile };
  };

  createProfile = async () => {
    return await db.createUserProfile(this.id, capitalize(this.#username));
  };

  userProfile = async () => {
    return this.#currUserProfile;
  };

  getDetails = () => {
    let detailKeys = Object.keys(this);
    console.log("\nUser Details:");
    detailKeys.forEach((key) => {
      if (typeof this[key] !== "function") console.log(`${key}:`, this[key]);
    });
    console.log("username:", this.getUsername());
  };

  getUsername = () => {
    return this.#username;
  };

  getProfile = () => {
    return { success: this.#isCurrProfile, profile: this.#currUserProfile };
  };
}

export default User;
