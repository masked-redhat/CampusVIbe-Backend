import { Router } from "express";
import authenticate from "../middleware/authentication.js";
import codes from "../utils/status_codes.js";
import upload from "../middleware/parser.js";
import handlers from "../handlers/friends.js";

const router = Router();

// middleware for /friends and /friends/*
router.use(authenticate);
router.use(upload.none());

// Get friends
router.get("/", async (req, res) => {
  const { statusCode, message, friends } = await handlers.handleGetFriends(req);

  res.status(statusCode).json({ message, friends });
});

// Get requests
router.get("/request", async (req, res) => {
  const { statusCode, message, requests } = await handlers.handleGetRequests(
    req
  );

  res.status(statusCode).json({ message, requests });
});

// Send friend request
router.post("/request", async (req, res) => {
  const { statusCode, message } = await handlers.handleSendRequest(req);

  res.status(statusCode).json({ message });
});

// Accept friend request
router.put("/request", async (req, res) => {
  const { statusCode, message } = await handlers.handleAcceptRequest(req);

  res.status(statusCode).json({ message });
});

// Cancel Request
router.delete("/request", async (req, res) => {
  const { statusCode, message } = await handlers.handleCancelRequest(req);

  res.status(statusCode).json({ message });
});

// Unfriending
router.delete("/", async (req, res) => {
  const { statusCode, message } = await handlers.handleUnfriend(req);

  res.status(statusCode).json({ message });
});

router.all("/", (_, res) => {
  res.sendStatus(codes.clientError.METHOD_NOT_ALLOWED);
});

router.all("/request", (_, res) => {
  res.sendStatus(codes.clientError.METHOD_NOT_ALLOWED);
});

export const FriendRouter = router;
