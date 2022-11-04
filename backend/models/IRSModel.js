import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Mahasiswa from "./MahasiswaModel.js";

import User from "./UserModel.js";

const { DataTypes } = Sequelize;

const IRS = db.define(
  "tb_irs",
  {
    smt_irs: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    nim: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    status_irs: {
      // 1 verified 0 not verified by dosen wali
      type: DataTypes.CHAR,
    },
    jml_sks: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    file_irs: {
      type: DataTypes.CHAR,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Mahasiswa.hasOne(IRS, { foreignKey: "nim", sourceKey: "nim" });
IRS.belongsTo(Mahasiswa, { foreignKey: "nim", sourceKey: "nim" });

(async () => {
  await db.sync();
})();

export default IRS;
