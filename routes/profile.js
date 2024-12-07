import { Router } from "express";
import authenticate from "../middleware/authentication.js";
import upload from "../middleware/parser.js";
import { getUserInfo, isBusinessRequest } from "../utils/profile.js";
import { getProfile } from "../database/profile.js";

const router = Router();

// middlewares for /profile and /profile/*
router.use(authenticate);

// Get user profile
router.get("/", async (req, res) => {
  const businessProfile = isBusinessRequest(req.query);

  let result = await getProfile(req.user.uid, businessProfile);

  res.status(result.sC).json({ profile: result.profile });
});

// Set user profile
router.post("/", async (req, res) => {
  let userInfo = getUserInfo(req.body);

  console.log(userInfo);

  res.sendStatus(200);
});

export const ProfileRouter = router;
