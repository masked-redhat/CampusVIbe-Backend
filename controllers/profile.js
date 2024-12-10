import db from "../database/profile.js";

class User {
  #username;
  #blacklist = false;
  #businessProfile = false;
  #profileId;
  #currUserProfile;
  #isCurrProfile;

  constructor(userId, params = null, file = null) {
    this.id = userId;
    this.firstName = params?.firstName ?? null;
    this.lastName = params?.lastName ?? null;
    this.pfp = file?.filename ?? db.DEFAULTPFP;
  }

  getUser = async (business=false) => {
    let user = await db.getUserByUserId(this.id);

    this.#username = user?.username ?? null;
    this.#blacklist = user?.blacklist ?? null;
    this.#businessProfile = user?.business ?? null;

    const profile = await this.getUserProfile(business);
    this.#isCurrProfile = profile.success;
    this.#currUserProfile = profile.profile;
  };

  getUserProfile = async (business=false) => {
    let profile = await db.getUserProfileByUserId(this.id, business),
      success = false;

    if (profile === null) {
      profile = (await this.createProfile()).profile;
    }

    success = profile !== null;
    this.#profileId = this.#profileId ?? profile?.id ?? null;
    profile.username = this.getUsername();

    delete profile.id;

    return { success, profile };
  };

  createProfile = async (business = false) => {
    if (!business)
    return await db.createUserProfile(
      this.id,
      this.firstName ?? this.#username ?? null,
      this.lastName,
      this.pfp
    );
    else return await db.createBusinessProfile
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

  updateProfile = async () => {
    return await db.updateUserProfile(
      this.id,
      this.firstName,
      this.lastName,
      this.pfp
    );
  };
}

export default User;
