import { Router } from "express";
import authenticate from "../middleware/authentication.js";
import Friend from "../controllers/friends.js";
import codes from "../utils/status_codes.js";
import upload from "../middleware/parser.js";

const router = Router();

// middleware for /friends and /friends/*
router.use(authenticate);
router.use(upload.none());

// Get friends
router.get("/", async (req, res) => {
  const friend = new Friend(req.user.uid);

  let friends = await friend.friendsList();

  let statusCode = codes.get.OK;
  let message = "got friends for you";

  res.status(statusCode).json({ message, friends });
});

// Get requests
router.get("/request", async (req, res) => {
  const friend = new Friend(req.user.uid, req.query);

  let requests = await friend.getRequests();

  let statusCode = codes.get.OK;
  let message = "got requests for you";

  res.status(statusCode).json({ message, requests });
});

// Send friend request
router.post("/request", async (req, res) => {
  const friend = new Friend(req.user.uid, req.body);
  await friend.checkDatabase();

  let requestSent = await friend.sendRequest();

  let statusCode, message;

  if (requestSent) {
    statusCode = codes.post.CREATED;
    message = "request sent to the user";
  } else {
    statusCode = codes.clientError.BAD_REQUEST;
    message = "try again later";
  }

  res.status(statusCode).json({ message });
});

// Accept friend request
router.put("/request", async (req, res) => {
  const friend = new Friend(req.user.uid, req.body);
  await friend.checkDatabase();

  let requestAccepted = await friend.acceptRequest();

  let statusCode, message;

  if (requestAccepted) {
    statusCode = codes.put.OK;
    message = "request accepted";
  } else {
    statusCode = codes.clientError.BAD_REQUEST;
    message = "try again";
  }

  res.status(statusCode).json({ message });
});

// Cancel Request
router.delete("/request", async (req, res) => {
  const friend = new Friend(req.user.uid, req.query);
  await friend.checkDatabase();

  let requestCancel = await friend.cancelRequest();

  let statusCode, message;

  if (requestCancel) {
    statusCode = codes.delete.NO_CONTENT;
    message = "request cancelled";
  } else {
    statusCode = codes.clientError.BAD_REQUEST;
    message = "try again";
  }

  res.status(statusCode).json({ message });
});

// Unfriending
router.delete("/", async (req, res) => {
  const friend = new Friend(req.user.uid, req.query);
  await friend.checkDatabase();

  let removeFriend = await friend.removeFriend();

  let statusCode, message;

  if (removeFriend) {
    statusCode = codes.delete.NO_CONTENT;
    message = "request cancelled";
  } else {
    statusCode = codes.clientError.BAD_REQUEST;
    message = "try again";
  }

  res.status(statusCode).json({ message });
});

router.all("/", (req, res) => {
  res.sendStatus(405);
});

router.all("/request", (req, res) => {
  res.sendStatus(405);
});

export const FriendRouter = router;
