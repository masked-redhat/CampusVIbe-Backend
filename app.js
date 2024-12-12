import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { LoginRouter } from "./routes/login.js";
dotenv.config();

// Defining Application
const app = express();
const port = process.env.PORT;
const imageFolder = process.env.IMAGEUPLOADDEST;

// Checking Connection to Database
// connection.connect((err) => {
//   if (err) throw err;
//   console.log("Connected to Database!");
// });

// Public folder that contains images
app.use(express.static(imageFolder));

// Global middlewares
app.use(express.json());
app.use(cookieParser())

// Routes
app.use("/login", LoginRouter)

// Starting application
app.listen(port, () => {
  console.log(`Application listening on http://localhost:${port}`);
});
