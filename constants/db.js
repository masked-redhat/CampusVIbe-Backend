import { DataTypes as DT } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const HOST = process.env.MYSQLHOST;
const USER = process.env.MYSQLUSER;
const PASSWORD = process.env.MYSQLPASSWORD;
const DB = process.env.MYSQLDATABASE;
const DIALECT = "mysql";

const id = {
  type: DT.UUID,
  // autoIncrement: true,
  allowNull: false,
  primaryKey: true,
  defaultValue: DT.UUIDV4,
};

const getIdOf = (model, type = DT.UUID, allowNull, args) => {
  return {
    type: type,
    allowNull: allowNull,
    ...args,
    references: { model: model, key: "id" },
  };
};

const DATABASE = {
  HOST,
  USER,
  PASSWORD,
  DB,
  DIALECT,
  id,
  getIdOf
};

export default DATABASE;
