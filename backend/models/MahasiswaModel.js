import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Dosen from "./DosenModel.js";

const { DataTypes } = Sequelize;

const Mahasiswa = db.define(
  "tb_mhs",
  {
    nim: {
      type: DataTypes.CHAR,
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nama: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status_mhs: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    jalur_masuk: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    no_hp: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    angkatan: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    tempat_lahir: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    tgl_lahir: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    kode_wali: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    kodepos: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    kelurahan: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    kecamatan: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    kota: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    provinsi: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Mahasiswa.hasOne(Dosen, { foreignKey: "kode_wali", sourceKey: "kode_wali" });
Dosen.belongsTo(Mahasiswa, { foreignKey: "kode_wali", sourceKey: "kode_wali" });

(async () => {
  await db.sync();
})();

export default Mahasiswa;
