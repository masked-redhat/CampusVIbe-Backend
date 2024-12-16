import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { LoginRouter } from "./routes/login.js";
import sequelize from "./db/connection.js";
import syncTables from "./db/models.js";
import upload from "./middlewares/parser.js";
import { PostRouter } from "./routes/posts.js";
dotenv.config();

// Defining Application
const app = express();
const port = process.env.PORT;
const imageFolder = process.env.IMAGEUPLOADDEST;

// Checking Connection to Database
try {
  await sequelize.authenticate();
  await syncTables();
  console.log("Connected to database and synced tables");
} catch (err) {
  console.log("Not Connected!");
  console.log(err);
}

// Public folder that contains images
app.use(express.static(imageFolder));

// Global middlewares
app.use(express.json());
app.use(cookieParser());
// app.use(upload.none());

// Routes
app.use("/login", LoginRouter);
app.use("/posts", PostRouter);

// Starting application
app.listen(port, () => {
  console.log(`Application listening on http://localhost:${port}`);
});
