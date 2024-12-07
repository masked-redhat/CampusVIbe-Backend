import express from "express";
import dotenv from "dotenv";
import connection from "./database/connection.js";
import { LoginRouter } from "./routes/Login.js";
import { PostRouter } from "./routes/posts.js";
import { FriendRouter } from "./routes/Friends.js";
import { CommentRouter } from "./routes/comments.js";
import { ProfileRouter } from "./routes/profile.js";
dotenv.config();

// Defining Application
const app = express();
const port = process.env.PORT;
const imageFolder = process.env.IMAGEUPLOADDEST;

// Checking Connection to Database
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to Database!");
});

// Global middlewares
app.use(express.static(imageFolder));
app.use(express.json());

// Routes
app.use("/login", LoginRouter);
app.use("/posts", PostRouter);
app.use("/friends", FriendRouter);
app.use("/comments", CommentRouter);
app.use("/profile", ProfileRouter);

// Starting application
app.listen(port, () => {
  console.log(`Application listening on http://localhost:${port}`);
});
