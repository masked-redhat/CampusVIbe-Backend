import { Router } from "express";
import { tokenize } from "../middleware/authentication.js";
import { getUser, insertUser } from "../database/Users.js";
import upload from "../middleware/parser.js";

const router = Router();

// middleware for /login and /login/*
router.use(upload.none());

// Logging to an existing account
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const result = await getUser(username, password);

  if (result.user === null || result.user.blacklist) {
    // User does not exist or is blacklisted
    res.sendStatus(result.sC);
    return;
  }

  const usrObj = { uid: result.user.id, username: username };
  const token = tokenize(usrObj);

  res.status(200).json({ jwt: token });
});

// Creating a new account
router.post("/new", async (req, res) => {
  const { username, password } = req.body;
  const result = await insertUser(username, password);

  if (result.uid === null) {
    // No user created
    res.sendStatus(result.sC);
    return;
  }

  const usrObj = { uid: result.uid, username: username };
  const token = tokenize(usrObj);

  res.status(result.sC).json({ jwt: token });
});

router.all("/", (req, res) => {
  res.sendStatus(405); // Other methods not allowed on these uri
});

router.all("/new", (req, res) => {
  res.sendStatus(405);
});

export const LoginRouter = router;
