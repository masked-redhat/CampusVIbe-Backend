import User from "../models/user.js";
import userProfile from "../models/user_profile.js";
import sequelize from "./connection.js";

const syncTables = async () => {
  await sequelize.sync();
    // await sequelize.sync({ force: true });
};

export default syncTables;
