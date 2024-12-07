import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const db = "campusvibe";

const connection = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: db,
});

connection.connect();

export const getResponseDb = async (query, values = null) => {
  let request;

  // execute for prepared sql statements
  if (values === null) request = await connection.promise().execute(query);
  else request = await connection.promise().execute(query, values);

  return request;
};

export default connection;
