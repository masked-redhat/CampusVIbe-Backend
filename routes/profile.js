import { Router } from "express";
import authenticate from "../middleware/authentication.js";
import upload from "../middleware/parser.js";

const router = Router();

// middlewares for /profile and /profile/*
router.use(authenticate);



export const ProfileRouter = router;
