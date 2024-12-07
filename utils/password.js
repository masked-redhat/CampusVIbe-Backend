import bcryptjs from "bcryptjs";

const saltRounds = 10;

const hashPassword = (password) => {
  const hashedPass = bcryptjs.hashSync(password, saltRounds);

  return hashedPass;
};

const comparePassword = (password, hashedPassword) => {
  const isMatch = bcryptjs.compareSync(password, hashedPassword);

  return isMatch;
};

const secure = {
  hashPassword,
  comparePassword,
};

export default secure;
