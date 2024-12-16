import { Sequelize } from "sequelize";
import DATABASE from "../constants/db.js";

const sequelize = new Sequelize(DATABASE.DB, DATABASE.USER, DATABASE.PASSWORD, {
  host: DATABASE.HOST,
  dialect: DATABASE.DIALECT,
});

export default sequelize;
