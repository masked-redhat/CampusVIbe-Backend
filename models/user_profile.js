import DATABASE from "../constants/db.js";
import sequelize from "../db/connection.js";
import { DataTypes as DT } from "sequelize";
import User from "./user.js";

sequelize.define("UserProfile", {
  id: DATABASE.id,
  userId: {
    type: DT.UUID,
    allowNull: false,
    references: { model: User, key: "id" },
  },
  firstName: DT.STRING,
  lastName: DT.STRING,
  age: DT.INTEGER,
  school: DT.TEXT,
});

const userProfile = sequelize.models.UserProfile;

export default userProfile;
