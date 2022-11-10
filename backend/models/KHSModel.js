import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Mahasiswa from "./MahasiswaModel.js";

const { DataTypes } = Sequelize;

const KHS = db.define(
  "tb_khs",
  {
    smt_khs: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    nim: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    status_khs: {
      // 1 verified 0 not verified by dosen wali
      type: DataTypes.CHAR,
    },
    jml_sks: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    jml_sksk: {
      type: DataTypes.CHAR,
    },
    ips: {
      type: DataTypes.CHAR,
    },
    ipk: {
      type: DataTypes.CHAR,
    },
    file_khs: {
      type: DataTypes.CHAR,
    },
    url: {
      type: DataTypes.CHAR,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Mahasiswa.hasOne(KHS, { foreignKey: "nim", sourceKey: "nim" });
KHS.belongsTo(Mahasiswa, { foreignKey: "nim", sourceKey: "nim" });

(async () => {
  await db.sync();
})();

export default KHS;
