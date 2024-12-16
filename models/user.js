import DATABASE from "../constants/db.js";
import sequelize from "../db/connection.js";
import { DataTypes as DT } from "sequelize";

sequelize.define("User", {
  id: DATABASE.id,
  username: {
    type: DT.INTEGER,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DT.STRING,
    allowNull: false,
  },
  blacklist: {
    type: DT.BOOLEAN,
    defaultValue: false,
  },
  businessProfile: {
    type: DT.BOOLEAN,
    defaultValue: false,
  },
});

const User = sequelize.models.User;

export default User;
