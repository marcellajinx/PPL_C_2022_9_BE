import { Sequelize } from "sequelize";
import dbwil from "../config/databasewil.js";

const { DataTypes } = Sequelize;

const Kecamatan = dbwil.define(
  "districts",
  {
    id: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    regency_id: {
      type: DataTypes.CHAR,
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

export default Kecamatan;
