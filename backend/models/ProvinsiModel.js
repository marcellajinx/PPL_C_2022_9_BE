import { Sequelize } from "sequelize";
import dbwil from "../config/databasewil.js";

const { DataTypes } = Sequelize;

const Provinsi = dbwil.define(
  "provinces",
  {
    id: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    name: {
      type: DataTypes.CHAR,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

(async () => {
  await dbwil.sync();
})();

export default Provinsi;
