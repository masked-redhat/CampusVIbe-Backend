import { Router } from "express";
import authentication from "../middlewares/authentication.js";

const router = Router();

router.use(authentication.validateAuth);

router.get("/", (req, res) => {
  res.send("holey");
});

export const PostRouter = router;
