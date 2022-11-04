import { Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./UserModel.js";
import Mahasiswa from "./MahasiswaModel.js";

const { DataTypes } = Sequelize;

const Skripsi = db.define(
  "tb_skripsi",
  {
    nim: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    status_mhs: {
      type: DataTypes.CHAR,
    },
    status_skripsi: {
      type: DataTypes.CHAR,
    },
    nilai_skripsi: {
      type: DataTypes.CHAR,
    },
    lama_studi: {
      type: DataTypes.CHAR,
    },
    tgl_sidang: {
      type: DataTypes.DATE,
    },
    file_skripsi: {
      type: DataTypes.CHAR,
    },
    status_verifikasi: {
      type: DataTypes.CHAR,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

User.hasOne(Skripsi, { foreignKey: "nim", sourceKey: "nim" });
Skripsi.belongsTo(User, { foreignKey: "nim", sourceKey: "nim" });

Mahasiswa.hasOne(Skripsi, { foreignKey: "nim", sourceKey: "nim" });
Skripsi.belongsTo(Mahasiswa, { foreignKey: "nim", sourceKey: "nim" });

(async () => {
  await db.sync();
})();

export default Skripsi;
