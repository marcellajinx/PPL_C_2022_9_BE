import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Dosen = db.define(
  "tb_dosen",
  {
    kode_wali: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      validate: {
        notEmpty: true,
      },
    },
    nip: {
      type: DataTypes.CHAR,
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
    email: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    no_hp: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    image: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

(async () => {
  await db.sync();
})();

export default Dosen;
