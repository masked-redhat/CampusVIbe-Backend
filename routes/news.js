import { Router } from "express";
import codes from "../utils/status_codes.js";
import News from "../controllers/news.js";
import authenticate from "../middleware/authentication.js";
import upload from "../middleware/parser.js";

const router = Router();

// middlewares for /news
router.use(authenticate);
router.use(upload.single("image"));

// get the news
router.get("/", async (req, res) => {
  const newsReq = new News(req.user.uid, req.query);

  const news = await newsReq.getNews();

  let statusCode = codes.get.OK,
    message = "got news for you";

  res.status(statusCode).json({ message, news });
});

// post the news
router.post("/", async (req, res) => {
  const newsReq = new News(req.user.uid, req.body, req.file);
  await newsReq.isAdmin();

  const published = await newsReq.publishNews();

  const news = await newsReq.getNews();

  let statusCode, message;

  if (!published) {
    statusCode = codes.serverError.INTERNAL_SERVER_ERROR;
    message = "couldn't post news";
  } else {
    statusCode = codes.post.CREATED;
    message = "news published";
  }

  res.status(statusCode).json({ message, news });
});

// delete the news
router.delete("/", async (req, res) => {
  const newsReq = new News(req.user.uid, req.body, req.file);

  let deleted = await newsReq.deleteNews();

  let statusCode, message;

  if (!deleted) {
    statusCode = codes.serverError.INTERNAL_SERVER_ERROR;
    message = "could not delete";
  } else {
    statusCode = codes.delete.NO_CONTENT;
    message = "deleted";
  }

  res.status(statusCode).json({ message });
});

// patch a news
router.patch("/", async (req, res) => {
  const newsReq = new News(req.user.uid, req.body, req.file);
  await newsReq.isAdmin();

  let updated = await newsReq.updateNews();

  let statusCode, message;

  if (!updated) {
    statusCode = codes.serverError.INTERNAL_SERVER_ERROR;
    message = "could not update, try again";
  } else {
    statusCode = codes.patch.OK;
    message = "done";
  }

  res.status(statusCode).json({ message });
});

router.all("/", async (_, res) => {
  res.sendStatus(codes.clientError.METHOD_NOT_ALLOWED);
});

export const NewsRouter = router;
