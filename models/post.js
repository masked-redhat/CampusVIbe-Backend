import DATABASE from "../constants/db.js";
import sequelize from "../db/connection.js";
import { DataTypes as DT } from "sequelize";
import User from "./user.js";

sequelize.define("Post", {
  id: DATABASE.id,
  userId: DATABASE.getIdOf(User),
  title: {
    type: DT.TEXT,
    allowNull: false,
  },
  content: DT.TEXT,
  image: DT.STRING,
});

const Post = sequelize.models.Post;

export default Post;
