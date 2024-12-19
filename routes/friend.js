import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {

    res.send("home home")
});

export const FriendRouter = router;
