import { Router } from "express";
import authenticate from "../middleware/authentication.js";
import {
  acceptFriendRequest,
  deleteFriend,
  friendRequest,
  getFriends,
} from "../database/friends.js";
import { getFriendID } from "../utils/friend.js";

const router = Router();

// middleware for /friends and /friends/*
router.use(authenticate);

// Gets all the friends of the user
router.get("/", async (req, res) => {
  let result = await getFriends(req.user.uid);

  res.status(result.sC).json(result.friends);
});

// Sending a friend request
router.get("/request", async (req, res) => {
  const friendID = getFriendID(req.query);

  if (friendID) {
    let response = await friendRequest(req.user.id, friendID);
    res.sendStatus(response);
  } else res.sendStatus(400);
});

// Accepting a friend request
router.post("/request", async (req, res) => {
  const friendID = getFriendID(req.query);

  if (friendID) {
    let response = await acceptFriendRequest(req.user.id, friendID);
    res.sendStatus(response);
  } else res.sendStatus(400);
});

// Unfriending
router.delete("/", async (req, res) => {
  const friendID = getFriendID(req.query);

  let sC = await deleteFriend(req.user.uid, friendID);
  res.sendStatus(sC);
});

router.all("/", (req, res) => {
  res.sendStatus(405);
});

router.all("/request", (req, res) => {
  res.sendStatus(405);
});

export const FriendRouter = router;
