import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config()

const db = "campusvibe";

const connection = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: db
});

connection.connect();

export default connection;
