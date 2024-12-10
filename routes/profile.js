import { Router } from "express";
import authenticate from "../middleware/authentication.js";
import upload from "../middleware/parser.js";
import codes from "../utils/status_codes.js";
import User from "../controllers/profile.js";

const router = Router();

// middlewares for /profile and /profile/*
router.use(authenticate);
router.use(upload.single("pfp"));

// Get user profile
router.get("/", async (req, res) => {
  const user = new User(req.user.uid);
  await user.getUser();

  const profile = user.getProfile();

  let statusCode, message;

  if (!profile.success) {
    statusCode = codes.serverError.INTERNAL_SERVER_ERROR;
    message = "profile could not be processed";
  } else {
    statusCode = codes.get.OK;
    message = "here's your profile";
  }

  res.status(statusCode).json({ message, profile: profile.profile });
});

// Set user profile if not done with get request
router.post("/", async (req, res) => {
  const user = new User(req.user.uid, req.body, req.file);
  await user.getUser();

  const profile = user.getProfile();

  let statusCode, message;
  if (!profile.success) {
    statusCode = codes.serverError.INTERNAL_SERVER_ERROR;
    message = "profile could not be created right now";
  } else {
    statusCode = codes.post.CREATED;
    message = "profile already created";
  }

  res.status(statusCode).json({ message, profile: profile.profile });
});

// update user profile full
router.put("/", async (req, res) => {
  const user = new User(req.user.uid, req.body, req.file);

  const updated = await user.updateProfile();

  await user.getUser();

  const profile = user.getProfile();

  let statusCode, message;

  if (!updated) {
    statusCode = codes.serverError.INTERNAL_SERVER_ERROR;
    message = "profile not updated, try again";
  } else {
    statusCode = codes.put.OK;
    message = "profile updated";
  }

  res.status(statusCode).json({ message, profile: profile.profile });
});

// update user profile patch
router.patch("/", async (req, res) => {
  const user = new User(req.user.uid, req.body, req.file);

  const updated = await user.updateProfile();

  await user.getUser();

  const profile = user.getProfile();

  let statusCode, message;

  if (!updated) {
    statusCode = codes.serverError.INTERNAL_SERVER_ERROR;
    message = "profile not updated, try again";
  } else {
    statusCode = codes.put.OK;
    message = "profile updated";
  }

  res.status(statusCode).json({ message, profile: profile.profile });
});

// TODO : Business Profile

// // get business profile if available
// router.get("/business", async (req, res) => {
//   const user = new User(req.user.uid, req.query);
//   await user.getUser();

//   user.getDetails();

//   res.json({ profile: user.getProfile() });
// });

// // setup business profile
// router.post("/business", async (req, res) => {});

// // update business profile full
// router.put("/business", async (req, res) => {});

// // update business profile patch
// router.patch("/business", async (req, res) => {});

router.all("/", (_, res) => {
  res.sendStatus(codes.clientError.METHOD_NOT_ALLOWED);
});

router.all("/business", (_, res) => {
  res.sendStatus(codes.clientError.METHOD_NOT_ALLOWED);
});

export const ProfileRouter = router;
