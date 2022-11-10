import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Mahasiswa from "./MahasiswaModel.js";
import User from "./UserModel.js";

const { DataTypes } = Sequelize;

const PKL = db.define(
  "tb_pkl",
  {
    nim: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    status_mhs: {
      type: DataTypes.CHAR,
    },
    status_pkl: {
      type: DataTypes.CHAR,
    },
    smt_pkl: {
      type: DataTypes.CHAR,
    },
    nilai_pkl: {
      type: DataTypes.CHAR,
    },
    file_pkl: {
      type: DataTypes.CHAR,
    },
    status_verifikasi: {
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

User.hasOne(PKL, { foreignKey: "nim", sourceKey: "nim" });
PKL.belongsTo(User, { foreignKey: "nim", sourceKey: "nim" });

Mahasiswa.hasOne(PKL, { foreignKey: "nim", sourceKey: "nim" });
PKL.belongsTo(Mahasiswa, { foreignKey: "nim", sourceKey: "nim" });

(async () => {
  await db.sync();
})();

export default PKL;
