import { Router } from "express";
import authenticate from "../middleware/authentication.js";
import codes from "../utils/status_codes.js";
import User from "../controllers/profile.js";

const router = Router();

// middlewares for /profile and /profile/*
router.use(authenticate);

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

// Set user profile
router.post("/", async (req, res) => {
  const profile = new User(req.user.uid, req.body);
});

// update user profile full
router.put("/", async (req, res) => {});

// update user profile patch
router.patch("/", async (req, res) => {});

// get business profile if available
router.get("/business", async (req, res) => {});

// setup business profile
router.post("/business", async (req, res) => {});

// update business profile full
router.put("/business", async (req, res) => {});

// update business profile patch
router.patch("/business", async (req, res) => {});

router.all("/", (_, res) => {
  res.sendStatus(codes.clientError.METHOD_NOT_ALLOWED);
});

router.all("/business", (_, res) => {
  res.sendStatus(codes.clientError.METHOD_NOT_ALLOWED);
});

export const ProfileRouter = router;
