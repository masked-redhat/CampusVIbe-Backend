import mysql from "mysql2";
import dotenv from "dotenv";
import { runMultipleFunctionsAsync } from "../utils/utils.js";
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

export const chartTransaction = async (transactions = [], values = []) => {
  try {
    await connection.promise().beginTransaction();

    let res = await runMultipleFunctionsAsync(transactions, values);

    if (res instanceof Error) throw res;

    await connection.promise().commit();
    return true;
  } catch (err) {
    await connection.promise().rollback();

    console.log(err);
  }

  return false;
};

export default connection;
