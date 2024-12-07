import { Router } from "express";
import upload from "../middleware/parser.js";
import handlers from "../handlers/login.js";
import codes from "../utils/status_codes.js";

const router = Router();

// middleware for /login and /login/*
router.use(upload.none());

// Logging to an existing account
router.post("/", async (req, res) => {
  const { statusCode, message, token } = await handlers.handleLoginRequest(req);

  res.status(statusCode).json({ message, token });
});

// Creating a new account
router.post("/new", async (req, res) => {
  const { statusCode, message, token } = await handlers.handleSignupRequest(
    req
  );

  res.status(statusCode).json({ message, token });
});

router.all("/", (_, res) => {
  res.sendStatus(codes.clientError.METHOD_NOT_ALLOWED);
});

router.all("/new", (_, res) => {
  res.sendStatus(codes.clientError.METHOD_NOT_ALLOWED);
});

export const LoginRouter = router;
