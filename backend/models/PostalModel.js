import { Sequelize } from "sequelize";
import db2 from "../config/database2.js";

const { DataTypes } = Sequelize;

const Postal = db2.define(
  "tbl_kodepos",
  {
    id: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    kelurahan: {
      type: DataTypes.CHAR,
    },
    kecamatan: {
      type: DataTypes.CHAR,
    },
    kabupaten: {
      type: DataTypes.CHAR,
    },
    provinsi: {
      type: DataTypes.CHAR,
    },
    kodepos: {
      type: DataTypes.CHAR,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

(async () => {
  await db2.sync();
})();

export default Postal;
