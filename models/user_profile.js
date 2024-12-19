import DATABASE from "../constants/db.js";
import sequelize from "../db/connection.js";
import { DataTypes as DT } from "sequelize";
import User from "./user.js";

sequelize.define("UserProfile", {
  id: DATABASE.id,
  userId: { ...DATABASE.getIdOf(User), unique: true },
  firstName: DT.STRING,
  lastName: DT.STRING,
  age: DT.INTEGER,
  school: DT.TEXT,
});

const userProfile = sequelize.models.UserProfile;

export default userProfile;
