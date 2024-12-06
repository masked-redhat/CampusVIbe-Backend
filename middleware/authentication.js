import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.TOKENSECRETKEY;

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401); // No token present

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token

    req.user = user;
    req.jwt = token;
    next();
  });
};

export const tokenize = (usrObj) => {
  const token = jwt.sign(usrObj, SECRET_KEY, {
    expiresIn: "1w",
  });

  return token;
};

export default authenticate;
