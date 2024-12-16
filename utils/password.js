import bcryptjs from "bcryptjs";
import SALT_ROUNDS from "../constants/hash_pass.js";
import checks from "./checks.js";
import codes from "./codes.js";

class HashPassword {
  #saltRounds = SALT_ROUNDS;
  #hashed;

  constructor(pass) {
    this.pass = pass ?? null;
    this.#hashed = this.hash();
  }

  hash = (password = this.pass) => {
    if (!checks.isNotNuldefined(password)) return null;

    let hashed = bcryptjs.hashSync(password, this.#saltRounds);
    return hashed;
  };

  getHashed = () => {
    return this.#hashed;
  };
}

class PasswordComparison {
  #match;

  constructor(orgPass, hashPass) {
    this.original = orgPass ?? null;
    this.hashed = hashPass ?? null;
    this.#match = this.compare();
  }

  compare = (original = this.original, hashed = this.hashed) => {
    if (!checks.isNotNuldefined(original) || !checks.isNotNuldefined(hashed))
      return false;

    const match = bcryptjs.compareSync(original, hashed);
    return match;
  };

  isMatch = () => {
    return this.#match;
  };
}

const PSWRD = {
  HashPassword,
  PasswordComparison,
};

export default PSWRD;
