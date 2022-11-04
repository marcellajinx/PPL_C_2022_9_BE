import { Sequelize } from "sequelize";
import dbwil from "../config/databasewil.js";
import Provinsi from "./ProvinsiModel.js";

const { DataTypes } = Sequelize;

const Kota = dbwil.define(
  "regencies",
  {
    id: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    province_id: {
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

Provinsi.hasMany(Kota, { foreignKey: "province_id", sourceKey: "id" });
Kota.belongsTo(Provinsi, { foreignKey: "province_id" });

(async () => {
  await dbwil.sync();
})();

export default Kota;
