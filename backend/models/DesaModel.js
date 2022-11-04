import { Sequelize } from "sequelize";
import dbwil from "../config/databasewil.js";
import Kecamatan from "./KecamatanModel.js";

const { DataTypes } = Sequelize;

const Desa = dbwil.define(
  "villages",
  {
    id: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    district_id: {
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

export default Desa;
